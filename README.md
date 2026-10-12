# Future Shuttles & Rentals — High-Fidelity Interactive Demo

> **Namibia Self-Drive 4x4 & Vehicle Rental Web Platform**  
> A frontend-only, production-grade interactive prototype featuring dynamic tiered duration pricing, real-time availability & concurrency conflict engines, 4-step instant checkout with simulated DPO card payments, quotation pipeline, and an administrative fleet management portal.

---

## 🌟 Key Features

- **Editorial Desert-Warm Design**: Custom visual tokens inspired by Namibian dunes and acacia landscapes (`#F6F2EB`, `#23302B`, `#B5683A`). Editorial typography with *Fraunces* serif headlines and *Inter* UI text with tabular numeric formatting (`font-variant-numeric: tabular-nums`).
- **Automatic Duration-Based Pricing Engine**: Pure, deterministic tiered rate calculations stepping down daily rates at 3, 8, and 21+ days. Tested across all bracket edges.
- **Three Distinct Money Lines**:
  1. *Total Due Now (Charged)*: Immediate full payment for instant online bookings.
  2. *Booking Deposit (Quotes)*: 20% required deposit for custom quotes.
  3. *Refundable Security Deposit (Hold)*: Card pre-authorisation hold taken at vehicle handover in Windhoek (never charged today).
- **Concurrency & Overlap Prevention (AC 8)**: Prevents simultaneous double-bookings at checkout with instant detection, alternative vehicle suggestions, and audit logging.
- **Dual Booking Pathways**:
  - *Option A — Instant Booking*: 4-step stepper, 10-minute hold timer, simulated DPO card sheet with demo controls (success, declined, conflict), calendar `.ics` download, print receipt support.
  - *Option B — Quotations*: Inbound quote request with multi-vehicle preference chips; tokenised customer proposal page (`/quote/:ref`) with online deposit payment.
- **Full Admin Backend (`/admin`)**:
  - *Timeline Calendar (Hero Screen)*: 30-day visual timeline across all vehicles. Colour-coded bars for online bookings, offline VIP bookings, and maintenance blocks. Click-to-block functionality.
  - *Bookings Table*: Search, filter, inspect payment timelines (`Initiated → Authorised → Verified → Confirmed`), and toggle card hold states.
  - *Quotations Kanban Pipeline*: Move quotes through stages, formulate custom discounts, verify real-time fleet availability, and issue proposals.
  - *Live Rate Bracket Editor*: Per-vehicle tier editor with an interactive calculator panel and one-click fleet sync.
- **Floating Demo Pill**: Instant 1-click toggle between Public Website and Admin Portal with demo data reset.

---

## 🚀 Quick Start (Local Development)

```bash
# Install dependencies
npm install

# Start Vite dev server
npm run dev

# Run engine unit tests
npm test

# Build for production
npm run build
```

---

## 🌐 Netlify Deployment

This repository is pre-configured for **1-click Netlify hosting**:

1. **Build Command**: `npm run build`
2. **Publish Directory**: `dist`
3. **SPA Redirects**: Included via `netlify.toml` and `public/_redirects` to ensure clean client-side routing on all deep links (`/fleet`, `/book`, `/admin`, etc.).

---

## 🛠️ Tech Stack

- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS + Custom CSS Variables Token System
- **State Management**: Zustand with `localStorage` persistence
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Date Arithmetic**: date-fns
- **Unit Testing**: Node.js Native Test Runner via `tsx`
