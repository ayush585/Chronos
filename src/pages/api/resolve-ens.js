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
