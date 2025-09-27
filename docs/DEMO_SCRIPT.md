# 2-Min Demo Script
1) Type: \"Send 10 PYUSD to alice.eth every Friday until ETH > 3000\"
2) Parse â†’ JSON, Compile â†’ Solidity+Manifest
3) \pnpm forge:build\, \pnpm deploy:viem\ â†’ print address
4) Approve token, call \execute()\, then flip oracle above threshold â†’ revert.
