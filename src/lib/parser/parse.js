import { CORE_PATTERN, SCHEDULES, SCHEDULE_ALIASES, ADDRESS_RE, ENS_RE } from "./grammar";

// Pretty error helper
function fail(msg, hint) {
  const h = hint ? `\nHint: ${hint}` : "";
  const ex = new Error(msg + h);
  ex.code = "PARSE_ERROR";
  throw ex;
}

function normalizeNumber(nStr) {
  const cleaned = String(nStr).replace(/,/g, "");
  if (!/^\d+(\.\d+)?$/.test(cleaned)) {
    fail("Invalid number format.", "Use digits only, e.g., 10 or 10.5");
  }
  return cleaned;
}

function normalizeTokenSym(sym) {
  return String(sym).toUpperCase();
}

function normalizeSchedule(s) {
  const key = String(s).toLowerCase();
  const mapped = SCHEDULE_ALIASES[key] || key;
  if (!SCHEDULES.includes(mapped)) {
    fail(
      `Unsupported schedule "${s}".`,
      'Allowed: "daily", "weekly", "monthly". Aliases like "day/week/month" work too.'
    );
  }
  return mapped;
}

function isENS(x) {
  return ENS_RE.test(x);
}
function isAddress(x) {
  return ADDRESS_RE.test(x);
}

export function parseIntent(input) {
  const line = (input || "").trim();
  if (!line) {
    fail("Empty input.", 'Try: Send 10 PYUSD to alice.eth every weekly until ETH > 3000');
  }

  const m = line.match(CORE_PATTERN);
  if (!m) {
    fail(
      "Could not parse.",
      'Expected: Send <amount> <TOKEN> to <ensOrAddress> every <daily|weekly|monthly> until <SYMBOL> > <threshold>'
    );
  }

  const [, amtRaw, tokenRaw, toRaw, schedRaw, symRaw, thrRaw] = m;

  const amount = normalizeNumber(amtRaw);
  if (Number(amount) <= 0) fail("Amount must be greater than 0.");

  const asset = normalizeTokenSym(tokenRaw);
  const schedule = normalizeSchedule(schedRaw);

  // destination check: allow ENS or address
  const to = String(toRaw).trim();
  if (!(isENS(to) || isAddress(to))) {
    fail(
      `Invalid beneficiary "${to}".`,
      "Use a 0x-address or ENS name ending with .eth (e.g., alice.eth)"
    );
  }

  const symbol = normalizeTokenSym(symRaw);
  const threshold = normalizeNumber(thrRaw);
  if (Number(threshold) <= 0) fail("Threshold must be greater than 0.");

  return {
    action: "send",
    asset,                 // e.g., 'PYUSD'
    amount,                // string numeric
    to,                    // ENS or 0x...
    schedule,              // 'daily' | 'weekly' | 'monthly'
    condition: {
      price_gt: true,
      symbol,              // e.g., 'ETH'
      threshold: threshold
    }
  };
}
