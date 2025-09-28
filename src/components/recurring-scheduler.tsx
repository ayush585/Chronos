"use client";

import { useEffect, useMemo, useState } from "react";
import {
  useAccount,
  useReadContract,
  useWriteContract,
} from "wagmi";
import { Address, erc20Abi, formatUnits, parseUnits } from "viem";
import { waitForTransactionReceipt } from "wagmi/actions";

import { config } from "@/lib/wagmi";
import {
  PYUSD_ADDRESS,
  PYUSD_DECIMALS,
  PYUSD_SYMBOL,
} from "@/lib/pyusd";
import { WalletButton } from "./wallet-button";

type Recurrence = "daily" | "weekly" | "monthly" | "custom";

interface Schedule {
  id: string;
  owner: Address;
  recipient: Address;
  amount: string;
  recurrence: Recurrence;
  everyDays?: number;
  note?: string;
  startAt: string;
  nextRun: string;
  paused: boolean;
  executedCount: number;
}

interface FormState {
  recipient: string;
  amount: string;
  recurrence: Recurrence;
  everyDays: string;
  startAt: string;
  note: string;
}

const STORAGE_KEY = "pyusd-recurring-schedules";

const initialFormState: FormState = {
  recipient: "",
  amount: "",
  recurrence: "weekly",
  everyDays: "7",
  startAt: new Date().toISOString().slice(0, 16),
  note: "",
};

function createEmptySchedules(): Schedule[] {
  return [];
}

function loadAllSchedules(): Schedule[] {
  if (typeof window === "undefined") {
    return createEmptySchedules();
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return createEmptySchedules();
    }
    const parsed = JSON.parse(raw) as Schedule[];
    if (!Array.isArray(parsed)) {
      return createEmptySchedules();
    }
    return parsed;
  } catch (error) {
    console.error("Failed to read schedules", error);
    return createEmptySchedules();
  }
}

function persistSchedules(all: Schedule[]) {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}

function sanitizedAddress(value: string): Address {
  return value.trim().toLowerCase() as Address;
}

function isValidAddress(value: string) {
  const trimmed = value.trim();
  return /^0x[a-fA-F0-9]{40}$/.test(trimmed);
}

function nextRunFrom(schedule: Schedule, from?: Date) {
  const base = from ? new Date(from) : new Date(schedule.nextRun);
  const copy = new Date(base.getTime());
  switch (schedule.recurrence) {
    case "daily":
      copy.setDate(copy.getDate() + 1);
      break;
    case "weekly":
      copy.setDate(copy.getDate() + 7);
      break;
    case "monthly":
      copy.setMonth(copy.getMonth() + 1);
      break;
    case "custom":
      copy.setDate(copy.getDate() + (schedule.everyDays || 1));
      break;
  }
  return copy.toISOString();
}

function describeRecurrence(schedule: Schedule) {
  switch (schedule.recurrence) {
    case "daily":
      return "Every day";
    case "weekly":
      return "Every week";
    case "monthly":
      return "Every month";
    case "custom":
      return "Every " + (schedule.everyDays || 1) + " days";
    default:
      return "Recurring";
  }
}

function formatDateLabel(iso: string) {
  const date = new Date(iso);
  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatRelativeTime(targetIso: string, now: Date) {
  const target = new Date(targetIso);
  const diffMs = target.getTime() - now.getTime();
  const diffSeconds = Math.round(diffMs / 1000);
  const formatter = new Intl.RelativeTimeFormat(undefined, {
    numeric: "auto",
  });
  const absolute = Math.abs(diffSeconds);
  if (absolute < 60) {
    return formatter.format(Math.round(diffSeconds), "second");
  }
  const diffMinutes = Math.round(diffSeconds / 60);
  if (Math.abs(diffMinutes) < 60) {
    return formatter.format(diffMinutes, "minute");
  }
  const diffHours = Math.round(diffMinutes / 60);
  if (Math.abs(diffHours) < 24) {
    return formatter.format(diffHours, "hour");
  }
  const diffDays = Math.round(diffHours / 24);
  if (Math.abs(diffDays) < 30) {
    return formatter.format(diffDays, "day");
  }
  const diffMonths = Math.round(diffDays / 30);
  if (Math.abs(diffMonths) < 12) {
    return formatter.format(diffMonths, "month");
  }
  const diffYears = Math.round(diffMonths / 12);
  return formatter.format(diffYears, "year");
}

function makeSchedule(form: FormState, owner: Address): Schedule {
  const base = new Date(form.startAt ? form.startAt : new Date().toISOString());
  const sanitizedOwner = sanitizedAddress(owner);
  const record: Schedule = {
    id: Date.now().toString(36) + Math.random().toString(16).slice(2, 8),
    owner: sanitizedOwner,
    recipient: sanitizedAddress(form.recipient),
    amount: form.amount.trim(),
    recurrence: form.recurrence,
    everyDays: form.recurrence === "custom" ? Number(form.everyDays || "1") : undefined,
    note: form.note.trim(),
    startAt: base.toISOString(),
    nextRun: base.toISOString(),
    paused: false,
    executedCount: 0,
  };
  return record;
}

function filterByOwner(all: Schedule[], owner?: Address | null) {
  if (!owner) {
    return createEmptySchedules();
  }
  const safeOwner = sanitizedAddress(owner);
  return all.filter((item) => sanitizedAddress(item.owner) === safeOwner);
}

export function RecurringScheduler() {
  const { address, isConnected } = useAccount();
  const [form, setForm] = useState<FormState>(initialFormState);
  const [schedules, setSchedules] = useState<Schedule[]>(createEmptySchedules());
  const [now, setNow] = useState(new Date());
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [statusTone, setStatusTone] = useState<"neutral" | "error" | "success">(
    "neutral",
  );
  const [executingId, setExecutingId] = useState<string | null>(null);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setNow(new Date());
    }, 15000);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!address) {
      setSchedules(createEmptySchedules());
      return;
    }
    const all = loadAllSchedules();
    setSchedules(filterByOwner(all, address));
  }, [address]);

  useEffect(() => {
    if (!address) {
      return;
    }
    const all = loadAllSchedules();
    const others = all.filter((item) => sanitizedAddress(item.owner) !== sanitizedAddress(address));
    const merged = others.concat(schedules);
    persistSchedules(merged);
  }, [schedules, address]);

  const { data: balanceData, refetch: refetchBalance } = useReadContract({
    abi: erc20Abi,
    address: PYUSD_ADDRESS,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: {
      enabled: Boolean(address),
    },
  });

  const formattedBalance = useMemo(() => {
    if (!balanceData) {
      return null;
    }
    try {
      return formatUnits(balanceData as bigint, PYUSD_DECIMALS);
    } catch (error) {
      console.error("Failed to format balance", error);
      return null;
    }
  }, [balanceData]);

  const { writeContractAsync } = useWriteContract();

  function resetForm() {
    setForm({
      ...initialFormState,
      startAt: new Date().toISOString().slice(0, 16),
    });
  }

  function updateForm<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  function handleCreateSchedule(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!address) {
      setStatusTone("error");
      setStatusMessage("Connect your wallet first.");
      return;
    }
    if (!isValidAddress(form.recipient)) {
      setStatusTone("error");
      setStatusMessage("Recipient address must be a valid Ethereum address.");
      return;
    }
    if (!form.amount || Number(form.amount) <= 0) {
      setStatusTone("error");
      setStatusMessage("Enter a PYUSD amount greater than zero.");
      return;
    }
    if (form.recurrence === "custom") {
      const days = Number(form.everyDays || "0");
      if (Number.isNaN(days) || days <= 0) {
        setStatusTone("error");
        setStatusMessage("Custom intervals must be at least 1 day.");
        return;
      }
    }

    const schedule = makeSchedule(form, address);
    setSchedules((prev) => prev.concat(schedule));
    resetForm();
    setStatusTone("success");
    setStatusMessage("Schedule added. It will appear in your active list.");
  }

  function togglePause(id: string) {
    setSchedules((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              paused: !item.paused,
            }
          : item,
      ),
    );
  }

  function removeSchedule(id: string) {
    setSchedules((prev) => prev.filter((item) => item.id !== id));
  }

  async function executeSchedule(schedule: Schedule) {
    if (!address) {
      setStatusTone("error");
      setStatusMessage("Connect your wallet to execute transfers.");
      return;
    }
    try {
      setExecutingId(schedule.id);
      setStatusTone("neutral");
      setStatusMessage("Confirm the transaction in your wallet.");
      const amount = parseUnits(schedule.amount, PYUSD_DECIMALS);
      const hash = await writeContractAsync({
        abi: erc20Abi,
        address: PYUSD_ADDRESS,
        functionName: "transfer",
        args: [schedule.recipient, amount],
      });
      await waitForTransactionReceipt(config, {
        hash,
      });
      setStatusTone("success");
      setStatusMessage("Transfer confirmed on-chain.");
      setSchedules((prev) =>
        prev.map((item) =>
          item.id === schedule.id
            ? {
                ...item,
                nextRun: nextRunFrom(item, new Date(schedule.nextRun)),
                executedCount: item.executedCount + 1,
              }
            : item,
        ),
      );
      void refetchBalance();
    } catch (error) {
      console.error("Error sending PYUSD", error);
      setStatusTone("error");
      setStatusMessage("PYUSD transfer failed or was cancelled.");
    } finally {
      setExecutingId(null);
    }
  }

  const dueSchedules = schedules.filter((item) => {
    if (item.paused) {
      return false;
    }
    return new Date(item.nextRun).getTime() <= now.getTime();
  });

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-10 sm:px-8">
      <header className="flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-lg shadow-black/40 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold sm:text-3xl">PYUSD Scheduler</h1>
          <p className="text-sm text-slate-300 sm:text-base">
            Automate future {PYUSD_SYMBOL} transfers on the Sepolia testnet. Draft
            schedules and execute each cycle when it is due.
          </p>
          {formattedBalance && (
            <p className="text-xs text-slate-400 sm:text-sm">
              Wallet balance: {formattedBalance} {PYUSD_SYMBOL}
            </p>
          )}
        </div>
        <div className="flex flex-col items-stretch gap-2 sm:items-end">
          <WalletButton />
        </div>
      </header>

      {statusMessage && (
        <div
          className={
            "rounded-xl border px-4 py-3 text-sm" +
            (statusTone === "error"
              ? " border-red-500/60 bg-red-500/10 text-red-200"
              : statusTone === "success"
              ? " border-emerald-500/60 bg-emerald-500/10 text-emerald-200"
              : " border-slate-600/60 bg-slate-800/80 text-slate-200")
          }
        >
          {statusMessage}
        </div>
      )}

      <section className="grid gap-8 lg:grid-cols-[2fr_3fr]">
        <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-lg shadow-black/40">
          <h2 className="text-lg font-semibold text-slate-100">New recurring transfer</h2>
          <p className="text-sm text-slate-400">
            Specify who should receive {PYUSD_SYMBOL}, how much, and how often.
          </p>
          <form className="space-y-4" onSubmit={handleCreateSchedule}>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider text-slate-400">
                Recipient address
              </label>
              <input
                className="w-full rounded-lg border border-slate-700 bg-slate-950/80 px-3 py-2 font-mono text-sm text-slate-100 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30"
                placeholder="0x..."
                value={form.recipient}
                onChange={(event) => updateForm("recipient", event.target.value)}
                required
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider text-slate-400">
                  Amount in {PYUSD_SYMBOL}
                </label>
                <input
                  className="w-full rounded-lg border border-slate-700 bg-slate-950/80 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30"
                  type="number"
                  min="0"
                  step="0.000001"
                  value={form.amount}
                  onChange={(event) => updateForm("amount", event.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider text-slate-400">
                  Starts on
                </label>
                <input
                  className="w-full rounded-lg border border-slate-700 bg-slate-950/80 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30"
                  type="datetime-local"
                  value={form.startAt}
                  onChange={(event) => updateForm("startAt", event.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <span className="text-xs uppercase tracking-wider text-slate-400">
                Recurrence
              </span>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {(["daily", "weekly", "monthly", "custom"] as Recurrence[]).map((option) => (
                  <button
                    key={option}
                    type="button"
                    className={
                      "rounded-xl border px-3 py-2 text-sm transition" +
                      (form.recurrence === option
                        ? " border-emerald-400 bg-emerald-500/10 text-emerald-200"
                        : " border-slate-700 bg-slate-950/60 text-slate-300 hover:border-slate-500")
                    }
                    onClick={() => updateForm("recurrence", option)}
                  >
                    {option === "daily"
                      ? "Daily"
                      : option === "weekly"
                      ? "Weekly"
                      : option === "monthly"
                      ? "Monthly"
                      : "Custom"}
                  </button>
                ))}
              </div>
              {form.recurrence === "custom" && (
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-slate-400">
                    Every how many days?
                  </label>
                  <input
                    className="w-full rounded-lg border border-slate-700 bg-slate-950/80 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30"
                    type="number"
                    min="1"
                    value={form.everyDays}
                    onChange={(event) => updateForm("everyDays", event.target.value)}
                  />
                </div>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider text-slate-400">
                Notes (optional)
              </label>
              <textarea
                className="min-h-[80px] w-full rounded-lg border border-slate-700 bg-slate-950/80 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30"
                placeholder="E.g. Payroll, savings, staking"
                value={form.note}
                onChange={(event) => updateForm("note", event.target.value)}
              />
            </div>
            <button
              className="w-full rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:bg-emerald-500/50"
              type="submit"
              disabled={!isConnected || connectStatus === "connecting"}
            >
              {isConnected ? "Add schedule" : "Connect wallet to create"}
            </button>
          </form>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-lg shadow-black/40">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-100">Active schedules</h2>
              <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">
                {schedules.length} total
              </span>
            </div>
            {schedules.length === 0 && (
              <p className="mt-6 text-sm text-slate-400">
                Draft your first schedule to see it listed here. Each entry lives in
                your browser storage, so you stay in control.
              </p>
            )}
            <div className="mt-6 space-y-4">
              {schedules.map((schedule) => {
                const due = new Date(schedule.nextRun).getTime() <= now.getTime();
                const relative = formatRelativeTime(schedule.nextRun, now);
                return (
                  <article
                    key={schedule.id}
                    className={
                      "rounded-xl border p-5 transition" +
                      (schedule.paused
                        ? " border-slate-700 bg-slate-950/40 opacity-70"
                        : due
                        ? " border-emerald-400 bg-emerald-500/10"
                        : " border-slate-700 bg-slate-950/60")
                    }
                  >
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div className="space-y-2">
                        <h3 className="text-base font-semibold text-slate-100">
                          {schedule.amount} {PYUSD_SYMBOL}
                        </h3>
                        <p className="text-xs text-slate-400">
                          To {schedule.recipient.slice(0, 6)}…{schedule.recipient.slice(-4)}
                        </p>
                        <p className="text-xs text-slate-300">
                          {describeRecurrence(schedule)} · Next on {formatDateLabel(schedule.nextRun)} ({relative})
                        </p>
                        {schedule.note && (
                          <p className="text-xs text-slate-400">{schedule.note}</p>
                        )}
                        <p className="text-xs text-slate-500">
                          Executed {schedule.executedCount} time(s)
                        </p>
                      </div>
                      <div className="flex flex-col gap-2 md:items-end">
                        <button
                          className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:bg-emerald-500/40"
                          onClick={() => executeSchedule(schedule)}
                          disabled={schedule.paused || executingId === schedule.id}
                        >
                          {executingId === schedule.id
                            ? "Sending…"
                            : due
                            ? "Execute now"
                            : "Send ahead of time"}
                        </button>
                        <div className="flex gap-2">
                          <button
                            className="rounded-lg border border-slate-700 px-3 py-1 text-xs text-slate-300 transition hover:border-slate-500 hover:text-slate-100"
                            onClick={() => togglePause(schedule.id)}
                          >
                            {schedule.paused ? "Resume" : "Pause"}
                          </button>
                          <button
                            className="rounded-lg border border-red-500/40 px-3 py-1 text-xs text-red-300 transition hover:border-red-500 hover:text-red-200"
                            onClick={() => removeSchedule(schedule.id)}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          {schedules.length > 0 && (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-lg shadow-black/40">
              <h2 className="text-lg font-semibold text-slate-100">Due reminders</h2>
              {dueSchedules.length === 0 ? (
                <p className="mt-3 text-sm text-slate-400">
                  No schedules are due right now. Keep this tab open to monitor
                  upcoming transfers.
                </p>
              ) : (
                <ul className="mt-4 space-y-3 text-sm text-slate-200">
                  {dueSchedules.map((schedule) => (
                    <li key={schedule.id} className="rounded-lg border border-emerald-400/50 bg-emerald-500/10 px-4 py-3">
                      <span className="font-semibold">{schedule.amount} {PYUSD_SYMBOL}</span>
                      <span className="text-slate-300"> to {schedule.recipient.slice(0, 6)}…{schedule.recipient.slice(-4)}</span>
                      <div className="text-xs text-slate-300">
                        Due since {formatDateLabel(schedule.nextRun)}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
