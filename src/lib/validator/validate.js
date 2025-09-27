import { TOKENS, CHAINS } from "./tokens.js";
import { scheduleToPeriodSeconds } from "./schedule.js";
import { normalizeSymbol, normalizeAddressMaybe } from "./normalize.js";
import { amountToUnits } from "./units.js";
import { resolveMaybeENS } from "./ens.js";
import { toBytes32, toX8 } from "../utils/bytes.js";

const MAX_AMOUNT_18 = (10n * (10n ** 20n)); // 10 * 1e20 (demo cap)
const MIN_PERIOD = 3600; // 1 hour

export async function validateAndPlan(intent) {
  if (intent.action !== "send") throw new Error("Only 'send' action is supported in MVP");

  // Chain: fixed to SEPOLIA for MVP
  const chainKey = "SEPOLIA";
  const chain = CHAINS[chainKey];

  // Token allowlist
  const tokenSym = normalizeSymbol(intent.asset);
  const tokenMeta = TOKENS[chainKey]?.[tokenSym];
  if (!tokenMeta) throw new Error(`Token ${tokenSym} not allowlisted on ${chainKey}`);
  const tokenAddr = tokenMeta.address;
  const tokenDecimals = tokenMeta.decimals ?? 18;

  // Beneficiary: ENS or address
  let beneficiary = normalizeAddressMaybe(intent.to);
  if (String(beneficiary).toLowerCase().endsWith(".eth")) {
    const resolved = await resolveMaybeENS(beneficiary);
    beneficiary = resolved;
    if (!/^0x[a-fA-F0-9]{40}$/.test(String(beneficiary))) {
      throw new Error("ENS name did not resolve to an address. Provide a 0x address or set ENS_RPC.");
    }
  } else {
    if (!/^0x[a-fA-F0-9]{40}$/.test(String(beneficiary))) {
      throw new Error("Beneficiary must be a 0x address or a resolvable ENS name.");
    }
  }

  // Amount → token units
  const amountUnits = await amountToUnits(intent.amount, tokenDecimals);
  if (amountUnits === 0n) throw new Error("Amount must be greater than 0");

  // Safety cap (approximate to 18-decimals)
  const as18 = tokenDecimals === 18 ? amountUnits : (amountUnits * (10n ** (18n - BigInt(tokenDecimals))));
  if (as18 > MAX_AMOUNT_18) throw new Error("Amount exceeds safety cap for MVP");

  // Schedule → seconds
  const periodSeconds = scheduleToPeriodSeconds(intent.schedule);
  if (periodSeconds < MIN_PERIOD) throw new Error("Minimum period is 1 hour");

  // Oracle / symbol / threshold
  const symbol = normalizeSymbol(intent.condition?.symbol);
  const symbolBytes32 = toBytes32(symbol);
  const thresholdX8 = toX8(intent.condition?.threshold);
  if (thresholdX8 <= 0) throw new Error("Threshold must be greater than 0");
  if (thresholdX8 > 9_000_000_000_000) throw new Error("Threshold too large");

  // Mock oracle for MVP (swap to Pyth later)
  const oracle = "0x0000000000000000000000000000000000000001";
  const owner = process.env.DEPLOYER_ADDRESS || "";

  return {
    chain: chainKey,
    chainId: chain.chainId,
    tokenSym,
    tokenAddr,
    tokenDecimals,
    owner,
    beneficiary,
    amountWei: amountUnits.toString(),  // keep field name for consistency
    periodSeconds,
    oracle,
    symbolBytes32,
    thresholdX8
  };
}
