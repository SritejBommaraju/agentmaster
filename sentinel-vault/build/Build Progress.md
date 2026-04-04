# Build Progress

Last updated: 2026-04-04

## Phase 1 — UI Shell ✅

**Built:**
- Next.js 16 app in `execusim/` with Tailwind v4 + shadcn/ui
- `Navbar` — centered pill, ExecuSim brand, 3 nav links
- `StatusBadge` — READY_ / RUNNING_ / COMPLETE_ / FAILED_ with pulse dot
- `AgentCard` — floating dark card, active/dimmed states, float animation
- `AgentNetwork` — 5-card constellation with dashed SVG connection lines + staggered float animations
- `DashboardPanel` — 5-panel shell, fade-in-up reveal
- `/` landing page — hero split, agent network on right, CTA → /simulate
- `/simulate` dashboard — Panel 1 (idea input) visible on load, panels 2–5 revealed progressively

**Tests:** 6 suites, 37 tests — all passing

## Phase 2 — Strategy Agent + API + DB ✅

**Built:**
- InsForge `simulations` table (UUID, idea, status, strategy/rounds as JSONB, score, failure fields)
- `lib/minimax.ts` — MiniMax API wrapper, `parseLLMJson` strips markdown fences
- `lib/agents/strategyAgent.ts` — idea → `{ icp, pricing, messaging, hypothesis }`, validates all 4 fields
- `app/api/simulate/route.ts` — creates DB record, runs strategy agent, persists result
- `components/StrategyDisplay.tsx` — renders 4 strategy fields in Panel 2
- Panel 2 now shows loading skeleton → strategy content after API responds
- Error banner on failure, status badge reflects running/failed state

**Tests:** 10 suites, 60 tests — all passing
**TypeScript:** zero errors

## Phase 3 — Persona Generator + Round 1 🔲

Next to build:
- 3 persona agents (Early/Growth/Mid-Market) with system prompts from Guardrail Rules.md
- Run all 3 in parallel after strategy is generated
- Each outputs: `{ interest_score, objections[], likelihood, willingness_to_pay }`
- Persist to `simulations.round1` in InsForge
- `PersonaCard` component showing stage, score, objections
- Panel 3 reveals with persona grid

## Phase 4 — Executive Supervisor + Multi-Round Loop 🔲

- Supervisor agent: aggregates Round 1, identifies weak spots, outputs pivot decision
- Loop: max 3 rounds, supervisor runs after each non-final round
- Panel 4 reveals with pivot rationale per round

## Phase 5 — Scoring + Failure Path 🔲

- Scoring engine: weighted formula, per-stage weights
- Score < 50% after all rounds → failure message + top objections
- Panel 5: score count-up, green/yellow/red, per-persona breakdown

## Phase 6 — Streaming + Polish 🔲

- Simulated typewriter streaming per panel
- Sequential panel reveals
- Active agent card highlighting
- Demo fallback (cached compliance tool responses)
