# Simulation Upgrade Plan

## Goal

Upgrade ExecuSim from a useful prompt-driven demo into a more credible synthetic buyer pressure-testing system.

The core principle:

**Improve buyer realism before adding more rounds.**

More loops alone will not make the product smarter. Better embodiment, better evidence grounding, and better structured scoring will.

---

## Current State

Right now the simulation is good at:

- turning a vague idea into a concrete GTM hypothesis
- surfacing obvious weaknesses in pricing, messaging, and ICP
- creating a visible "simulate -> pivot -> resimulate -> score" product loop
- providing strong demo value

Right now the simulation is weak at:

- deeply embodying realistic buyers
- grounding buyer behavior in actual evidence
- distinguishing "big venture upside" from "current buyer readiness"
- handling broad ideas that require strategic narrowing before evaluation
- modeling internal buying dynamics across stakeholders

Current agents are not autonomous research agents.

They are:

- prompt-conditioned role simulators
- not performing real-time customer research
- not scraping or continuously updating buyer beliefs
- not maintaining persistent memory about real market segments

---

## Product Direction

ExecuSim should be positioned as:

**Synthetic buyer pressure-testing for B2B ideas**

Not:

- a market oracle
- a replacement for real customer interviews
- autonomous truth about whether a startup will succeed

The product should answer:

- What objection kills this first?
- Which segment is reacting most strongly?
- Is the weakness pricing, messaging, trust, or ICP?
- Is this pitch ready for real customer discovery?

---

## Strategic Recommendation

Keep **2 rounds** as the default simulation loop.

- Round 1: market reaction
- Round 2: post-pivot reaction

Add a third round only conditionally later if needed.

The highest-leverage upgrade is:

1. stronger buyer embodiment
2. better evidence grounding
3. structured objection analysis
4. separate scoring dimensions

---

## Phase 1 - Buyer Model Upgrade

### Objective

Replace shallow persona prompting with richer buyer embodiment.

### New Buyer Schema

Each buyer should have:

- `stage`
- `company_size`
- `role`
- `decision_authority`
- `budget_tolerance`
- `current_stack`
- `procurement_friction`
- `success_metrics`
- `switching_resistance`
- `trust_requirements`
- `buying_triggers`
- `top_risks`
- `language_style`

### Architectural Change

Split the current persona system into two layers:

1. `buyerProfileGenerator`
   Generates the concrete buyer profile.

2. `buyerEvaluator`
   Evaluates the strategy as that specific buyer.

### Why

This prevents the evaluator from improvising a shallow buyer every run.
It also gives the simulation more consistency across rounds.

---

## Phase 2 - Structured Objections

### Objective

Turn objections into structured signals instead of only free text.

### New Objection Shape

Each objection should include:

- `text`
- `category`
- `severity`
- `blocking`

### Proposed Categories

- `roi`
- `workflow`
- `integration`
- `trust`
- `security`
- `procurement`
- `pricing`
- `change_management`

### Proposed Severity

- `low`
- `medium`
- `high`

### Why

This gives the supervisor a real signal model rather than relying on prose summarization.

---

## Phase 3 - Evidence Grounding

### Objective

Ground buyer behavior in real market patterns instead of pure prompt invention.

### Approach

Create **domain evidence packs** for target verticals.

Example domains:

- legal
- fintech
- HR
- sales
- compliance
- design ops

### Each Evidence Pack Should Include

- buyer-language examples
- common objections
- expected ROI language
- procurement expectations
- typical budgets
- required integrations
- trust/compliance expectations
- adoption blockers

### First Version

Do not start with live research in the runtime path.

Start with:

- curated markdown or JSON evidence packs
- manually prepared domain summaries
- optional offline refresh process later

### Why

This improves realism without making the simulation slow or brittle.

---

## Phase 4 - Supervisor Upgrade

### Objective

Make the executive supervisor a true decision layer.

### Current Limitation

The supervisor mostly reacts to text and produces a revised strategy.

### New Inputs

Supervisor should consume:

- buyer-stage breakdown
- objection categories
- objection severity distribution
- blocking objection counts
- likelihood deltas
- willingness-to-pay shifts
- trust/procurement intensity

### New Outputs

- `should_pivot`
- `pivot_type`
- `pivot_rationale`
- `updated_strategy`
- `primary_failure_mode`
- `highest-risk_segment`
- `confidence_note`

### Expanded Pivot Types

- `pricing`
- `messaging`
- `icp`
- `trust`
- `workflow`
- `both`
- `none`

### Why

This makes the pivot logic feel more like strategy and less like generic post-processing.

---

## Phase 5 - Scoring Model Upgrade

### Objective

Replace the single blunt score with multiple clearer signals.

### Current Problem

A broad but potentially huge company idea can score weak because the current score mostly reflects immediate buyer readiness.

### New Score Outputs

1. `buyer_readiness_score`
   Measures likelihood of current buyers adopting the current pitch now.

2. `gtm_clarity_score`
   Measures how sharp and coherent the ICP, pricing, and messaging are.

3. `venture_upside_signal`
   Measures whether the opportunity appears strategically large if execution is strong.

### Why

This lets the product say:

- "High upside, weak current GTM"
- "Clear GTM, small upside"
- "Strong immediate signal"

instead of collapsing everything into one number.

---

## Phase 6 - Committee Mode

### Objective

Model realistic B2B buying dynamics more credibly.

### Recommendation

Do not add many more isolated personas.

Instead, add an optional **committee mode** for more complex markets.

### Committee Members

- `champion`
- `economic_buyer`
- `blocker`

### Best Use Cases

- mid-market
- enterprise-like procurement
- security-sensitive categories
- legal/compliance-heavy software

### Why

This is more realistic than simply increasing the persona count.

---

## Phase 7 - Conditional Third Round

### Objective

Add more depth only when the system has evidence that another round is worth it.

### Trigger Conditions

Run Round 3 only if:

- the score is borderline
- the supervisor thinks the market is promising but not yet convincing
- major blockers remain fixable
- procurement/trust objections are improving but not resolved

### Why

This keeps the product from feeling repetitive or artificially over-iterated.

---

## Phase 8 - UI / UX Changes

### Objective

Make the improved simulation visible and legible in the interface.

### Add to UI

- buyer cards with:
  - role
  - authority
  - budget posture
  - current stack
  - core constraints
- objection chips with category and severity
- blocker indicators
- round-to-round diff view
- "why the score moved" summary
- separate cards for readiness, clarity, and upside
- procurement/trust panel for harder segments

### UX Principle

The user should understand:

- what each buyer is optimizing for
- why the supervisor changed the strategy
- why the score moved up or down

---

## Recommended Build Order

Implement in this order:

1. Buyer schema
2. Structured objections
3. Domain evidence packs
4. Supervisor rewrite on structured signals
5. Multi-score model
6. Committee mode
7. Conditional third round
8. UI refresh for structured simulation outputs

---

## What Not To Do First

Do **not** start with:

- many more rounds
- many more personas without grounding
- live web research in the critical path
- overcomplicated agent orchestration before buyer realism improves

These would add noise faster than signal.

---

## Recommended Product Messaging

Use language like:

"ExecuSim simulates stage-based B2B buyers and pressures your pitch before you spend time on real discovery."

Avoid language like:

- "We know the market"
- "We predict startup success"
- "AI replaces customer interviews"

---

## Summary

The simulation should evolve from:

**prompted personas + one score**

to:

**grounded buyer models + structured objections + stronger supervisor + multiple clearer signals**

That will make the product:

- more believable
- more useful beyond demo value
- better at explaining why an idea is weak or promising
- better aligned with how real B2B buying actually works

