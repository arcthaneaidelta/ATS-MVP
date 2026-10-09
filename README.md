# Groundwork — GoHighLevel Lead Capture, Nurture & Conversion System

> **A turnkey, high-fidelity operating prototype built for US Home Builders (Alder & Stone Homes, Charlotte NC).**  
> Built on GoHighLevel architecture with strict US telephony compliance, 90-day buyer nurture automation, social lead bots, and a 60-minute handover training academy.

---

## 🌟 Key Features & Interactive Demos

1. **Speed-to-Lead Simulator (<7s):**
   - Live millisecond countdown benchmark clock.
   - 6-step instant response sequence: lead ingestion, 2-way SMS, PDF lookbook email, counselor mobile push, and call bridge.
   - Interactive speed switcher (0.5x, 1x, 2x) and email fallback error mode.

2. **90-Day Buyer Nurture with Time Scrubber:**
   - Visual flowchart canvas displaying triggers, delay waits, SMS, email, and staff tasks.
   - Interactive time scrubber slider (Day 0 to Day 90) with auto-play mode (120ms/day) that lights up executed nodes and populates the buyer's received touch timeline.

3. **Social Comment-to-Lead Automation:**
   - Interactive Instagram feed mockup.
   - Commenting `"PRICE"` triggers an instant public reply, private DM lookbook link, and creates an ingested lead in the CRM tagged with `Source: Instagram Organic`.

4. **Sales Pipeline & Kanban Board:**
   - 7 active buyer stages (*New Inquiry*, *Contacted*, *Tour Booked*, *Tour Completed*, *Design Consult*, *Contract Signed*, *Closed Won*) plus *Nurture* and *Lost* lanes.
   - Drag-and-drop card movements triggering automated workflow toasts.
   - 480px slide-out Lead Detail Drawer with *"Simulate Next Step"* action.

5. **Marketing Attribution & Funnel Analytics:**
   - Visual 5-stage conversion funnel with dropoff rates.
   - Full channel attribution table computing **Cost Per Lead** and **Cost Per Contract** across Meta, Google, Portals, and Realtors.
   - Dynamic date range filter (*Last 7d*, *Last 30d*, *Last 90d*, *This Quarter*).

6. **US Telephony & Housing Compliance:**
   - A2P 10DLC brand trust status verification.
   - Automated TCPA Quiet-Hours Send Guard (intercepts messages attempted outside 8:00 AM – 9:00 PM local time).
   - Interactive Fair Housing copy scanner that audits prohibited demographic terminology.

7. **Team Academy Handover Player:**
   - 16:9 video player UI with 8 structured chapters equaling 60:00 runtime.
   - Interactive progress ring persisted to browser storage, transcripts, and downloadable SOP checklists.

8. **Three Conversion Funnels:**
   - Harlow Creek Master-Planned Community Inquiry Funnel (with live split-view to CRM).
   - 5-Step Floor Plan Matcher Interactive Quiz.
   - Custom & On-Your-Lot Discovery Portal.

---

## 🚀 Netlify Deployment

This repository is pre-configured for instant zero-configuration deployment on **Netlify**:

- **Build command:** `npm run build`
- **Publish directory:** `dist`
- **SPA Routing:** Configured via `netlify.toml` and `public/_redirects` to handle client-side routing (`/* -> /index.html 200`) on page refresh.

### To Deploy on Netlify:
1. Log in to [Netlify](https://app.netlify.com/).
2. Click **"Add new site"** → **"Import an existing project"**.
3. Select **GitHub** and authorize access to `arcthaneaidelta/GroundWork-Go-High-Level-Automation`.
4. Netlify will automatically detect:
   - Base directory: `/`
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Click **"Deploy site"**.

---

## 💻 Local Development

```bash
# Clone the repository
git clone https://github.com/arcthaneaidelta/GroundWork-Go-High-Level-Automation.git

# Install dependencies
npm install

# Start local development server
npm run dev

# Run production build
npm run build
```

---

## 🛠 Technology Stack

- **Framework:** React 18 + TypeScript + Vite
- **Styling:** Tailwind CSS v4 with bespoke residential architecture design tokens
- **Typography:** Newsreader (display serif) & Instrument Sans (UI)
- **Icons:** Lucide React
- **Routing:** React Router v7
- **State Management:** Reactive store with `sessionStorage` and `localStorage` persistence
