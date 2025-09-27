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
