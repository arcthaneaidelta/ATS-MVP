# BionicIQ Architecture & Design Decisions

This document records the architectural and UX decisions made for the BionicIQ Ecosystem interactive demo, adhering strictly to the Implementation PRD (Oct 13, 2026).

---

### Decision 1: Single SPA with Three Distinct Product Personalities
- **Context**: The client wants to vet an engineering partner for three products (BionicIQ Corporate, Academy LMS, Cirqla Hospitality SaaS).
- **Decision**: Implemented as a single Vite + React + TypeScript application with a unified design system.
  - Corporate: Editorial, spacious, ink-green primary (`#1F3A33`), clay accents (`#B85C3C`).
  - Academy: Reading-first, calm, slate-blue accent (`#4E6A86`).
  - Cirqla: Dense, tactile, clay/terracotta accent (`#B85C3C`) dynamically re-skinnable per venue tenant.
- **Trade-off**: High modularity in a single repository; shared state without artificial boundaries.

---

### Decision 2: Cross-Surface Real-time Synchronization via BroadcastChannel + Zustand
- **Context**: The centerpiece wow-moment is ordering on a phone (`/cirqla/scan/:venue`) and seeing it arrive immediately on the venue dashboard (`/cirqla/venue/orders`).
- **Decision**: In addition to Zustand in-memory state and localStorage persistence, all order creation and status transitions broadcast over `new BroadcastChannel('cirqla')`.
- **Result**: Seamless multi-surface experience across multiple browser tabs without any cloud backend required.

---

### Decision 3: "Quiet Precision" Design System & Anti-AI Rules
- **Context**: Avoid generic startup templates, AI gradients, floating purple blobs, and glassmorphism.
- **Decision**:
  - Warm paper background `#F6F3ED`, opaque cards `#FCFBF8`, 1px hairlines `#E3DED3`.
  - Instrument Serif for headings, Geist for body and Geist Mono for data/numbers.
  - Zero gradients except one subtle 2% wash behind the hero.
  - Cards radius 12px max, buttons 8px, hairlines 1.5px.
  - Maximum 6 animated elements per viewport, respecting `prefers-reduced-motion`.

---

### Decision 4: Interactive CMS & SEO In-Place Editing
- **Context**: Proving CMS thinking rather than a static landing page.
- **Decision**:
  - Global "Edit mode" toggle on all Corporate pages.
  - Direct `contenteditable` inline editing of hero, headings, and sections.
  - Floating side panel for real-time SEO preview (Google search snippet, social preview card, char counters, and live SEO checklist) with a "Publish to Staging" toast.

---

### Decision 5: Test Card Failure Injection & Transparent Demo State
- **Context**: Real transactional UX requires showing both happy and failure states.
- **Decision**:
  - Card `4242 4242 4242 4242`: Approved with stepped status ("Authorising", "Confirming").
  - Card `4000 0000 0000 0002`: Card decline error banner with instant retry.
  - Card `4000 0000 0000 3220`: 3-D Secure authentication modal simulation.
  - Global Demo Controls dock providing state previews (Empty, Loading, Error), Network throttle simulation, and instant demo data reset.

---

### Decision 6: Proposal Companion (`/proposal`)
- **Context**: Answering all commercial questions (milestones vs monthly, tech stack rationale, support tiers, and full IP ownership) directly inside the running software.
- **Decision**: Accessible via a discrete footer link and command palette (`Cmd/Ctrl + K`), rendering an interactive 3-tier architecture diagram and real timeline calculators driven by `src/data/proposal.config.ts`.
