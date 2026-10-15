# Meridian Trade Portal — ATS Part 2: Buyer Lifecycle Demo

> B2B Tour Operator Revenue Lifecycle Portal for travel agencies, DMCs, and wholesale operators. Built according to the ATS Part 2 Implementation PRD.

---

## 🌟 Key Product Highlights & Architecture

1. **Multi-Role Access Control (Enforced at Mock Server Boundary)**
   - **Buyer Portal (`/app`)**: Agency self-service, quote browsing, 3-step booking wizard with sequential rule evaluation, SWIFT wire proof upload, messaging.
   - **Operator Admin (`/admin`)**: Operations queue, SLA monitoring, booking approval with supplier line creation, rejection with required reasons (min 10 chars), one-time reconsideration adjudication, administrative overrides, completion gate.
   - **Payment Coordinator (`/coord/payments`)**: Per-supplier line reconciliation, SWIFT MT103 wire receipt drawer preview, confirmation & dispute workflows, keyboard navigation (`J`/`K` move, `C` quick confirm).
   - **Server-Side Security Route Guard (`/403`)**: Disallowed routes display the exact failing rule policy and provide direct role-switching.

2. **Five Server-Side Eligibility Rules (`src/server/rules.ts`)**
   - **Rule 01**: Account & Tenant Role Authorization
   - **Rule 02**: Plan Booking Entitlement (Explorer Free Tier locked; Professional & Enterprise direct booking enabled)
   - **Rule 03**: Quote Validity & Status (Blocks expired quotes e.g. `Q-2041`, offers 14-day refresh action)
   - **Rule 04**: Monthly Booking Volume (Count allowance)
   - **Rule 05**: Monthly Gross Value Allowance (USD limit)

3. **Per-Supplier Settlement Roll-up (`src/server/stateMachine.ts`)**
   - Approved bookings generate distinct lines for hotels, transport fleets, and mountain guides.
   - Progress bar tracks reconciled counts and dollars.
   - Admin completion is strictly locked until 100% of supplier lines are confirmed.

4. **Developer View & Failure Simulator (`DevPanel.tsx`)**
   - Floating toggle (bottom-left) tracking live mock API requests with methods, paths, status codes, latency, and rule descriptions.
   - Failure injection toggles: Network Error on Next Write (503), Simulated Slow Network (4s), and Expired Session (401).
   - One-click "Reset Demo Seed" restoring seed data in <1 second.

---

## 🛠️ Tech Stack & Tokens

- **Framework**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS with custom editorial tokens:
  - Background: `#F7F5F0` (warm paper)
  - Primary: `#1F4D45` (deep pine green)
  - Accent: `#C4613A` (terracotta)
- **Typography**: Google Fonts *Fraunces* (display serif) & *Inter* (UI sans)
- **State Management**: Zustand with persistent storage
- **Icons**: Lucide React

---

## 🚀 Local Development

```bash
# Install dependencies
npm install

# Start local development server
npm run dev

# Run unit test suite (evaluates all 5 rules & state machine transitions)
npx tsx src/server/__tests__/rules_and_statemachine.test.ts

# Production build
npm run build
```

---

## ☁️ Netlify Deployment

This repository includes pre-configured [`netlify.toml`](./netlify.toml) and [`public/_redirects`](./public/_redirects) for automatic single-page application (SPA) routing on Netlify.

- **Build command**: `npm run build`
- **Publish directory**: `dist`
