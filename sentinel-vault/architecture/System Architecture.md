# System Architecture

## Three-Layer Diagram

```
User Input (idea)
       ↓
┌─────────────────────┐
│   Strategy Agent    │  ← generates ICP, pricing, messaging, hypothesis
└─────────────────────┘
       ↓
┌──────────────────────────────────────────────┐
│        Synthetic Business Buyer Population   │
│                                              │
│  ┌──────────────────┐  ┌──────────────────┐  │
│  │  Stage 1         │  │  Stage 2         │  │
│  │  Early-Stage     │  │  Growth-Stage    │  │
│  │  (1–20 people)   │  │  (20–150 people) │  │
│  └──────────────────┘  └──────────────────┘  │
│  ┌──────────────────┐                         │
│  │  Stage 3         │                         │
│  │  Mid-Market      │                         │
│  │  (150–500 people)│                         │
│  └──────────────────┘                         │
└──────────────────────────────────────────────┘
       ↕  (responses: interest_score, objections, likelihood, willingness_to_pay)
┌─────────────────────┐
│ Executive Supervisor│  ← aggregates, identifies pivot, triggers re-simulation
└─────────────────────┘
       ↓
┌─────────────────────┐
│  Validation Score   │  ← weighted formula output (0–100%)
└─────────────────────┘
       ↓
     Dashboard (5 panels)
```

## Components

### 3.1 Strategy Agent
- System prompt: B2B startup strategist
- Input: idea (string)
- Output: `{ icp, pricing, messaging, hypothesis }`
- ICP must specify: business type, company size, decision-maker role

### 3.2 Persona Generator
- Instantiates 3 fixed business buyer personas at runtime
- Labeled by **business stage**, not attitude archetype
- Stages:
  - `stage_early` — founder at 1–20 person company, no process, decides same-day
  - `stage_growth` — Head of Ops/VP at 20–150 person company, needs ROI + stack integration
  - `stage_mid_market` — Director/VP at 150–500 person company, full procurement process
- Personalities grounded in real online language from these buyer types (Reddit, HN, LinkedIn, G2)
- Each persona has: `stage`, `company_size`, `role`, `key_constraints`, `buying_language`

### 3.3 Business Buyer Simulation Agents
- One MiniMax LLM call per persona per round
- System prompt encodes stage identity, real constraints, authentic voice
- Output per persona: `{ interest_score, objections[], likelihood, willingness_to_pay }`

### 3.4 Executive Supervisor
- Receives all 3 persona responses from Round 1
- Identifies: which stage reveals the biggest weakness, pattern of objections across stages
- Can pivot: pricing, messaging, ICP (wrong stage targeted), or combination
- Outputs: `{ should_pivot, pivot_type, pivot_rationale, updated_strategy }`
- Triggers Round 2 with updated strategy if `should_pivot == true`

### 3.5 Scoring Engine
- Runs after Round 2
- Applies stage weights: mid-market 1.5x, growth 1.2x, early 1.0x
- Formula: `avg(likelihood) * 0.6 + adoption_rate * 0.4`
- Returns final `validation_score` (0–100%)

### 3.6 Dashboard
- Next.js, 5 panels, dark theme (Nodum-style)
- Floating agent cards with staggered vertical oscillation animation
- Panels reveal sequentially as simulation progresses
