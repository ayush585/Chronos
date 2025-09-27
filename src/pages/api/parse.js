import { parseIntent } from '@/lib/parser/parse';
export default async function handler(req,res){
  try{
    const { text } = req.body||{};
    if(!text) return res.status(400).json({ error:'Missing text' });
    const intent = parseIntent(text);
    res.json(intent);
  }catch(e){ res.status(400).json({ error: e.message||String(e) }); }
}
