# TenderVantage — Interactive Frontend Prototype

High-fidelity demonstration prototype for **TenderVantage**, a Botswana tender-writing and bid-support consultancy based in Gaborone.

This prototype previews the client's planned WordPress / Elementor / WooCommerce build in a reactive frontend stack, demonstrating complete mastery of their brief: 10 fixed-price BWP services, 5 custom WooCommerce order statuses, DPO Group direct API payment flow, WP Customer Area client portal, WPForms Pro multi-step intake with conditional logic, Google Workspace SMTP email alerts, and 4 WooCommerce webhook endpoints feeding n8n automation.

---

## 1. Quick Start

### Prerequisites
- Node.js 18+ (tested on Node 20+)
- npm 9+

### Installation & Local Server
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open `http://localhost:5173` in your browser.

### Production Build
```bash
# Typecheck & build production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 2. Reviewer Demo Guide & Tools

On every screen, look for the **Demo guide** pill (bottom-left on desktop, bottom-centre on mobile). Clicking it opens the Reviewer Control Panel containing:

1. **Guide & Scenarios**:
   - **Suggested Path**: A 5-step interactive walkthrough that automatically ticks as you explore.
   - **Role Switcher**: One-click toggling between **Client** (Naledi Mokgosi), **Staff** (Lorato Dube, Head of Bids), and **Under the hood**.
   - **Edge-Case Toggles**:
     - *Simulate declined payment*: Triggers the bank decline screen (`4000 0000 0000 0002`) preserving cart state.
     - *Simulate payment pending/timeout*: Shows payment confirmation wait status.
     - *Simulate receiver failure (500)*: Webhook test returns 500 error with retry button.
     - *Simulate download failure*: Demonstrates recoverable error state on file vault.
     - *Fast-forward 24 hours*: Advances the demo clock to fire the intake reminder email.
     - *Reset Demo Data*: Clears local state and restores initial seed orders and logs.
2. **Mock Inbox (8 Automated Email Notifications)**:
   - Preview realistic HTML and plain-text emails styled with TenderVantage branding that fire on orders, intakes, draft reviews, revisions, and deliveries.
3. **Webhook Inspector (4 n8n Endpoints)**:
   - Live payload monitor for `/hooks/order-created`, `/hooks/order-status-changed`, `/hooks/intake-submitted`, and `/hooks/order-delivered`, complete with HMAC signatures, timestamps, and JSON inspection.
4. **Build Map Overlay**:
   - Toggles contextual badges across every section showing its WordPress equivalent (e.g., *Elementor Pro · Home template*, *WooCommerce Virtual Product*, *WP Customer Area*, *WPForms Pro*).
5. **Handover & QA Standards**:
   - Full launch checklist covering Build, Commerce, Portal, Forms, Email/Webhooks, Performance, SEO, Security, and Client Handover.

*Tip: Add `?guide=off` to any URL to hide the Demo Guide pill for clean screen recording.*

---

## 3. Demo Accounts

The prototype pre-seeds 4 fictional personas reflecting realistic Botswana procurement scenarios:

| Name | Company & Location | Role | Situation Demonstrated |
| :--- | :--- | :--- | :--- |
| **Naledi Mokgosi** | Kgosi Mining Supplies (Pty) Ltd · Gaborone | Client | Mid-order client: Active orders in *Awaiting Intake* and *Client Review*, file downloads, writer messages. |
| **Thabo Seretse** | Seretse Civil Works · Francistown | Client | First-time bidder: Fresh account, empty states, first checkout and intake flow. |
| **Boitumelo Kgathi** | Kalahari Fresh Logistics · Maun | Client | Returning client: Order in *Revisions Requested* with revision history, delivered orders, extensive document vault. |
| **Lorato Dube** | TenderVantage · Gaborone | Staff | Head of Bids: Staff Delivery Desk (`/staff`) to advance statuses and upload deliverables with real-time client sync. |

*Quick login: Click **"Switch demo account"** from the portal header menu, or use the prefilled buttons on `/portal/login` (password `demo1234`).*

---

## 4. The 5 Custom Order Statuses

The service delivery lifecycle is governed by 5 custom statuses with strict visual tokens:

1. **Awaiting Intake** (`#6F7A78`, circle-dashed icon): Order placed; waiting for client compliance & tender documents.
2. **In Production** (`#3F6C8C`, loader icon): Intake received; TenderVantage bid team is writing.
3. **Client Review** (`#B7791F`, eye icon): Draft proposal delivered; client reviews with 3-day turnaround.
4. **Revisions Requested** (`#A94438`, rotate-ccw icon): Client requested adjustments; writer updating drafts.
5. **Delivered** (`#3E7A5B`, check icon): Final bid pack formatted, zipped, and delivered to document vault.

---

## 5. Information Architecture & Key Routes

### Public Pages (Elementor Equivalent)
- `/` — Home (Loader sequence, Bid Workbench 16s loop, proof strip, tender lifecycle pinned section, interactive status stepper, featured services).
- `/about` — About (Methodology, standards, team bios).
- `/services` — Services directory with sticky stage spy and **Service Finder Modal**.
- `/how-it-works` — Order-to-delivery journey, 5 custom statuses explanation, FAQ accordion.
- `/resources` — Resource library with Yoast SEO preview and tender calendar.
- `/resources/:slug` — Article reader with reading progress bar.
- `/contact` — Enquiry form with conditional urgent closing date field.
- `/privacy`, `/terms`, `/refunds` — Policy agreements tailored to Botswana procurement.

### Service Store (WooCommerce Equivalent)
- `/store` — 10 services catalog filtered by stage, search keyboard shortcut (`/`).
- `/store/:slug` — Detailed scope, inclusions, what we need, add-on pricing tweens.
- `/cart` — Cart summary (strictly 1 service per order), coupon validation (`FIRSTBID10`).
- `/checkout` — Checkout with company details (CIPA number pattern) and demo autofill.
- `/checkout/pay` — Neutral simulated hosted payment gateway (card & mobile money tests).
- `/checkout/complete/:orderId` — Order confirmation with immediate intake CTA.

### Client Portal (WP Customer Area Equivalent)
- `/portal/login` — Split login screen with 1-click demo account switcher.
- `/portal` — Client dashboard prioritizing *"Needs your attention"* tasks.
- `/portal/orders` — Orders table with status filters and deadline chips.
- `/portal/orders/:id` — Order detail with interactive 5-stage timeline, writer chat, draft approval modal, and revision request modal.
- `/portal/documents` — Secure vault with tabs, search, file preview drawer, and drag-and-drop uploader.
- `/portal/intake/:formId` — Multi-step intake forms A, B, and C with conditional logic and uploads.
- `/portal/account` — Profile settings, notification preferences, data deletion requests.

### Staff View (Admin Minimal Desk)
- `/staff` — Internal queue to advance orders through all 5 statuses and upload deliverables with live sync to the client portal.

### Development View
- `/dev/tokens` — Live design tokens verification matrix.

---

## 6. How to Reset Demo Data

To return the prototype to its initial seed state:
1. Open the **Demo guide** (bottom-left pill).
2. Go to the **Guide** tab and click **"Reset demo data"**.
3. Confirm the modal prompt.
*Alternatively, run `localStorage.removeItem('tv_demo_v1')` in the browser console and refresh.*

---

## 7. Tech Stack & Performance

- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS v4 token-driven architecture (`tokens.css` + `@theme`)
- **State Management**: Zustand with persistent storage (`tv_demo_v1`) and domain event bus
- **Icons**: Lucide React (1.5px stroke)
- **Forms**: Controlled components with inline validation and accessible ARIA attributes
- **Performance**: Strict budget met (Initial JS ~151 kB gzip, CSS ~12 kB gzip, route code-splitting for Portal and Staff).
