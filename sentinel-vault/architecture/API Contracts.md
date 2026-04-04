# API Contracts

## POST /simulate

Kicks off a full simulation run. Orchestrator runs all agents sequentially.

**Request:**
```json
{
  "idea": "AI compliance automation tool for fintech"
}
```

**Response:**
```json
{
  "simulation_id": "uuid",
  "strategy": {
    "icp": "...",
    "pricing": "...",
    "messaging": "...",
    "hypothesis": "..."
  },
  "round1": [...persona responses...],
  "pivot": {
    "should_pivot": true,
    "pivot_type": "pricing",
    "pivot_rationale": "...",
    "updated_strategy": {...}
  },
  "round2": [...persona responses...],
  "validation_score": 72,
  "adoption_rate": 0.60
}
```

## GET /simulation/:id

Returns full state of a completed simulation.

## POST /simulate/stream (stretch)

Streams agent outputs as server-sent events for real-time panel updates.

**Events emitted:**
```
event: strategy
data: { icp, pricing, messaging, hypothesis }

event: persona_response
data: { persona, round, interest_score, objections, likelihood }

event: pivot
data: { should_pivot, pivot_type, pivot_rationale }

event: score
data: { validation_score, adoption_rate }
```

## Internal Agent Calls (orchestrator-to-LLM)

All agents use MiniMax API. Calls are sequential:

1. `strategyAgent(idea)` → strategy object
2. `personaAgent(persona, strategy)` × 3 → response[]  (Round 1)
3. `supervisorAgent(strategy, responses)` → pivot object
4. `personaAgent(persona, updated_strategy)` × 3 → response[] (Round 2)
5. `scoreEngine(round2_responses)` → validation_score
