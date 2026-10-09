# GoHighLevel Journey Studio — Client Demo

A high-fidelity GoHighLevel (GHL) system demonstration and proposal showcase designed for service businesses. It proves lead capture, qualification, appointment booking, follow-up automations, deduplication, TCPA compliance, and Retell AI voice agent integration.

## 🚀 Live Demo & Surfaces

The application consists of two connected surfaces:

1. **Side A: Public Funnel (Alder & Finch Home Studio)**
   - `/` — Branded landing page with cinematic hero, process, recent work, testimonials, and FAQ.
   - `/start` — 5-step intake survey with live validation, duplicate detection, and recoverable error handling (`test@error.com`).
   - `/book` — Real-time calendar slot picker with taken-slot collision handling (`2:30 PM`).
   - `/thanks` — Booking confirmation with client-generated RFC-5545 `.ics` file download.
   - `/booking/:id` — Self-serve reschedule and cancellation modal.

2. **Side B: Operator Console (Journey Studio)**
   - `/studio` — Overview dashboard with needs-action cards, speed-to-lead KPIs, and pre-flight audit findings.
   - `/studio/pipeline` — 6-stage kanban with drag-and-drop, automated stage rules, and opportunity drawer.
   - `/studio/contacts` — Contact database with tag filters, TCPA DND records, and CSV export.
   - `/studio/workflows` — 5 named automations with interactive SVG node maps and stop-on-reply conditions.
   - `/studio/simulator` — **Hero Feature**: trigger lead actions (Reply, STOP, Book, Duplicate, Miss) and watch robot messages cancel and staff tasks create in real time.
   - `/studio/voice` — Retell AI + Twilio call feed, live simulated AI call with transcript, and GHL custom field mapping.
   - `/studio/calendar` — Weekly calendar grid and availability settings that synchronize directly with `/book`.
   - `/studio/reports` — Dynamic headline rewrite, 4 SVG analytics charts, and attribution table.
   - `/studio/setup` — Custom fields dictionary, tag library taxonomy, and DNS checklist (SPF, DKIM, DMARC, A2P 10DLC).
   - `/studio/handoff` — 12-point QA test runner, in-app operator guide, video walkthrough chapters, and 30-day support tickets.
   - `/proposal` — $1,000 fixed price milestone roadmap with itemized voice agent line item.

---

## 🛠️ Tech Stack

- **Framework**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + CSS Variables (Warm Editorial Design Tokens: Fraunces & Inter)
- **State & Sync**: Zustand with LocalStorage persistence and `BroadcastChannel` for cross-tab updates
- **Icons**: Lucide React
- **Deployment**: Netlify ready (`netlify.toml` + `public/_redirects`)

---

## 📦 Local Development

```bash
# 1. Clone the repository
git clone https://github.com/arcthaneaidelta/Gohighlevel-CRM.git
cd Gohighlevel-CRM

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Build for production
npm run build
```

---

## 🌐 Deploying to Netlify

This repository is pre-configured with `netlify.toml` and `public/_redirects` for single-page application (SPA) routing:

1. Connect this GitHub repository in Netlify.
2. Build settings will auto-detect from `netlify.toml`:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
3. Click **Deploy Site**.
