# 🚀 Chronos - Automated PYUSD Recurring Payments Platform

<div align="center">
  <img src="https://img.shields.io/badge/ETHGlobal-New%20Delhi%202025-purple?style=for-the-badge" alt="ETHGlobal New Delhi 2025" />
  <img src="https://img.shields.io/badge/Track-PYUSD%20Consumer%20Champion-blue?style=for-the-badge" alt="PYUSD Consumer Champion" />
  <img src="https://img.shields.io/badge/Status-Live%20on%20Sepolia-green?style=for-the-badge" alt="Live on Sepolia" />
</div>

## 📋 Table of Contents
- [Introduction](#-introduction)
- [Problem Statement](#-problem-statement)
- [Our Solution](#-our-solution)
- [Track Selection](#-track-selection-pyusd-consumer-champion)
- [Key Features](#-key-features)
- [System Architecture](#-system-architecture)
- [Technical Implementation](#-technical-implementation)
- [Getting Started](#-getting-started)
- [Demo Video](#-demo-video)
- [Future Roadmap](#-future-roadmap)
- [Team](#-team)

## 🌟 Introduction

**Chronos** is a revolutionary Web3 payment automation platform that brings the convenience of traditional recurring payments to the blockchain ecosystem using PayPal's PYUSD stablecoin. Built for ETHGlobal New Delhi 2025, Chronos addresses one of the most significant pain points in DeFi - the inability to automate recurring transactions without complex smart contracts or centralized services.

In a world where subscription economies are worth over $1.5 trillion globally, the crypto ecosystem lacks a user-friendly solution for recurring payments. Chronos bridges this gap by providing a seamless, secure, and decentralized way to schedule and manage recurring PYUSD transfers.

## 🎯 Problem Statement

Current blockchain payment systems suffer from:
- **Manual Intervention Required**: Users must manually execute each payment, leading to missed payments and poor user experience
- **Complex Smart Contracts**: Existing solutions require expensive and complex smart contract deployments
- **Lack of Flexibility**: Current systems don't allow easy modification of payment schedules
- **Poor UX**: Crypto payments remain intimidating for mainstream users
- **No Standardization**: Each dApp implements its own payment logic, creating fragmentation

## 💡 Our Solution

Chronos revolutionizes recurring payments by:
- **Intuitive Interface**: Consumer-friendly design that makes crypto payments as easy as traditional banking
- **Flexible Scheduling**: Support for daily, weekly, monthly, and custom intervals
- **Wallet-Based Storage**: Decentralized storage using browser localStorage mapped to wallet addresses
- **Real-Time Notifications**: Smart reminders for due payments with one-click execution
- **PYUSD Integration**: Leveraging PayPal's stablecoin for stable, reliable value transfer
- **Gas Optimization**: Efficient ERC-20 transfer implementation minimizing transaction costs

## 🏆 Track Selection: PYUSD Consumer Champion

### Why We're Applying for This Track

We are targeting the **PYUSD Consumer Champion ($3,500)** prize track because Chronos exemplifies the perfect consumer-focused payment experience that PayPal envisions for PYUSD adoption:

#### 1. **Seamless Consumer Experience**
   - One-click wallet connection with MetaMask integration
   - Intuitive scheduling interface requiring zero blockchain knowledge
   - Real-time balance updates and transaction status
   - Mobile-responsive design for payments on-the-go

#### 2. **Real-World Payment Challenge**
   - Solves the $1.5T subscription economy's crypto adoption barrier
   - Enables use cases like: SaaS subscriptions, streaming services, utility bills, loan repayments, DCA investments
   - Reduces payment friction from minutes to seconds

#### 3. **PYUSD at the Core**
   - Built specifically for PYUSD, not a generic token solution
   - Leverages PYUSD's stability for predictable recurring payments
   - Demonstrates PYUSD's potential beyond simple transfers

#### 4. **Scalable Business Model**
   - B2B2C platform enabling businesses to accept recurring PYUSD payments
   - Potential for transaction fee monetization
   - White-label opportunities for enterprises

#### 5. **Innovation in Payments**
   - First consumer-friendly recurring payment solution for PYUSD
   - Novel approach using client-side scheduling with blockchain execution
   - Opens new possibilities for subscription-based Web3 services

## ✨ Key Features

### Core Functionality
- **🔗 Wallet Integration**: Seamless MetaMask connection with multi-wallet support
- **💰 Real-Time Balance**: Live PYUSD balance tracking on Sepolia testnet
- **📅 Flexible Scheduling**: Daily, weekly, monthly, or custom interval payments
- **🔔 Smart Reminders**: Due payment notifications with quick-action buttons
- **💾 Persistent Storage**: Wallet-specific schedule persistence using localStorage
- **📊 Payment History**: Track all past and upcoming payments
- **🎨 Modern UI/UX**: Clean, intuitive interface built with Tailwind CSS

### Technical Features
- **⚡ Optimized Performance**: Built with Next.js 15 and Turbopack
- **🔐 Secure Transactions**: Wagmi v2 for bulletproof Web3 interactions
- **📱 Responsive Design**: Mobile-first approach for accessibility
- **🌐 Decentralized**: No backend servers, fully client-side operation
- **🔄 Real-Time Updates**: React Query for efficient data fetching

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                                   CHRONOS ARCHITECTURE                          │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│                                  FRONTEND LAYER                                 │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐ │
│  │   Next.js    │    │    React     │    │   Tailwind   │    │   TypeScript │ │
│  │   App Router │    │  Components  │    │     CSS      │    │    Types     │ │
│  └──────────────┘    └──────────────┘    └──────────────┘    └──────────────┘ │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              WEB3 INTEGRATION LAYER                             │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐ │
│  │    Wagmi     │    │  RainbowKit  │    │     Viem     │    │   TanStack   │ │
│  │   Hooks &    │    │   Wallet     │    │   Contract   │    │    Query     │ │
│  │   Actions    │    │  Connection  │    │ Interactions │    │  Data Mgmt   │ │
│  └──────────────┘    └──────────────┘    └──────────────┘    └──────────────┘ │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                               BLOCKCHAIN LAYER                                  │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌──────────────────────────────────────────────────────────────────────────┐ │
│  │                         SEPOLIA TESTNET                                  │ │
│  ├──────────────────────────────────────────────────────────────────────────┤ │
│  │                                                                          │ │
│  │  ┌────────────────┐           ┌────────────────┐                        │ │
│  │  │  PYUSD ERC-20  │           │   MetaMask     │                        │ │
│  │  │    Contract    │◄──────────┤    Wallet      │                        │ │
│  │  │ 0x8D788d82... │           │   Provider     │                        │ │
│  │  └────────────────┘           └────────────────┘                        │ │
│  │                                                                          │ │
│  └──────────────────────────────────────────────────────────────────────────┘ │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              DATA PERSISTENCE LAYER                             │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌──────────────────────────────────────────────────────────────────────────┐ │
│  │                          Browser LocalStorage                            │ │
│  ├──────────────────────────────────────────────────────────────────────────┤ │
│  │  • Wallet-specific schedule storage                                      │ │
│  │  • Payment history tracking                                              │ │
│  │  • User preferences                                                      │ │
│  └──────────────────────────────────────────────────────────────────────────┘ │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘

                            DATA FLOW & INTERACTIONS
┌─────────────────────────────────────────────────────────────────────────────────┐
│                                                                                 │
│   User Action ──► UI Component ──► Wagmi Hook ──► Smart Contract ──► Response  │
│                                                                                 │
│   1. Connect Wallet:    WalletButton ──► useAccount() ──► MetaMask            │
│   2. Check Balance:     RecurringScheduler ──► useBalance() ──► PYUSD Contract │
│   3. Create Schedule:   ScheduleForm ──► localStorage.setItem()               │
│   4. Execute Payment:   PaymentCard ──► useWriteContract() ──► transfer()     │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### Component Architecture

```
src/
├── app/                      # Next.js App Router
│   ├── layout.tsx           # Root layout with providers
│   ├── page.tsx             # Main application page
│   └── providers.tsx        # Web3 & query providers
│
├── components/              # React Components
│   ├── recurring-scheduler.tsx  # Main scheduler component
│   └── wallet-button.tsx       # Wallet connection UI
│
├── hooks/                   # Custom React Hooks
│   └── useMetaMask.ts      # MetaMask integration hook
│
└── lib/                     # Core Libraries
    ├── pyusd.ts            # PYUSD contract configuration
    └── wagmi.ts            # Wagmi client setup
```

## 🔧 Technical Implementation

### Smart Contract Integration
```typescript
// PYUSD Contract on Sepolia
const PYUSD_ADDRESS = "0x8d788d82b3B22f92fCa0c3Da46dE4535F0b9B708"
const PYUSD_DECIMALS = 6
```

### Key Technologies
- **Frontend Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS v4
- **Web3 Library**: Wagmi v2 + Viem
- **Wallet Connection**: RainbowKit v2
- **State Management**: React Query (TanStack Query)
- **Type Safety**: TypeScript 5
- **Build Tool**: Turbopack

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn/pnpm
- MetaMask wallet extension
- Sepolia testnet ETH for gas fees
- PYUSD tokens on Sepolia (available from faucet)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/chronos.git
cd chronos
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Configure environment variables**
```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your configuration:
```env
# Optional: Custom Sepolia RPC URL (defaults to https://1rpc.io/sepolia)
NEXT_PUBLIC_SEPOLIA_RPC_URL=your_rpc_url_here

# Optional: WalletConnect Project ID for enhanced wallet support
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here
```

4. **Run the development server**
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

5. **Open the application**
Navigate to [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
# Build for production
npm run build

# Start production server
npm run start
```

### Testing on Sepolia

1. **Switch to Sepolia Network**
   - Open MetaMask
   - Select "Sepolia test network"

2. **Get Test ETH**
   - Visit [Sepolia Faucet](https://sepoliafaucet.com)
   - Request test ETH for gas fees

3. **Get PYUSD Tokens**
   - Visit the PYUSD faucet (link in PayPal docs)
   - Mint test PYUSD tokens to your wallet

4. **Create Your First Schedule**
   - Connect wallet
   - Click "Create Schedule"
   - Set recipient, amount, and frequency
   - Save and execute when due

## 🎥 Demo Video

[Watch our 3-minute demo](https://your-demo-link.com) showcasing:
- Wallet connection and balance display
- Creating recurring payment schedules
- Executing due payments
- Managing multiple schedules
- Real-world use cases

## 🗺️ Future Roadmap

### Phase 1: Enhanced Automation (Q2 2025)
- [ ] Smart contract-based automation using Chainlink Keepers
- [ ] Multi-signature support for business accounts
- [ ] Batch payment execution for gas optimization

### Phase 2: Cross-Chain Expansion (Q3 2025)
- [ ] Deploy on Ethereum mainnet
- [ ] Support for Polygon, Arbitrum, and Base
- [ ] Cross-chain payment routing

### Phase 3: Business Features (Q4 2025)
- [ ] Merchant dashboard for subscription management
- [ ] Invoice generation and tracking
- [ ] Payment analytics and reporting
- [ ] API for third-party integrations

### Phase 4: DeFi Integration (Q1 2026)
- [ ] Yield generation on idle PYUSD
- [ ] Payment streaming capabilities
- [ ] Integration with lending protocols

## 👥 Team

**Built with ❤️ at ETHGlobal New Delhi 2025**

- **Team Lead**: [Your Name]
- **Smart Contract**: [Team Member]
- **Frontend**: [Team Member]
- **UI/UX**: [Team Member]

## 📄 License

MIT License - feel free to use this code for your own projects!

## 🙏 Acknowledgments

- PayPal Developer Team for PYUSD documentation and support
- ETHGlobal for organizing this amazing hackathon
- The Web3 community for continuous inspiration

---

<div align="center">
  <strong>🏆 Built for ETHGlobal New Delhi 2025 - PYUSD Consumer Champion Track 🏆</strong>
</div>