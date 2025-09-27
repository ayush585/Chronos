export const log=(...a)=>{ if(process.env.NODE_ENV!=='test') console.log(new Date().toISOString(),...a) };
