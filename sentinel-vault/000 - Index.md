# ExecuSim — Vault Index

> AI Market Simulation Executive — B2B Idea Validation via Synthetic Business Buyers

## Navigation

- [[context/Product Vision]] — what we're building and why
- [[context/Tech Stack]] — chosen technologies
- [[context/MVP Scope]] — deliverables and scope constraints
- [[architecture/System Architecture]] — three-layer agent diagram
- [[architecture/Data Flow]] — step-by-step simulation workflow
- [[architecture/API Contracts]] — endpoint specs
- [[architecture/Guardrail Rules]] — agent prompts + business stage persona definitions
- [[build/Build Priority Order]] — what to build first
- [[build/Demo Scenario]] — the pitch-facing story with sample outputs
- [[build/Reliability Scoring]] — validation score formula + weights
- [[build/UI Design Spec]] — visual language, animation system, card anatomy

## Core Decisions Locked

| Decision | What |
|----------|------|
| Name | ExecuSim |
| Domain | B2B idea validation only |
| LLM | MiniMax (all agents) |
| Frontend | Next.js, dark Nodum-style UI |
| Personas | 3 business buyer stages — NOT consumer, NOT attitude labels |
| Persona stages | Early (1–20), Growth (20–150), Mid-Market (150–500) |
| Persona grounding | Real online language from these buyer types |
| Pivot types | pricing / messaging / icp / both / none |
| Score formula | avg(likelihood) × 0.6 + adoption_rate × 0.4 |
| Stage weights | Mid-market 1.5x, Growth 1.2x, Early 1.0x |
| Env vars | MINIMAX_API_KEY, NEXT_PUBLIC_INSFORGE_URL, NEXT_PUBLIC_INSFORGE_ANON_KEY |

## Core Decisions Locked (Updated)

| Decision | What |
|----------|------|
| Simulation loop | Max **3 rounds** (Round 1 + up to 2 pivots) — NOT infinite |
| Failure path | If score < 50% after all rounds → "idea didn't validate" + top objections |
| Backend | InsForge DB (`simulations` table) for persistence |
| Testing | Jest 29 + ts-jest (NOT next/jest — SWC locked on Windows) |
| App directory | `execusim/` inside agentmaster repo |

## Build Status

| Area | Status |
|------|--------|
| Vault fully current | ✅ Done |
| Architecture defined | ✅ Done |
| Persona definitions written | ✅ Done |
| UI design spec written | ✅ Done |
| Env vars configured | ✅ Done |
| UI shell | ✅ Done (Phase 1 — 2026-04-04) |
| Strategy agent + API + DB | ✅ Done (Phase 2 — 2026-04-04) |
| Persona generator + Round 1 | 🔲 Phase 3 |
| Executive supervisor + multi-round loop | 🔲 Phase 4 |
| Scoring + failure path | 🔲 Phase 5 |
| Streaming + polish + demo fallback | 🔲 Phase 6 |
