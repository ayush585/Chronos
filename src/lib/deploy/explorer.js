export function explorerLink(chain, address){
  if(chain==='SEPOLIA') return `https://sepolia.etherscan.io/address/${address}`;
  return '';
}
