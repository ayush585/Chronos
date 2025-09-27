import axios from 'axios';
export default async function handler(req,res){
  try{
    const { chainId, fromToken, toToken, amount } = req.query;
    const url = process.env.ONEINCH_BASE_URL || 'https://api.1inch.dev/swap/v6.0';
    const key = process.env.ONEINCH_API_KEY || '';
    const r = await axios.get(${url}//quote, { params:{ src:fromToken, dst:toToken, amount }, headers:{ Authorization: Bearer  }});
    res.json(r.data);
  }catch(e){ res.status(400).json({ error: e.response?.data||e.message }); }
}
