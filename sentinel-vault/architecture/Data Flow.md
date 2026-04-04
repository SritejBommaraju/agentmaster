# Data Flow

## Step-by-Step Simulation Workflow

```
Step 1: User enters idea text
         ↓
Step 2: Strategy Agent called
        → outputs: ICP, pricing, messaging, hypothesis
         ↓
Step 3: Persona Generator instantiates 3 personas
        → skeptical_buyer, budget_buyer, early_adopter
         ↓
Step 4: Round 1 Simulation
        → each persona agent called with strategy + persona context
        → outputs per persona: interest_score, objections[], likelihood
         ↓
Step 5: Executive Supervisor analyzes Round 1
        → aggregates scores, finds weak spots
        → decides: pivot pricing / pivot messaging / no pivot
        → outputs: pivot_rationale, updated_strategy
         ↓
Step 6: Round 2 Simulation (with updated strategy)
        → same personas re-evaluated against new strategy
        → outputs updated interest_score, objections[], likelihood
         ↓
Step 7: Scoring Engine runs
        → applies persona weights
        → computes validation_score
         ↓
Step 8: Dashboard updated with all results
```

## Data Shapes Per Step

**After Step 2 — Strategy:**
```json
{
  "icp": "Mid-market compliance teams in fintech",
  "pricing": "$500/mo per seat",
  "messaging": "Automate audit trails without headcount",
  "hypothesis": "Teams will pay to reduce manual compliance work by 80%"
}
```

**After Step 4 — Persona Response:**
```json
{
  "persona": "skeptical_buyer",
  "interest_score": 4,
  "objections": ["unclear ROI", "vendor lock-in risk"],
  "likelihood": 0.3,
  "willingness_to_pay": "$200/mo"
}
```

**After Step 5 — Supervisor Decision:**
```json
{
  "should_pivot": true,
  "pivot_type": "pricing",
  "pivot_rationale": "Price point too high for skeptical buyers; lower to $299/mo with trial",
  "updated_strategy": { ...updated fields... }
}
```

**After Step 7 — Final Score:**
```json
{
  "validation_score": 72,
  "adoption_rate": 0.60,
  "avg_likelihood": 0.55,
  "pivot_count": 1,
  "persona_breakdown": {
    "skeptical_buyer": 0.45,
    "budget_buyer": 0.60,
    "early_adopter": 0.80
  }
}
```
