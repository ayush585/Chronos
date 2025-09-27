// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
interface IOracleX8 {
  function getPriceX8(bytes32 symbol) external view returns(uint64 priceX8, uint64 lastTs);
}
"

# --- lib/oneinch ---
W "src/lib/oneinch/quote.js" "export async function getQuote(){ /* wired via /api/quote */ }"

# --- lib/uniswap ---
W "src/lib/uniswap/v4HookScaffold.sol" @"
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
// Scaffold-only: show how a v4 hook might enforce max slippage or oracle deviation.
"

# --- lib/utils ---
W "src/lib/utils/bytes.js" @"
export function toBytes32(s){ const enc=new TextEncoder().encode(s); const buf=new Uint8Array(32); buf.set(enc.slice(0,32)); return '0x'+Buffer.from(buf).toString('hex'); }
export function toX8(n){ const x=String(n); const [i,f='']=x.split('.'); const frac=(f+'00000000').slice(0,8); return Number(${i}); }
