import { deployFromManifest } from '@/lib/deploy/deploy';
export default async function handler(req,res){
  try{
    const { manifest } = req.body||{};
    if(!manifest) return res.status(400).json({ error:'Missing manifest' });
    const out = await deployFromManifest(manifest);
    res.json(out);
  }catch(e){ res.status(400).json({ error: e.message||String(e) }); }
}
