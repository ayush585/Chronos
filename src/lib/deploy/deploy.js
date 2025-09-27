import { explorerLink } from './explorer';
export async function deployFromManifest(manifest){
  // In-UI deploy stub. Use pnpm deploy:viem for real deployment (Phase 10).
  const address = '0x000000000000000000000000000000000000dEaD';
  return { address, explorer: explorerLink(manifest.chain,address) };
}
