# Meridian — Provably Fair Pools on Base

> High-fidelity interactive prototype for a custodial, Web2-feeling pooling platform powered by Base L2 smart contracts and Chainlink VRF.

[![Deploys on Netlify](https://img.shields.io/badge/Deploy-Netlify-00C7B7?logo=netlify&logoColor=white)](https://www.netlify.com/)
[![Built with Vite](https://img.shields.io/badge/Built%20with-Vite%20%2B%20React%2019-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Settled on Base](https://img.shields.io/badge/Settlement-Base%20L2-0052FF?logo=coinbase&logoColor=white)](https://base.org)
[![Chainlink VRF](https://img.shields.io/badge/Fairness-Chainlink%20VRF-375BD2?logo=chainlink&logoColor=white)](https://chain.link/vrf)

---

## 🏛️ Executive Overview

Meridian addresses the core friction of Web3 prize pools: non-crypto consumers are intimidated by seed phrases, browser extensions, gas estimation, and network switching.

Meridian delivers **consumer banking simplicity on the surface, cryptographic trust underneath**:
- **Zero Wallets Required**: Users authenticate via email or SSO; balances are displayed in plain dollars.
- **Dedicated Sub-Wallets**: Each user receives a unique CREATE2 sub-wallet deposit address on Base. Deposits are automatically detected, swept, and credited.
- **Fixed-Contribution Pools**: Daily ($5), Weekly ($25), and Monthly ($100) pools with transparent platform fees (5%) and auditable prize pots.
- **Tamper-Proof Draws**: Automatic winner derivation using Chainlink VRF v2.5 verified on-chain via elliptic curve math and modulo arithmetic (`winner = randomWord % entries`).
- **Automated Payout Routing**: Winnings are auto-dispatched to pre-saved withdrawal destinations with a 24-hour security cooling-off lock.
- **Institutional Trust Center**: Interactive 5-layer security diagram (HSM/KMS key isolation, OpenZeppelin contracts) and an edge rate-limiting token-bucket simulator.

---

## 🚀 Netlify Deployment

This repository includes pre-configured [`netlify.toml`](./netlify.toml) and [`public/_redirects`](./public/_redirects) for instant zero-configuration deployment on Netlify.

### Build Settings
- **Build Command**: `npm run build`
- **Publish Directory**: `dist`
- **Node Version**: 18+ / 20+

### Automatic SPA Routing
All routes (e.g. `/app`, `/verify`, `/trust`, `/app/pools/pool_w_41`) are automatically rewritten to `/index.html` with status `200` to support React Router v6 browser history.

---

## 💻 Local Development

```bash
# 1. Install dependencies
npm install

# 2. Start Vite local dev server
npm run dev

# 3. Build production bundle
npm run build
```

---

## 🛠️ Tech Stack & Architecture

- **Framework**: React 19 + TypeScript + Vite
- **Routing**: React Router v6
- **Styling**: Tailwind CSS + Custom Design System Tokens (`tokens.css`)
- **State Management**: Zustand with persistent storage and seed data restoration
- **Typography**: `Newsreader` (Editorial Display), `Inter` (UI/Body), `JetBrains Mono` (Addresses & Cryptographic Proofs)
- **Icons**: Lucide React
- **QR Codes**: `qrcode.react` (Sub-wallet deposit address)

---

## 📜 License & Disclosures

*Interactive prototype demonstration.* Does not execute live on-chain mainnet transactions without configured contracts. All mathematical proofs and BigInt modulo operations operate truthfully on real simulated cryptographic seeds.
