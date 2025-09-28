# PYUSD Recurring Scheduler

Small Next.js app that lets you draft and execute recurring PayPal USD (PYUSD) transfers on the Sepolia testnet. It stores schedules locally and uses MetaMask plus Wagmi to send ERC-20 transfer calls when you are ready.

## Features

- Connect a MetaMask wallet and read its PYUSD balance.
- Create schedules with daily, weekly, monthly, or custom day intervals.
- Track due payments with friendly reminders and quick execution buttons.
- Persist schedules per-wallet in localStorage so you stay in control.

## Prerequisites

- Node.js 18 or newer and npm.
- MetaMask (or any injected wallet) connected to Sepolia.
- PYUSD tokens on Sepolia. (Mint through your preferred faucet.)
- Optional: set NEXT_PUBLIC_SEPOLIA_RPC_URL for a custom RPC endpoint. Defaults to https://1rpc.io/sepolia if unset.

Copy .env.local.example to .env.local and fill in any overrides you need:

    cp .env.local.example .env.local

## Getting Started

Install dependencies and run the dev server:

    npm install
    npm run dev

Open http://localhost:3000 and connect MetaMask. Create a schedule, keep the tab open, and execute each payment when it comes due.

## Notes

- The app does not execute transfers automatically in the background; it is a convenient reminder plus one-click sender.
- All data lives in the browser. Clearing storage or switching browsers will remove your schedules.
- Update PYUSD_ADDRESS and decimals in src/lib/pyusd.ts if PayPal rotates contracts in the future.
