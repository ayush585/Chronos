export async function amountToWei(amountStr, decimals=18){
  const [i,f=''] = String(amountStr).split('.');
  const frac = (f + '0'.repeat(decimals)).slice(0,decimals);
  return BigInt(i+frac);
}

export const amountToUnits = amountToWei;
