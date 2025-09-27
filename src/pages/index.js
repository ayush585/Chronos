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
      <h1>Intent Fusion Layer â€” MVP</h1>
      <div className='card' style={{marginTop:12}}>
        <label>Natural Language</label>
        <textarea rows={3} value={text} onChange={e=>setText(e.target.value)} />
        <div className='row'>
          <button className='btn' disabled={!!loading} onClick={async()=>{
            setLoading('parse'); try{ setIntent(await hit('/api/parse',{text})); }catch(e){ alert(e.message); } setLoading('');
          }}>Parse â†’ JSON</button>

          <button className='btn' disabled={!intent||!!loading} onClick={async()=>{
            setLoading('compile'); try{
              const { solidity, manifest } = await hit('/api/compile',{intent});
              setSol(solidity); setManifest(manifest);
            }catch(e){ alert(e.message); } setLoading('');
          }}>Compile â†’ Solidity</button>

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
