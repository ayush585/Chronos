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
