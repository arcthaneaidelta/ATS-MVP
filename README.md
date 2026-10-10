# Stratum — Multi-OEM Mining Spare Parts ERP & Commercial Memory

**Tagline:** *"Every part number. Every price. One memory."*  
**Brand Config:** Swappable via `src/config/brand.ts`.  
**Stack:** React 18 + TypeScript + Vite + Tailwind CSS + Framer Motion. Zero external backend dependencies; all data is relationally modeled and persisted in `localStorage`.

---

## 🎯 Overview & Real Problem Solved
Mining equipment spare parts traders in Peru, Zambia, and international corridors resell parts across multiple OEMs (Epiroc, Sandvik, RESEMIN, Caterpillar, Komatsu, Normet, Montabert). Their margin is earned in the gap between supplier origin cost and customer quote.

Their core operational problem is a **memory problem**:
- Decades of quotes, supplier lists, and invoices are scattered across Excel spreadsheets, Zoho Creator, Billdu, and Google Drive.
- An incoming RFQ with 50+ lines takes hours of manual hunting, leading to inconsistent margins, forgotten supplier discounts, and missed aftermarket equivalents.

**Stratum** proves an integrated, relational system where **one part number opens everything connected to it**.

---

## 🚀 Key Features & Demo Journeys

### 1. Landing Page & The Live Part-Number Resolver (`/`)
- **Contour Reveal Entry Loader:** Adaptive SVG contour animation with brand reveal (session-cached).
- **Hero Live Resolver:** Auto-types part numbers character-by-character; resolves cross-OEM aliases (e.g. typing Sandvik `SDV-4471-023` resolves to Canonical `STR-000412 · Shank Adapter T38` with chips for Epiroc and RESEMIN).
- **The Problem Story:** Four scattered source cards (Excel, Billdu, Drive, Zoho) visually collapse into a single canonical part record.
- **Capability Showcase:** Five interactive mini-components: Part memory, RFQ matching, price ladder, order fulfillment, and multi-entity switcher.
- **Freelance Bid Companion (`#proposal`):**
  - **Architecture Spec:** Interactive toggle comparing *Zoho Creator-first* vs. *Custom PostgreSQL/API Stack* with trade-offs.
  - **4-Phase Delivery Timeline:** Expandable deliverables and milestone payments.
  - **5-Stage Migration Plan:** Inventory → Normalize → Dedupe → Relink Documents → Client Validation.
  - **SLA & Support Plans:** Essential, Growth, and Partner packages.

### 2. Global Parts Master (`/app/parts`)
- Multi-OEM table with instant fuzzy search (ignores hyphens, spaces, and casing).
- Filters for OEM, category, and verified alternatives.
- **Part Detail Drawer (`/app/parts/:partId`):**
  - **Reference Map:** Visual tree showing canonical part connected to OEM, aftermarket, and superseded numbers.
  - **Unified Commercial History:** Chronological ledger of customer quotes, sales, supplier quotes, and purchases.
  - **Verified Alternatives:** Tested aftermarket equivalents with compatibility scores and tester verification.
  - **Technical Specs & Documents:** Schematics, drawings, and metallurgy certificates.

### 3. Pricing Intelligence (`/app/pricing`)
- **Commercial Price Ladder:** Six-marker continuum (OEM list → Best supplier quote → Last purchase cost → Landed cost → Latest customer quote → Realized selling price) with an oxidized copper margin bracket.
- **Landed Cost Breakdown Popover:** Unit cost + freight + customs duty + handling.
- **SVG Price Timeline Trendline:** Chronological price progression across years.
- **Quotation History Table:** Auto-identifies and badges the **Latest** quote reference.

### 4. RFQ Import Wizard (`/app/rfq/new`)
- **Step 1 — Upload:** Dropzone with **"Use Sample RFQ (Minera Andaluz · 42 lines)"** button.
- **Step 2 — Progressive Match:** Progressive 60ms row resolution into Matched, Alternate OEM Match, Multiple Candidates, or Not Found. Inline exception resolver popover.
- **Step 3 — Margin & Suppliers:** Global margin slider (default 24.6%) with one-click apply to all, row-level 3-supplier comparison, and below-margin warnings.
- **Step 4 — Review & A4 Preview:** Live styled printable A4 quotation with entity letterhead, bank details, and instant PDF download / email simulation.

### 5. Procurement & Orders Board (`/app/orders`)
- Segmented Customer Orders (Sales) vs Supplier Orders (Purchases).
- **Fulfillment Progress Bars:** Segmented bars showing delivered, in-transit, and backordered quantities.
- **Partial Delivery Modal:** Enter waybills and delivered quantities with strict validation against outstanding quantities.

### 6. Commercial Documents Hub (`/app/documents`)
- Standardized trade documentation suite: Quotations, Supplier RFQs, Purchase Orders, Pro Forma Invoices, Commercial Invoices, Packing Lists, Credit Notes.
- Printable A4 preview modal with formal entity letterhead and banking blocks.

### 7. Finance & Debt Aging (`/app/finance`)
- **5-Bucket Debt Aging Bar:** Current, 1–30, 31–60, 61–90, 90+ days overdue (clickable to filter invoices).
- **Payment Milestones Schedule:** Advance, shipment, and acceptance milestone tracking.
- **Register Payment Modal:** Instant ledger recalculation with data-update highlight ripple.
- **Customer Statement Drawer:** Running commercial account balance.

### 8. Migration Console (`/app/migration`)
- Source cards for legacy Excel, Zoho, Billdu, and Google Drive.
- **Duplicate Review Queue:** Side-by-side card pairs with difference highlights and keyboard shortcuts (`M` to merge, `K` to keep, `A` to add as alternative).
- **Drive Document Relinking:** Matches legacy PDFs with transactions while preserving originals intact.

### 9. Multi-Entity & Access Control (`/app/admin`)
- Subsidiaries: Stratum Perú S.A.C. (PEN/USD), Stratum Zambia Ltd (ZMW/USD), Stratum International FZE (USD).
- **Interactive Permission Matrix:** Click cells to cycle permissions (None → View → Edit → Approve).
- **Role Simulation:** Instant test preview as Sales, Buyer, Finance, Director, or Admin.

### 10. Global Command Palette (`⌘K` or `/`)
- Global multi-OEM fuzzy search across parts, quotations, orders, and counterparties.

---

## 🛠️ Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run production build & verify bundle budgets
npm run build
```

---

## 🎨 Design System Tokens
- **Palette:** Warm stone (`#F5F2EC`), slate surfaces (`#FBFAF7`), deep green-slate primary (`#2E4A42`), oxidized copper accent (`#B4713B`).
- **Typography:** Display (`Instrument Serif`), UI (`Inter`), Numbers/Codes (`JetBrains Mono` tabular-nums).
- **No clichés:** Zero neon, zero stock photos, zero AI hype copy. Material honesty reflecting mineral extraction.
