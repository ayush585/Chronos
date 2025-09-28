

---
⏰ Chronos — Recurring PYUSD Scheduler

Simple. Secure. Non-custodial recurring payments on-chain.




---

🚀 What is Chronos?

Chronos is a decentralized web app that enables recurring payments with PYUSD (PayPal USD).
Users can schedule plans (amount, recipient, frequency) and execute transfers on-chain when they’re due — all from their own wallet, no custody, no approvals.

> Think Spotify subscriptions, student allowances, or weekly payrolls — but fully powered by PYUSD on Ethereum.




---

✨ Features

🦊 MetaMask Integration (via wagmi)

🪙 ERC-20 Support: transfer, symbol, decimals

⏰ Recurring Plans: daily, weekly, monthly, or custom

📦 LocalStorage Persistence: plans saved in-browser

🔔 “Due Now” Reminders for upcoming payments

💳 One-Click Execution → secure PYUSD transfers on Sepolia



---

🛠 Tech Stack

Frontend: Next.js (App Router) + TypeScript

Web3: wagmi + viem (Sepolia RPC)

Wallet: MetaMask (Injected Connector)

Storage: LocalStorage (no backend)

Contract: PYUSD ERC-20 on Sepolia → 0xCaC524BcA292aaade2DF8A05cC58F0a65B1B3bB9



---

⚙ How It Works

1. Connect Wallet → Chronos detects Sepolia + PYUSD.


2. Create a Plan → recipient, amount, recurrence, start date.


3. Save Locally → plan data lives in localStorage.


4. Due Reminder → UI highlights which transfers are ready.


5. Execute → one-click call to transfer() via wagmi + viem → MetaMask signs + broadcasts.




---

🌍 Real-World Use Cases

👨‍👩‍👧 Parents → children: weekly allowance in PYUSD

🏫 Students abroad: recurring rent & expense support

🏢 Employers → workers: stablecoin payroll

❤ Recurring donations: transparent NGO support

🎶 Subscriptions: services billed in PYUSD



---

📷 Screenshots

(Insert screenshots of your dashboard here)


---

🔮 Next Steps

Add backend reminders (email / push notifications)

Add relayer/cron (e.g., Gelato, Chainlink Automation) for full auto-execution

Expand to Ethereum mainnet PYUSD

Mobile-first UI polish



---

🤖 AI in Development

We used AI tools (Codex + ChatGPT) for:

Project scaffolding (Next.js + wagmi config, ERC-20 ABI)

Debugging TypeScript & wagmi issues

Writing documentation + pitch material

UX text + storytelling alignment with PayPal’s PYUSD


All code was reviewed, tested, and customized manually to fit hackathon requirements.


---

🏗 Local Development

Prerequisites

Node.js 18+

MetaMask with Sepolia testnet enabled

Sepolia ETH (for gas) + Test PYUSD


Setup

git clone https://github.com/<your-username>/chronos.git
cd chronos
npm install
cp .env.local.example .env.local

Fill .env.local:

NEXT_PUBLIC_SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY
NEXT_PUBLIC_PYUSD_ADDRESS=0xCaC524BcA292aaade2DF8A05cC58F0a65B1B3bB9

Run dev server:

npm run dev
# open http://localhost:3000


---

🏆 Hackathon Context

Built at ETHGlobal Delhi 2025 for the PayPal / PYUSD track.

Chronos demonstrates how PYUSD can power recurring payments — a core financial primitive for payrolls, allowances, subscriptions, and donations.

