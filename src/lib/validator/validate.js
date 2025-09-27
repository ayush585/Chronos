import { TOKENS } from './tokens';
import { scheduleToPeriodSeconds } from './schedule';
import { normalizeSymbol, normalizeAddressMaybe } from './normalize';
import { amountToWei } from './units';

function toBytes32(s){ const enc = new TextEncoder().encode(s); const buf = new Uint8Array(32); buf.set(enc.slice(0,32)); return '0x'+Buffer.from(buf).toString('hex'); }
function toX8(n){ const x = String(n); const [i,f=''] = x.split('.'); const frac = (f+'00000000').slice(0,8); return Number(${i}); }

export async function validateAndPlan(intent){
  if(intent.action!=='send') throw new Error('Only \"send\" supported');
  const chain='SEPOLIA';
  const tokenSym = normalizeSymbol(intent.asset);
  const tokenAddr = TOKENS[chain]?.[tokenSym];
  if(!tokenAddr) throw new Error(\Token \ not allowlisted on \\);

  const to = normalizeAddressMaybe(intent.to);
  const amountWei = await amountToWei(intent.amount, 18);
  const periodSeconds = scheduleToPeriodSeconds(intent.schedule);
  const symbolBytes32 = toBytes32(normalizeSymbol(intent.condition.symbol));
  const thresholdX8 = toX8(intent.condition.threshold);

  // Safety caps (simple defaults)
  if(amountWei > BigInt(10)*BigInt(10)**BigInt(20)) throw new Error('Amount too large for MVP cap');
  if(periodSeconds < 3600) throw new Error('Min period is 1 hour for safety');

  return {
    chain,
    tokenSym,
    tokenAddr,
    beneficiary: to,
    amountWei: amountWei.toString(),
    periodSeconds,
    oracle: '0x0000000000000000000000000000000000000001', // MockOracle for demo
    symbolBytes32,
    thresholdX8
  };
}
