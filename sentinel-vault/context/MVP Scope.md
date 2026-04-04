# MVP Scope

## Must Build

### 1. Strategy Agent
- Input: one-line idea from user
- Output: ICP, pricing, messaging, core hypothesis
- Powered by MiniMax with "startup strategist" system prompt

### 2. Persona Generator
- Creates 3 fixed synthetic **business buyer** personas — each represents a decision-maker at a specific company growth stage:
  - **Stage 1 — Early-Stage** (1–20 people): founder making all tool decisions, no process, needs it to work today
  - **Stage 2 — Growth-Stage** (20–150 people): Head of Ops/VP with real budget, needs ROI justification, stack integration, team adoption
  - **Stage 3 — Mid-Market** (150–500 people): Director/VP with procurement process, legal review, security requirements, stakeholder committee
- Personas are grounded in how these people actually talk and think — not generic archetypes
- Labeled by business stage, not attitude (no "skeptical" or "early adopter" labels)
- Each has: stage, company_size, role, key_constraints, buying_language

### 3. Simulation Loop (Round 1 + Round 2)
- Each persona evaluates the strategy
- Outputs: interest_score (0–10), objections[], willingness_to_pay
- Round 1 → Executive Supervisor → pivot → Round 2

### 4. Executive Supervisor
- Aggregates Round 1 responses
- Identifies weak spots (low scores, repeated objections)
- Outputs a pivot: adjusted pricing or messaging
- Triggers Round 2 with updated strategy

### 5. Validation Score
- Computed after Round 2
- Formula: `avg(likelihood) * 0.6 + adoption_rate * 0.4`
- Persona weights applied (enterprise 1.5x, skeptic 1.2x, early adopter 1.0x)

### 6. Dashboard (5 Panels)
- Panel 1: Idea input
- Panel 2: Generated strategy
- Panel 3: Persona responses (Round 1 + Round 2)
- Panel 4: Executive decisions (pivot rationale)
- Panel 5: Final validation score

## Complexity Constraints

- Max 3 personas
- Exactly 1 pivot loop
- 1 validation score output
- No real data, scraping, or outreach
