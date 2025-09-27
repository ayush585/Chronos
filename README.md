# Chronos  Intent Fusion Layer (Zapier for DeFi Intents)

**One-liner:** Users type \"Send 10 PYUSD to alice.eth every Friday until ETH > 3000\" â†’ we parse â†’ validate â†’ compile a minimal smart contract â†’ deploy to Sepolia â†’ execute on schedule unless a Pyth price condition stops it. Pause/cancel anytime.

## Quickstart
\\\ash
pnpm install
cp .env.example .env    # fill RPC + PRIVATE_KEY (throwaway)
pnpm dev
# open http://localhost:3000
\\\

## Useful scripts
- \pnpm forge:build\ â€” compile contracts
- \pnpm forge:test\ â€” run Foundry tests
- \pnpm deploy:viem\ â€” deploy compiled artifact using viem + manifest
- \pnpm simulate\ â€” local time-warp demo (anvil)
- \pnpm set:mock:price\ â€” set MockOracle price for demo

See **docs/** for architecture, threat model, sponsors, demo script, roadmap.
