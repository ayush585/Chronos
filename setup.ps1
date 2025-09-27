# =========================
# Intent Fusion Layer — Full Repo Scaffold (PowerShell)
# Creates all folders and files with runnable stubs.
# =========================

$ErrorActionPreference = "Stop"
$newlines = "`r`n"

function W($path, $content) {
  New-Item -ItemType File -Force -Path $path | Out-Null
  Set-Content -Path $path -Value $content -Encoding UTF8
}

# --- FOLDERS ---
$dirs = @(
  "public",
  "src/pages/api","src/pages","src/components","src/styles",
  "src/lib/parser","src/lib/validator","src/lib/compiler","src/lib/deploy",
  "src/lib/oracle","src/lib/oneinch","src/lib/uniswap","src/lib/utils","src/lib/schemas",
  "src/generated/contracts","src/generated/manifests",
  "contracts/src","contracts/test","contracts/script","contracts/lib",
  "scripts","docs"
)
$dirs | ForEach-Object { New-Item -ItemType Directory -Force -Path $_ | Out-Null }

# --- .gitignore ---
W ".gitignore" @"
node_modules
.next
.env
out
dist
coverage
cache
*.log
contracts/out
contracts/cache
src/generated/manifests/*
"@

# --- package.json (Next + viem + Foundry helpers) ---
W "package.json" @"
{
  "name": "intent-fusion",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start -p 3000",
    "lint": "echo \"(No ESLint configured)\"",
    "forge:build": "cd contracts && forge build",
    "forge:test": "cd contracts && forge test -vvv",
    "anvil": "anvil",
    "postinstall": "node -e \"console.log('✓ postinstall complete')\"",
    "deploy:viem": "node scripts/deploy-viem.js",
    "simulate": "node scripts/simulate.js",
    "set:mock:price": "node scripts/set-mock-price.js"
  },
  "dependencies": {
    "axios": "^1.7.7",
    "ethers": "^6.13.2",
    "handlebars": "^4.7.8",
    "viem": "^2.21.15",
    "zustand": "^4.5.5",
    "next": "14.2.15",
    "react": "18.3.1",
    "react-dom": "18.3.1"
  },
  "devDependencies": {
    "prettier": "^3.3.3"
  }
}
"@

# --- next.config.mjs ---
W "next.config.mjs" @"
/** @type {import('next').NextConfig} */
const nextConfig = { reactStrictMode: true };
export default nextConfig;
"@

# --- jsconfig.json (alias) ---
W "jsconfig.json" @"
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": { "@/*": ["src/*"] }
  }
}
"@

# --- README.md ---
W "README.md" @"
# Intent Fusion Layer (Zapier for DeFi Intents)

**One-liner:** Users type \"Send 10 PYUSD to alice.eth every Friday until ETH > 3000\" → we parse → validate → compile a minimal smart contract → deploy to Sepolia → execute on schedule unless a Pyth price condition stops it. Pause/cancel anytime.

## Quickstart
\`\`\`bash
pnpm install
cp .env.example .env    # fill RPC + PRIVATE_KEY (throwaway)
pnpm dev
# open http://localhost:3000
\`\`\`

## Useful scripts
- \`pnpm forge:build\` — compile contracts
- \`pnpm forge:test\` — run Foundry tests
- \`pnpm deploy:viem\` — deploy compiled artifact using viem + manifest
- \`pnpm simulate\` — local time-warp demo (anvil)
- \`pnpm set:mock:price\` — set MockOracle price for demo

See **docs/** for architecture, threat model, sponsors, demo script, roadmap.
"@

# --- .env.example ---
W ".env.example" @"
# RPC / Keys
SEPOLIA_RPC=https://sepolia.infura.io/v3/<YOUR_KEY>
PRIVATE_KEY=0xYOUR_THROWAWAY_PRIVATE_KEY
DEPLOYER_ADDRESS=0xYourEOA

# ENS read (mainnet/provider that supports ENS)
ENS_RPC=https://mainnet.infura.io/v3/<YOUR_KEY>

# 1inch
ONEINCH_BASE_URL=https://api.1inch.dev/swap/v6.0
ONEINCH_API_KEY=<key>

# Pyth (for docs; demo uses MockOracle)
PYTH_ENDPOINT=https://hermes.pyth.network
"@

# --- Public favicon placeholder ---
W "public/favicon.ico" ""  # empty; you can drop an icon later

# --- styles ---
W "src/styles/globals.css" @"
:root{--bg:#0b0b0b;--fg:#f0f0f0;--muted:#9aa0a6}
html,body{padding:0;margin:0;background:#09090b;color:#e5e7eb;font-family:system-ui,Segoe UI,Roboto,Arial}
textarea,input,button{font:inherit}
.container{max-width:980px;margin:32px auto;padding:0 16px}
.card{background:#111213;border:1px solid #1f2937;border-radius:12px;padding:16px}
.row{display:flex;gap:12px;align-items:center;flex-wrap:wrap}
.mono{font-family:ui-monospace,SFMono-Regular,Consolas,monospace;font-size:13px;white-space:pre-wrap;word-break:break-word}
.btn{padding:10px 14px;border-radius:10px;border:1px solid #374151;background:#0f172a;color:#e5e7eb;cursor:pointer}
.btn:disabled{opacity:.5;cursor:not-allowed}
input,textarea{background:#0b1220;border:1px solid #253047;border-radius:8px;color:#e5e7eb;padding:10px 12px}
"@

# --- pages/_app.js ---
W "src/pages/_app.js" @"
import '@/styles/globals.css';
export default function App({ Component, pageProps }) { return <Component {...pageProps} />; }
"@

# --- pages/index.js (single-page UI) ---
W "src/pages/index.js" @"
import { useState } from 'react';

export default function Home(){
  const [text,setText]=useState('Send 10 PYUSD to alice.eth every Friday until ETH > 3000');
  const [intent,setIntent]=useState(null);
  const [sol,setSol]=useState('');
  const [manifest,setManifest]=useState(null);
  const [deployRes,setDeployRes]=useState(null);
  const [loading,setLoading]=useState('');

  async function hit(path,body){
    const res = await fetch(path,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
    const j = await res.json();
    if(!res.ok) throw new Error(j.error||'Request failed');
    return j;
  }

  return (
    <div className='container'>
      <h1>Intent Fusion Layer — MVP</h1>
      <div className='card' style={{marginTop:12}}>
        <label>Natural Language</label>
        <textarea rows={3} value={text} onChange={e=>setText(e.target.value)} />
        <div className='row'>
          <button className='btn' disabled={!!loading} onClick={async()=>{
            setLoading('parse'); try{ setIntent(await hit('/api/parse',{text})); }catch(e){ alert(e.message); } setLoading('');
          }}>Parse → JSON</button>

          <button className='btn' disabled={!intent||!!loading} onClick={async()=>{
            setLoading('compile'); try{
              const { solidity, manifest } = await hit('/api/compile',{intent});
              setSol(solidity); setManifest(manifest);
            }catch(e){ alert(e.message); } setLoading('');
          }}>Compile → Solidity</button>

          <button className='btn' disabled={!manifest||!!loading} onClick={async()=>{
            setLoading('deploy'); try{ setDeployRes(await hit('/api/deploy',{manifest})); }catch(e){ alert(e.message); } setLoading('');
          }}>Deploy (Sepolia)</button>
        </div>
      </div>

      {intent && <div className='card' style={{marginTop:12}}>
        <h3>Intent JSON</h3><pre className='mono'>{JSON.stringify(intent,null,2)}</pre>
      </div>}
      {sol && <div className='card' style={{marginTop:12}}>
        <h3>Solidity</h3><pre className='mono'>{sol}</pre>
      </div>}
      {manifest && <div className='card' style={{marginTop:12}}>
        <h3>Manifest</h3><pre className='mono'>{JSON.stringify(manifest,null,2)}</pre>
      </div>}
      {deployRes && <div className='card' style={{marginTop:12}}>
        <h3>Deployed</h3>
        <div>Address: <code>{deployRes.address}</code></div>
        {deployRes.explorer && <a className='btn' href={deployRes.explorer} target='_blank'>Open in Explorer</a>}
      </div>}
    </div>
  );
}
"@

# --- API routes ---
W "src/pages/api/healthz.js" "export default (_,res)=>res.status(200).json({ok:true,ts:Date.now()});"

W "src/pages/api/parse.js" @"
import { parseIntent } from '@/lib/parser/parse';
export default async function handler(req,res){
  try{
    const { text } = req.body||{};
    if(!text) return res.status(400).json({ error:'Missing text' });
    const intent = parseIntent(text);
    res.json(intent);
  }catch(e){ res.status(400).json({ error: e.message||String(e) }); }
}
"@

W "src/pages/api/compile.js" @"
import { validateAndPlan } from '@/lib/validator/validate';
import { compileFromPlan } from '@/lib/compiler/compile';
export default async function handler(req,res){
  try{
    const { intent } = req.body||{};
    if(!intent) return res.status(400).json({ error:'Missing intent' });
    const plan = await validateAndPlan(intent);
    const { solidity, manifest } = await compileFromPlan(plan);
    res.json({ solidity, manifest });
  }catch(e){ res.status(400).json({ error: e.message||String(e) }); }
}
"@

W "src/pages/api/deploy.js" @"
import { deployFromManifest } from '@/lib/deploy/deploy';
export default async function handler(req,res){
  try{
    const { manifest } = req.body||{};
    if(!manifest) return res.status(400).json({ error:'Missing manifest' });
    const out = await deployFromManifest(manifest);
    res.json(out);
  }catch(e){ res.status(400).json({ error: e.message||String(e) }); }
}
"@

W "src/pages/api/quote.js" @"
import axios from 'axios';
export default async function handler(req,res){
  try{
    const { chainId, fromToken, toToken, amount } = req.query;
    const url = process.env.ONEINCH_BASE_URL || 'https://api.1inch.dev/swap/v6.0';
    const key = process.env.ONEINCH_API_KEY || '';
    const r = await axios.get(`${url}/${chainId}/quote`, { params:{ src:fromToken, dst:toToken, amount }, headers:{ Authorization: `Bearer ${key}` }});
    res.json(r.data);
  }catch(e){ res.status(400).json({ error: e.response?.data||e.message }); }
}
"@

W "src/pages/api/resolve-ens.js" @"
import { createPublicClient, http } from 'viem';
import { mainnet } from 'viem/chains';
export default async function handler(req,res){
  try{
    const { name } = req.query;
    if(!name?.endsWith('.eth')) return res.status(400).json({ error:'Not an ENS name' });
    const client = createPublicClient({ chain: mainnet, transport: http(process.env.ENS_RPC||'') });
    // TODO: real resolve; for MVP we just echo back
    res.json({ name, resolved: null });
  }catch(e){ res.status(400).json({ error:e.message }); }
}
"

# --- components (stubs) ---
W "src/components/PreflightPanel.jsx" "export default function PreflightPanel(){ return null }"
W "src/components/SafetyView.jsx" "export default function SafetyView(){ return null }"
W "src/components/CodeBlock.jsx" "export default function CodeBlock(){ return null }"
W "src/components/Steps.jsx" "export default function Steps(){ return null }"

# --- lib/parser ---
W "src/lib/parser/grammar.js" @"
export const SCHEDULES = ['daily','weekly','monthly'];
export const PATTERN = /^Send\\s+([\\d.,]+)\\s+([A-Za-z0-9]+)\\s+to\\s+([a-zA-Z0-9.\\-]+)\\s+every\\s+(daily|weekly|monthly)\\s+until\\s+([A-Za-z0-9]+)\\s*>\\s*([\\d.,]+)\\s*$/i;
"@

W "src/lib/parser/parse.js" @"
import { PATTERN } from './grammar';
export function parseIntent(text){
  const m = (text||'').trim().match(PATTERN);
  if(!m) throw new Error('Expected: Send <amount> <TOKEN> to <ensOrAddress> every <daily|weekly|monthly> until <SYMBOL> > <threshold>');
  const amount = m[1].replace(/,/g,'');
  return {
    action: 'send',
    asset: m[2].toUpperCase(),
    amount: amount,
    to: m[3],
    schedule: m[4].toLowerCase(),
    condition: { price_gt: true, symbol: m[5].toUpperCase(), threshold: m[6].replace(/,/g,'') }
  };
}
"@

# --- lib/validator ---
W "src/lib/validator/tokens.js" @"
export const TOKENS = {
  SEPOLIA: {
    PYUSD: '0x0000000000000000000000000000000000000000' // TODO: test token addr
  },
  POLYGON_AMOY: { }
};
"@

W "src/lib/validator/ens.js" @"
export async function resolveMaybeENS(nameOrAddress){ return nameOrAddress; }
"@

W "src/lib/validator/normalize.js" @"
export const normalizeSymbol = (s)=>(s||'').toUpperCase();
export const normalizeAddressMaybe = (a)=>a;
"@

W "src/lib/validator/schedule.js" @"
export function scheduleToPeriodSeconds(s){
  if(s==='daily') return 86400;
  if(s==='weekly') return 604800;
  if(s==='monthly') return 2592000;
  throw new Error('Unsupported schedule');
}
"@

W "src/lib/validator/units.js" @"
export async function amountToWei(amountStr, decimals=18){
  const [i,f=''] = String(amountStr).split('.');
  const frac = (f + '0'.repeat(decimals)).slice(0,decimals);
  return BigInt(i+frac);
}
"@

W "src/lib/validator/validate.js" @"
import { TOKENS } from './tokens';
import { scheduleToPeriodSeconds } from './schedule';
import { normalizeSymbol, normalizeAddressMaybe } from './normalize';
import { amountToWei } from './units';

function toBytes32(s){ const enc = new TextEncoder().encode(s); const buf = new Uint8Array(32); buf.set(enc.slice(0,32)); return '0x'+Buffer.from(buf).toString('hex'); }
function toX8(n){ const x = String(n); const [i,f=''] = x.split('.'); const frac = (f+'00000000').slice(0,8); return Number(`${i}${frac}`); }

export async function validateAndPlan(intent){
  if(intent.action!=='send') throw new Error('Only \"send\" supported');
  const chain='SEPOLIA';
  const tokenSym = normalizeSymbol(intent.asset);
  const tokenAddr = TOKENS[chain]?.[tokenSym];
  if(!tokenAddr) throw new Error(\`Token \${tokenSym} not allowlisted on \${chain}\`);

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
"@

# --- lib/compiler ---
W "src/lib/compiler/template.sol.hbs" @"
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IERC20 { function transferFrom(address from,address to,uint amount) external returns(bool); }
interface IOracleX8 { function getPriceX8(bytes32 symbol) external view returns (uint64 priceX8, uint64 lastTs); }

contract ConditionalRecurringIntent {
    address public immutable owner;
    IERC20  public immutable token;
    address public immutable beneficiary;
    uint256 public immutable amountWei;
    uint256 public immutable periodSeconds;
    IOracleX8 public immutable oracle;
    bytes32 public immutable symbol;
    uint64  public immutable thresholdX8;

    bool public active = true;
    uint256 public lastExecTs;

    error NotOwner(); error NotActive(); error NotDue(); error ConditionMet(); error TransferFailed();

    constructor(
        address _owner, address _token, address _beneficiary,
        uint256 _amountWei, uint256 _periodSeconds,
        address _oracle, bytes32 _symbol, uint64 _thresholdX8
    ){
        owner=_owner; token=IERC20(_token); beneficiary=_beneficiary; amountWei=_amountWei;
        periodSeconds=_periodSeconds; oracle=IOracleX8(_oracle); symbol=_symbol; thresholdX8=_thresholdX8;
    }

    modifier onlyOwner(){ if(msg.sender!=owner) revert NotOwner(); _; }

    function due() public view returns(bool){
        uint256 nextTs = lastExecTs==0 ? 0 : lastExecTs + periodSeconds;
        return block.timestamp >= nextTs;
    }

    function conditionMet() public view returns(bool){
        (uint64 px,) = oracle.getPriceX8(symbol);
        return px > thresholdX8;
    }

    function execute() external {
        if(!active) revert NotActive();
        if(!due()) revert NotDue();
        if(conditionMet()) revert ConditionMet();
        if(!token.transferFrom(owner, beneficiary, amountWei)) revert TransferFailed();
        lastExecTs = block.timestamp;
    }

    function pause() external onlyOwner { active=false; }
    function resume() external onlyOwner { active=true; }
    function cancel() external onlyOwner { active=false; }
}
"@

W "src/lib/compiler/manifest.js" @"
export function buildManifest(plan){
  return {
    version: 1,
    chain: plan.chain,
    artifact: 'ConditionalRecurringIntent.sol',
    constructorArgs: {
      owner: process.env.DEPLOYER_ADDRESS||'',
      token: plan.tokenAddr,
      beneficiary: plan.beneficiary,
      amountWei: plan.amountWei,
      periodSeconds: plan.periodSeconds,
      oracle: plan.oracle,
      symbol: plan.symbolBytes32,
      thresholdX8: plan.thresholdX8
    },
    createdAt: new Date().toISOString()
  };
}
"@

W "src/lib/compiler/compile.js" @"
import fs from 'fs';
import path from 'path';
import Handlebars from 'handlebars';
import { buildManifest } from './manifest';

export async function compileFromPlan(plan){
  const tplPath = path.join(process.cwd(),'src/lib/compiler/template.sol.hbs');
  const tpl = fs.readFileSync(tplPath,'utf8');
  const compile = Handlebars.compile(tpl);
  const solidity = compile(plan);

  const manifest = buildManifest(plan);
  const outDir = path.join(process.cwd(),'src/generated');
  fs.writeFileSync(path.join(outDir,'contracts','ConditionalRecurringIntent.sol'), solidity);
  fs.writeFileSync(path.join(outDir,'manifests',`manifest-\${Date.now()}.json`), JSON.stringify(manifest,null,2));
  return { solidity, manifest };
}
"@

# --- lib/deploy ---
W "src/lib/deploy/viemClient.js" @"
import { createPublicClient, createWalletClient, http } from 'viem';
import { sepolia } from 'viem/chains';

export function getClients(){
  const rpc = process.env.SEPOLIA_RPC||'';
  const pk  = process.env.PRIVATE_KEY||'';
  if(!rpc||!pk) throw new Error('Missing SEPOLIA_RPC or PRIVATE_KEY');
  const pub = createPublicClient({ chain: sepolia, transport: http(rpc) });
  const wallet = createWalletClient({ chain: sepolia, transport: http(rpc), account: `0x${pk.replace(/^0x/,'')}` });
  return { pub, wallet };
}
"@

W "src/lib/deploy/explorer.js" @"
export function explorerLink(chain, address){
  if(chain==='SEPOLIA') return `https://sepolia.etherscan.io/address/${address}`;
  return '';
}
"@

# NOTE: for simplicity, in-app /api/deploy still returns placeholder; real deploy uses scripts/deploy-viem.js
W "src/lib/deploy/deploy.js" @"
import { explorerLink } from './explorer';
export async function deployFromManifest(manifest){
  // In-UI deploy stub. Use pnpm deploy:viem for real deployment (Phase 10).
  const address = '0x000000000000000000000000000000000000dEaD';
  return { address, explorer: explorerLink(manifest.chain,address) };
}
"@

# --- lib/oracle ---
W "src/lib/oracle/pyth.config.js" @"
export const PYTH = {
  ETH_USD_FEED_ID: '0x',
  ENDPOINT: process.env.PYTH_ENDPOINT||''
};
"@

W "src/lib/oracle/oracleIface.sol" @"
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
export function toX8(n){ const x=String(n); const [i,f='']=x.split('.'); const frac=(f+'00000000').slice(0,8); return Number(`${i}${frac}`); }
"@

W "src/lib/utils/errors.js" "export class AppError extends Error { constructor(msg,code=400){ super(msg); this.code=code; } }"
W "src/lib/utils/logger.js" "export const log=(...a)=>{ if(process.env.NODE_ENV!=='test') console.log(new Date().toISOString(),...a) };"

# --- schemas ---
W "src/lib/schemas/intent.schema.json" @"
{
  "$schema":"http://json-schema.org/draft-07/schema#",
  "title":"Intent",
  "type":"object",
  "required":["action","asset","amount","to","schedule","condition"],
  "properties":{
    "action":{"type":"string","enum":["send"]},
    "asset":{"type":"string"},
    "amount":{"type":"string"},
    "to":{"type":"string"},
    "schedule":{"type":"string","enum":["daily","weekly","monthly"]},
    "condition":{
      "type":"object",
      "required":["price_gt","symbol","threshold"],
      "properties":{
        "price_gt":{"type":"boolean"},
        "symbol":{"type":"string"},
        "threshold":{"type":"string"}
      }
    }
  }
}
"

# --- Generated placeholders ---
W "src/generated/contracts/ConditionalRecurringIntent.sol" "// generated by /api/compile"
W "src/generated/manifests/.keep" ""

# --- Contracts (Foundry) ---
W "contracts/foundry.toml" @"
[profile.default]
solc_version = '0.8.24'
optimizer = true
optimizer_runs = 200
src = 'src'
out = 'out'
libs = ['lib']
"@

W "contracts/src/ConditionalRecurringIntent.sol" @"
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IERC20 { function transferFrom(address from,address to,uint amount) external returns(bool); }
interface IOracleX8 { function getPriceX8(bytes32 symbol) external view returns (uint64 priceX8, uint64 lastTs); }

contract ConditionalRecurringIntent {
    address public immutable owner;
    IERC20  public immutable token;
    address public immutable beneficiary;
    uint256 public immutable amountWei;
    uint256 public immutable periodSeconds;
    IOracleX8 public immutable oracle;
    bytes32 public immutable symbol;
    uint64  public immutable thresholdX8;

    bool public active = true;
    uint256 public lastExecTs;

    error NotOwner(); error NotActive(); error NotDue(); error ConditionMet(); error TransferFailed();

    constructor(
        address _owner, address _token, address _beneficiary,
        uint256 _amountWei, uint256 _periodSeconds,
        address _oracle, bytes32 _symbol, uint64 _thresholdX8
    ){
        owner=_owner; token=IERC20(_token); beneficiary=_beneficiary; amountWei=_amountWei;
        periodSeconds=_periodSeconds; oracle=IOracleX8(_oracle); symbol=_symbol; thresholdX8=_thresholdX8;
    }

    modifier onlyOwner(){ if(msg.sender!=owner) revert NotOwner(); _; }

    function due() public view returns(bool){
        uint256 nextTs = lastExecTs==0 ? 0 : lastExecTs + periodSeconds;
        return block.timestamp >= nextTs;
    }

    function conditionMet() public view returns(bool){
        (uint64 px,) = oracle.getPriceX8(symbol);
        return px > thresholdX8;
    }

    function execute() external {
        if(!active) revert NotActive();
        if(!due()) revert NotDue();
        if(conditionMet()) revert ConditionMet();
        if(!token.transferFrom(owner, beneficiary, amountWei)) revert TransferFailed();
        lastExecTs = block.timestamp;
    }

    function pause() external onlyOwner { active=false; }
    function resume() external onlyOwner { active=true; }
    function cancel() external onlyOwner { active=false; }
}
"

W "contracts/src/MockOracle.sol" @"
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract MockOracle {
    mapping(bytes32=>uint64) public priceX8;
    mapping(bytes32=>uint64) public lastTs;
    function setPriceX8(bytes32 sym, uint64 px) external { priceX8[sym]=px; lastTs[sym]=uint64(block.timestamp); }
    function getPriceX8(bytes32 sym) external view returns(uint64,uint64){ return (priceX8[sym], lastTs[sym]); }
}
"

W "contracts/src/DummyToken.sol" @"
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract DummyToken {
    string public name='DummyToken'; string public symbol='DUM'; uint8 public decimals=18;
    mapping(address=>uint256) public balanceOf;
    mapping(address=>mapping(address=>uint256)) public allowance;
    function mint(address to,uint amt) external { balanceOf[to]+=amt; }
    function approve(address sp,uint amt) external returns(bool){ allowance[msg.sender][sp]=amt; return true; }
    function transferFrom(address f,address t,uint a) external returns(bool){
        uint al = allowance[f][msg.sender]; require(al>=a,'allow'); allowance[f][msg.sender]=al-a;
        uint bf = balanceOf[f]; require(bf>=a,'bal'); balanceOf[f]=bf-a; balanceOf[t]+=a; return true;
    }
}
"

W "contracts/test/Intent.t.sol" @"
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import 'forge-std/Test.sol';
import '../src/ConditionalRecurringIntent.sol';
import '../src/MockOracle.sol';
import '../src/DummyToken.sol';

contract IntentTest is Test {
    ConditionalRecurringIntent intent;
    MockOracle oracle;
    DummyToken token;

    address owner = address(0xABCD);
    address ben = address(0xBEEF);
    bytes32 sym = bytes32('ETH');

    function setUp() public {
        oracle = new MockOracle();
        token = new DummyToken();
        intent = new ConditionalRecurringIntent(
            owner, address(token), ben, 10 ether, 1 days, address(oracle), sym, 3000_00000000
        );
        token.mint(owner, 100 ether);
        vm.prank(owner); token.approve(address(intent), type(uint256).max);
    }

    function testNotDueReverts() public {
        oracle.setPriceX8(sym, 2000_00000000);
        vm.expectRevert(ConditionalRecurringIntent.NotDue.selector);
        intent.execute();
    }

    function testExecTransfersWhenDueAndBelowThreshold() public {
        oracle.setPriceX8(sym, 2000_00000000);
        vm.warp(block.timestamp + 1 days);
        vm.prank(address(0x1234));
        intent.execute();
        assertEq(token.balanceOf(ben), 10 ether);
    }

    function testStopConditionReverts() public {
        oracle.setPriceX8(sym, 2000_00000000);
        vm.warp(block.timestamp + 1 days);
        intent.execute();
        oracle.setPriceX8(sym, 4000_00000000);
        vm.warp(block.timestamp + 1 days);
        vm.expectRevert(ConditionalRecurringIntent.ConditionMet.selector);
        intent.execute();
    }
}
"

W "contracts/script/Deploy.s.sol" @"
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import 'forge-std/Script.sol';
import '../src/ConditionalRecurringIntent.sol';

contract DeployIntent is Script {
  function run() external {
    vm.startBroadcast();
    // Fill args as needed or read envs (not used in MVP)
    vm.stopBroadcast();
  }
}
"

# --- Node scripts (real deploy using Foundry artifact) ---
W "scripts/deploy-viem.js" @"
import fs from 'fs';
import path from 'path';
import { createWalletClient, createPublicClient, http, parseAbiItem, encodeDeployData, getAddress } from 'viem';
import { sepolia } from 'viem/chains';
import 'dotenv/config';

const rpc = process.env.SEPOLIA_RPC;
const pk  = process.env.PRIVATE_KEY?.replace(/^0x/,'');
if(!rpc || !pk){ console.error('Missing SEPOLIA_RPC or PRIVATE_KEY'); process.exit(1); }

const pub = createPublicClient({ chain: sepolia, transport: http(rpc) });
const wallet = createWalletClient({ chain: sepolia, transport: http(rpc), account: `0x${pk}` });

const manifestPath = (()=> {
  const dir = path.join(process.cwd(),'src/generated/manifests');
  const files = fs.readdirSync(dir).filter(f=>f.startsWith('manifest-')).sort();
  if(!files.length){ console.error('No manifest found. Run /api/compile first.'); process.exit(1); }
  return path.join(dir, files[files.length-1]);
})();

const manifest = JSON.parse(fs.readFileSync(manifestPath,'utf8'));
const artPath = path.join(process.cwd(),'contracts/out/ConditionalRecurringIntent.sol/ConditionalRecurringIntent.json');
if(!fs.existsSync(artPath)){ console.error('Artifact not found. Run: pnpm forge:build'); process.exit(1); }
const artifact = JSON.parse(fs.readFileSync(artPath,'utf8'));

const { bytecode, abi } = artifact;

const args = [
  process.env.DEPLOYER_ADDRESS,
  manifest.constructorArgs.token,
  manifest.constructorArgs.beneficiary,
  BigInt(manifest.constructorArgs.amountWei),
  BigInt(manifest.constructorArgs.periodSeconds),
  manifest.constructorArgs.oracle,
  manifest.constructorArgs.symbol,
  Number(manifest.constructorArgs.thresholdX8)
];

console.log('Deploying with args:', args);
const hash = await wallet.deployContract({ abi, bytecode: `0x${bytecode.object||bytecode}`, args });
console.log('tx:', hash);
const receipt = await pub.waitForTransactionReceipt({ hash });
const address = receipt.contractAddress;
console.log('Deployed at:', address);
console.log('Explorer:', `https://sepolia.etherscan.io/address/${address}`);
"@

W "scripts/simulate.js" @"
console.log('Simulate: run anvil and use Foundry tests for time-warp. This script is a placeholder.');
"@

W "scripts/set-mock-price.js" @"
console.log('set-mock-price: for local testing, call MockOracle.setPriceX8 via cast or a small viem script (stretch).');
"@

# --- docs ---
W "docs/ARCHITECTURE.md" @"
# Architecture
Flow: NL → Parse → Validate → Compile (template) → Manifest → Deploy (Foundry artifact + viem) → Execute().
"@

W "docs/THREAT_MODEL.md" @"
# Threat Model (MVP)
- Pre-approval only; no custody. Fail-closed on oracle. Caps on amount/min period.
"@

W "docs/SPONSORS.md" @"
# Sponsor Integrations
- PYUSD: default token demo (use test address).
- Pyth: use MockOracle for MVP; doc swap to Pyth.
- 1inch: read-only quote.
- Uniswap v4: hook scaffold (doc).
- ENS: resolve beneficiary (stub).
- ASI: optional agent rewrite (future).
"@

W "docs/DEMO_SCRIPT.md" @"
# 2-Min Demo Script
1) Type: \"Send 10 PYUSD to alice.eth every Friday until ETH > 3000\"
2) Parse → JSON, Compile → Solidity+Manifest
3) \`pnpm forge:build\`, \`pnpm deploy:viem\` → print address
4) Approve token, call \`execute()\`, then flip oracle above threshold → revert.
"@

W "docs/ROADMAP.md" @"
# Roadmap
- Filecoin logs, Self selective disclosure, swap intents (1inch) and Uniswap v4 route with safety hook.
"@

# --- done ---
Write-Host "✅ Scaffold complete. Next:"
Write-Host "1) pnpm install"
Write-Host "2) cp .env.example .env  # fill SEPOLIA_RPC, PRIVATE_KEY, DEPLOYER_ADDRESS"
Write-Host "3) pnpm dev  # http://localhost:3000"
Write-Host "4) In UI: Parse → Compile"
Write-Host "5) pnpm forge:build  # build contracts"
Write-Host "6) pnpm deploy:viem   # deploy using latest manifest"
