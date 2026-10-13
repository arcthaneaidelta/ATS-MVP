# BionicIQ Ecosystem Demo

> **Client Evaluation Prototype** — Three products under one engineering standard: BionicIQ Corporate, BionicIQ Academy (LMS), and Cirqla (Multi-tenant Hospitality SaaS), plus the Proposal Companion and Design System verification route.

---

## Quick Start & Running Locally

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Build for production (strict TypeScript + Vite)
npm run build

# 4. Preview production build
npm run preview
```

Open your browser to `http://localhost:5173`.

---

## 🧭 Complete Route Map

| Zone | Route | Description & Features |
| :--- | :--- | :--- |
| **Corporate** | `/` | **Home**: Asymmetric hero with 14s live ecosystem loop, pinned scroll story, live QR code |
| | `/services` | 4 service lines, interactive capability accordions, case study links |
| | `/products` | Academy & Cirqla vignettes with live launcher and capability highlights |
| | `/case-studies` | Filterable 2-column portfolio grid with category chips |
| | `/case-studies/:slug` | Scroll-story case study, architecture diagram, sticky device frames, outcomes |
| | `/careers` | Job filter (team, location), 560px sliding apply drawer with 3-step submission |
| | `/about` | Editorial layout, 4 principles, team avatars, "How we work" timeline |
| | `/contact` | 3-step qualified lead form, CRM leads intake dock, error simulations |
| | `/insights` | Editorial blog articles, reading progress TOC, SEO schema markers |
| **Academy** | `/academy` | **Academy Landing**: 3-card fan out, course preview, curriculum breakdown |
| | `/academy/courses` | Catalog with search, category checkboxes, difficulty filters, and price ranges |
| | `/academy/courses/:slug` | Course detail, syllabus modules, instructor bio, sticky checkout trigger |
| | `/academy/app` | **Student Dashboard**: Streaks, progress rings, weekly activity, resume lessons |
| | `/academy/app/courses/:slug/lessons/:id` | **Course Player**: 70/30 video layout, scrubber, speed control, markdown notes |
| | `/academy/app/quiz` | **Timed Quiz**: 5 questions, 8-min countdown, immediate score ring & cert unlock |
| | `/academy/app/certificates` | **Diploma View**: Printable A4-landscape certificate with verification code |
| | `/academy/verify/:id` | **Public Verification**: Real-time status lookup (Valid / Revoked) |
| | `/academy/admin` | **Admin Console**: Course publishing, student enrollment list, refunds, revokes |
| **Cirqla Diner** | `/cirqla` | **Marketing**: Live table QR code, interactive theme switch preview |
| | `/cirqla/scan/:venue` | **Customer App**: Phone frame (desktop) / full-bleed (mobile), modifiers, cart, tracker |
| **Cirqla Venue** | `/cirqla/venue/orders` | **Live Order Board**: 3-column Kanban, synthesized audio chime, 80mm thermal print |
| | `/cirqla/venue/menu` | Menu manager, sold-out toggles, branch price overrides, bulk CSV import modal |
| | `/cirqla/venue/payments` | Financial ledger with status chips, payouts summary, export to CSV |
| | `/cirqla/venue/analytics` | Hourly sales bars with peak hour highlighting, prep time trends, data tables |
| | `/cirqla/venue/staff` | Role-based staff directory (Owner/Manager/Kitchen/FOH), invite modal, undo toast |
| | `/cirqla/venue/branches` | Branch profiles, printable table QR code matrix generator, brand palette picker |
| **Super-Admin** | `/cirqla/platform` | 38 tenants list, GMV charts, 90-day uptime SVG strips, suspend/view-as-venue |
| **Proposal** | `/proposal` | **Proposal Companion**: 3-lane interactive architecture SVG, milestone/monthly toggle |
| **Design Kit** | `/__kit` | **Component Kitchen Sink**: Button variants, input states, badges, skeletons |

---

## 🎬 The First 2 Minutes (Choreographed Demo Journey)

1. **0:00 – 0:05 | Loading Sequence & First Impression**
   - Clean entrance loader with warm paper canvas (`#F6F3ED`), Instrument Serif wordmark, and hairline progress bar.
   - Smooth slide-up into the hero. The **Live Ecosystem Scene** begins executing its continuous 14-second order simulation across the diner phone and kitchen board.

2. **0:05 – 0:40 | The Cirqla Real-Time Order Loop (The Centerpiece)**
   - Click the live table QR code on `/cirqla` or scroll to the Cirqla spotlight on the homepage.
   - The diner customer app launches in the desktop phone frame (`/cirqla/scan/kiln-street?table=12`).
   - Add **Slow-Cooked Short Rib** (choose required side: *fries*) and **House Lemonade**.
   - Open cart, apply a tip, and pay using the test card `4242 4242 4242 4242`.
   - The order tracker enters **Received** status.
   - **Cross-Tab Realtime:** Open `/cirqla/venue/orders` in a second tab (or split screen). Order **#1048** slides immediately into the *New* column with an arrival chime.
   - Click **Accept** on the venue dashboard → switch back to the diner tab to see the tracker advance live to **Preparing** (<300ms latency via `BroadcastChannel`).

3. **0:40 – 1:10 | CMS Live Inline Editing & SEO Panel**
   - Return to the Corporate homepage (`/`).
   - Click the floating **Edit Page (CMS)** pill in the bottom-right corner.
   - Dashed outlines highlight editable sections. Click the hero headline and type live changes.
   - In the right-hand panel, switch to the **SEO tab**: modify the Meta Title or Description and watch the live Google Search snippet and social card update character-by-character with green checklist ticks.

4. **1:10 – 1:40 | The Academy LMS Learning Loop**
   - Navigate to `/academy` and click **Browse Catalog** → choose *Restaurant Operations Essentials*.
   - Click **Resume lesson** to launch the video player with chapter curriculum and notes autosave.
   - Click **Take Assessment** to start the 5-question timed quiz.
   - Submit answers to view the animated score ring and instantly generate an accredited **Certificate of Completion** (`BIQ-2026-00418`) with working public verification at `/academy/verify/BIQ-2026-00418`.

5. **1:40 – 2:00 | Multi-Tenancy & Proposal Companion**
   - In Cirqla Venue Settings (`/cirqla/venue/settings`), switch tenant branding from **Kiln Street Kitchen** (`#B85C3C` clay) to **Harbour Roast** (`#2F5D62`). Notice all diner screens instantly re-skin.
   - Open `/proposal` (unlisted link in footer) to inspect the 3-lane interactive architecture diagram, stack rationale, milestone payment schedules, and source code ownership commitments.

---

## 💳 Magic Inputs & Test Cards

### Payment Gateways (Academy & Cirqla Checkout)
| Card Number | Expiry / CVC | Behavior / Verified State |
| :--- | :--- | :--- |
| `4242 4242 4242 4242` | Any future date / Any 3 digits | **Approved** — 1.4s authorization, receipt screen, moves to kitchen |
| `4000 0000 0000 0002` | Any future date / Any 3 digits | **Declined** — Inline red banner: *"Card was declined. Try another card."* |
| `4000 0000 0000 3220` | Any future date / Any 3 digits | **3D Secure** — Challenge modal with Approve and Cancel actions |

### Coupon Code (Academy Checkout)
- `WELCOME10` — Applies a **10% discount** with a visible deduction line item.
- Any other code displays an inline error: *"Invalid or expired promotion code"*.

### Lead Intake & Auth Edge Cases
- Enter `error@demo.com` on `/contact` to trigger a simulated recoverable server error with a retry toast.
- Enter `wrong@demo.com` on the Academy sign-in modal to trigger an invalid credentials shake state.

---

## 🎛️ Demo Controls Dock (Bottom-Left)

A persistent controls pill is anchored at the bottom-left of every screen:
- **Role Switcher**: Instantly preview views as *Diner*, *Venue Manager*, *Student*, *Academy Admin*, or *Super-Admin*.
- **States Cycler**: Toggle between `Normal`, `Loading (Skeleton)`, `Empty State`, and `Error State` on any data view.
- **Simulate Incoming Order**: Spawns a randomized ticket on the live kitchen board.
- **Network Latency**: Toggle 4x latency slowdown to preview progressive loading.
- **Arrival Chime**: Synthesized Web Audio 2-tone bell for new orders.
- **Leads CRM Inbox**: Slide-over drawer displaying newly captured leads from `/contact`.
- **Reset Demo Data**: Wipes local storage overrides and restores initial seed state.

---

## 📐 Design System & Architectural Principles

- **Quiet Precision Aesthetic**: Warm paper canvas (`#F6F3ED`), deep ink-green text (`#17231F`), clay accent (`#B85C3C`), slate (`#4E6A86`), and sage (`#7F9A8B`).
- **Strict Anti-AI Rules**: Zero gradients (except the 2% wash behind the hero), zero glassmorphism or blur, max 12px radius, no neon or floating blobs, crisp 1px hairlines.
- **Cross-Surface Sync**: Native `BroadcastChannel('cirqla')` combined with typed Zustand stores ensures cross-tab synchronization with sub-300ms latency.
- **Accessibility (WCAG AA)**: Full keyboard navigation, visible 2px focus rings (`:focus-visible`), aria live regions on order state updates, high contrast (>4.5:1 ratio).
