# Implemnt Pipeline Trace — Interactive Diagnostic Demo

A high-fidelity frontend diagnostic prototype built for the bid on:  
**"Developer Needed to Debug Recall.ai Meeting Bot + AI Workflow (Existing SaaS MVP)"**

---

## 🎯 Purpose & Philosophy

"Diagnosis first, not new code."

This application is designed as an editorial investigation board / flight recorder demonstrating how to systematically trace a multi-stage meeting intelligence pipeline (**Calendar → Recall.ai → Transcript → LLM → Base44 → Monday.com**) to find where failures happen before rewriting any production code.

### Core Problems Explored:
1. **Recording Reliability**: Why bots join some calls but miss others (recurring calendar sub-instance detachment, 10-minute lobby timeouts, expired 90-day OAuth tokens).
2. **Trigger Reliability**: Why structured triggers fail or produce false positives (context-aware extraction vs brittle keyword heuristics).
3. **Delivery Reconciliation**: Why 9 out of 44 successfully recorded meetings leaked downstream before reaching Monday.com.

---

## 🚀 Key Modules in the Demo

- **Landing Page (`/`)**: Animated 6-stage pipeline strip looping 3 realistic scenarios with token travel, contrast cards, and pinned 5-step diagnostic methodology.
- **Pipeline Trace (`/app/trace`)**: 6-stage interactive trace lighting up in sequence (280ms/stage) and halting at failure nodes with forensic logs, Recall bot configuration, webhook payloads, and LLM output.
- **Missed Meetings Forensics (`/app/meetings`)**: 30-meeting dataset across a 7-cause failure taxonomy, with search, platform/cause filters, and forensic drawer inspection.
- **Delivery Funnel (`/app/delivery`)**: Visual reconciliation highlighting the "silent loss" phenomenon and expandable drop explanations.
- **Signal Lab (`/app/signals`)**: Side-by-side interactive toggle comparing keyword heuristic matching vs context-aware polarity with live Monday.com mutation preview.
- **Findings Report (`/app/findings`)**: 6 prioritized findings with smallest reasonable fixes and "Include in scope" controls.
- **Scope Gate (`/app/scope`)**: Milestone progression roadmap with dynamic effort hours calculator and founder approval gate.
- **Operator Runbook (`/app/handoff`)**: 5-step checklist for missed calls, changelog, alerting rules, and one-click markdown copy/download.
- **Proposal Answers (`/proposal`)**: 6 accordion items mapped 1:1 to questions Q1–Q6 from the client's RFP.

---

## 🛠️ Tech Stack

- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS v4 + Design Tokens (warm paper neutrals `#F6F3EE`, deep ink-teal `#1F4B4A`, clay accent `#B4643C`)
- **Typography**: Fraunces (Headings), Inter (UI), JetBrains Mono (Forensic logs)
- **State Management**: Zustand with `localStorage` persistence
- **Icons**: Lucide React
- **Routing**: React Router DOM (v7) with Netlify SPA redirect configurations

---

## 💻 Local Development

```bash
# Install dependencies
npm install

# Start Vite dev server
npm run dev

# Build for production
npm run build
```

---

## 🌐 Netlify Deployment

Configured with `netlify.toml` and `public/_redirects` to support single-page application (SPA) client-side routing on Netlify.
