# Architectural & Design Decisions

This document logs key technical and design decisions made during the implementation of the TenderVantage frontend prototype in accordance with the PRD.

---

### 1. Technology Choices

- **Vite + React 19 + TypeScript**: Chosen for rapid hot-reloading, deterministic bundling, and instant builds (`1.1s` compile time). Avoided heavy full-stack frameworks (like Next.js) since all state is local and mocked.
- **Tailwind CSS v4 with Custom Design Tokens (`@theme`)**:
  - The color tokens (`--color-primary: #17323A`, `--color-accent: #B8864B`, `--color-bg: #F6F3EC`, etc.) are declared in `src/styles/tokens.css` and mapped via `@theme` in `src/index.css`.
  - All spacing, radius, typography, and shadow tokens derive directly from PRD Section 3.
- **Zustand for State & Event Bus**:
  - A unified store persists under `tv_demo_v1` in `localStorage`.
  - A lightweight pub/sub event bus (`src/mock/events.ts`) decouples state mutations from side-effects (triggering mock emails, webhook entries, and UI toasts).
- **Code-Splitting & Lazy Loading**:
  - Public entry JS is strictly budgeted (~151 kB gzip vs. PRD <= 170 kB limit).
  - Portal (`/portal/*`), Staff (`/staff`), Payment Gateway (`/checkout/pay`), and Dev Tokens (`/dev/tokens`) are lazy-loaded on demand.

---

### 2. Design System & Typography

- **Brand Direction: "The calm desk of a careful editor"**:
  - Palette: Deep ink-teal (`#17323A`), warm paper background (`#F6F3EC`), elevated card surface (`#FBF9F4`), Kalahari ochre accent (`#B8864B`).
  - No decorative gradients, glowing borders, neon elements, or generic SaaS cards.
  - Heading font: *Newsreader* (variable optical serif, weights 400 & 500) for editorial authority.
  - Body font: *Hanken Grotesk* for clean, legibility-first UI.
  - Mono font: *JetBrains Mono* for webhook payloads and order IDs.
- **The 5 Custom Order Statuses**:
  - Standardized pill component (`StatusPill.tsx`) enforcing 12% tint background, full color text, 28% border, and mandatory semantic icons (circle-dashed, loader, eye, rotate-ccw, check).
  - Never relies on color alone; accessible to screen readers with text labels and ARIA attributes.

---

### 3. Service Commerce Model

- **Service Consulting Engine vs. Product Store**:
  - No shipping selectors, inventory counters, or quantity spinners.
  - Cart enforces strictly 1 item per service. Adding an already selected service informs the user that the scope is already in cart.
  - Pula Currency Formatting: `formatBWP` helper formats as `P12,500` in catalog cards and `P12,500.00` with 14% VAT in checkout and invoices.
  - Turnarounds are explicitly stated in working days (e.g., `48 hours`, `3 working days`, `5 working days`).

---

### 4. Hosted Payment Gateway Simulation

- **Neutral Hosted Gateway Screen (`/checkout/pay`)**:
  - Strictly avoids copying DPO Group logos, trade dress, or branding.
  - Deliberately plainly styled (neutral white card, system typography, clear disclaimer banner: *"Simulated page. No real payment is taken"*).
  - Supports Success (`4242 4242 4242 4242`), Bank Decline (`4000 0000 0000 0002`), Cancel & Return, and Mobile Money USSD prompt simulations.
  - Incorporates the required 1.8s transaction verification step before issuing the order receipt.

---

### 5. Reviewer Demo Guide & Build Map

- **Reviewer-First Overlay**:
  - Accessible on every route via the floating pill.
  - Incorporates a 5-step *"Suggested Path"* checklist that auto-ticks as the reviewer tests the application.
  - Role switcher toggles between Client and Staff instantly without requiring manual re-logins.
  - Build Map toggle overlays interactive badges on every section explaining its exact WordPress / Elementor / WooCommerce / WPForms implementation counterpart.

---

### 6. Botswana Procurement Localization

- Contextual references to **PPADB / PPRA** (Public Procurement and Asset Disposal Board), **CIPA** (Companies and Intellectual Property Authority) registration numbers (`BW0000...`), **BURS** (Botswana Unified Revenue Service) tax clearances, and Gaborone addresses throughout.
- Demo clock anchored to Sat 10 Oct 2026 with relative deadline calculations (`getDaysLeft`) to provide realistic urgency for tender submissions.
