# Save Me — High-Fidelity Demo

A restrained, beautifully crafted web prototype of the **Save Me** mobile app: a live phone on a calm landing page, plus full-screen app mode on real phones.

> **"Light is lovely. Clarity is cheaper. Complicated costs more."**

---

## 1. What This Prototype Is

This is an interactive frontend prototype built to demonstrate the exact product experience, data architecture, and restraint demanded by the Save Me brief. It proves simple software can feel high-craft without being cheap or over-engineered.

- **Landing Page (`/`)**: A calm marketing story with the live, working app inside a framed phone. Features the Year Ribbon showing recurring renewal days and the Horizon interactive story.
- **Mobile Prototype (`/app`)**: The identical responsive app shell that runs full-screen on mobile devices or framed on desktop.
- **Build Plan (`/plan`)**: Answers the client's five project questions: 5-milestone roadmap with acceptance criteria, fixed-price structure, and store-readiness checklist.

---

## 2. What Is Mocked vs Real

| Feature | In This Demo | Production Implementation |
|---|---|---|
| **Bank Connection** | Simulated open-banking flow with realistic 41-transaction detection stream | TrueLayer, Plaid, or Yapily read-only AIS consent |
| **Recurring Detection** | Pure, deterministic pattern matching engine (`src/lib/detection.ts`) | Same logic running server-side or on-device |
| **Money Calculations** | Integer pence arithmetic for all horizons (`src/lib/money.ts`) | Identical domain maths |
| **Cancellation** | Guided cancellation instructions with Undo and annual savings tracking | Guidance in V1; merchant direct links |
| **Free-Trial Alerts** | Virtual clock (`src/store/virtualClock.ts`) + fast-forward push simulation | APNs / FCM scheduled notifications |
| **Authentication** | Pre-signed session as Amira | Biometric Keychain/Keystore on-device token |
| **Persistence** | SessionStorage (resets cleanly each new visit) | SQLite / encrypted on-device storage |

---

## 3. How to Swap Branding in One File

All brand tokens live in [`src/styles/tokens.css`](file:///c:/Users/MUWAHHID/Downloads/Go%20High%20Level/src/styles/tokens.css).

To rebrand to the client's official palette:
1. Open `src/styles/tokens.css` and update `--primary`, `--bg`, `--accent`, etc.
2. Tailwind CSS (`tailwind.config.ts`) reads these CSS variables directly via `var()`.
3. Update brand strings in `src/config/brand.ts` (App name, tagline, currency).
The entire site, framed phone, and full-screen mobile app update immediately.

---

## 4. How to Run Locally

```bash
# 1. Install dependencies
npm install

# 2. Run unit tests (money rounding, detection, virtual clock)
npm test

# 3. Start development server
npm run dev

# 4. Build production bundle
npm run build
```

---

## 5. Client Requirements Traceability Matrix

| # | Requirement | Implementation in Demo |
|---|---|---|
| 1 | Clean, simple interface | 3 tabs (Today, Subscriptions, Trials), max 1 primary button per screen |
| 2 | Identify recurring payments | Connect stream where 41 transactions scroll and 10 recurring items lift into place |
| 3 | Long-term cost horizons | Horizon scrubber on Today (£102.49/mo → £1,229.91/yr → £6,149.55 → £12,299.10) |
| 4 | Highlight charges needing attention | "Worth a look" cards with plain-language reasons and evidence timelines |
| 5 | Simple review / manage actions | Keep, Review later, and Cancel with real-time Saved pill and Undo toast |
| 6 | Free-trial reminders | Trials tab with countdown rings and "Protect" toggle |
| 7 | Push notifications | Lock-screen push mock triggered by "Fast-forward 5 days" demo control |
| 8 | Secure data handling | "Your data" sheet with read-only breakdown and 3-step Disconnect & Delete animation |
| 9 | Native iOS/Android taste | Device-aware frames, spring physics (`motion`), 100dvh safe-area support |
| 10 | Store readiness | `/plan` page includes store privacy labels, data safety forms, and icon checklist |
| 11 | Maintainable code | Strict TypeScript, pure domain libraries, zero bloated dependencies |
| 12 | Fixed price & milestones | 5 milestones with acceptance criteria and payment percentage splits on `/plan` |

---

## 6. Technology Stack Justification

- **Vite + React 18 + TypeScript**: Type-safe, high performance, and directly translatable to a React Native / Expo production codebase.
- **Tailwind CSS + CSS Variables**: Design token single-source of truth.
- **Motion (`motion/react`)**: 60fps spring transitions for sheets, toasts, and lock screen without layout shifting.
- **Zustand**: Lightweight global state with `sessionStorage` hydration.
- **Self-hosted Variable Fonts**: `@fontsource-variable/fraunces` and `@fontsource-variable/dm-sans` (no runtime Google Fonts requests).
- **Vitest**: Fast unit test suite covering financial precision and recurring transaction classification.
