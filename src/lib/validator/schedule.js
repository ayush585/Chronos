export function scheduleToPeriodSeconds(s){
  if(s==='daily') return 86400;
  if(s==='weekly') return 604800;
  if(s==='monthly') return 2592000;
  throw new Error('Unsupported schedule');
}
