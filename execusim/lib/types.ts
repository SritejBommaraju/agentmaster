// ─── Strategy ────────────────────────────────────────────────────────────────

export interface Strategy {
  icp: string
  pricing: string
  messaging: string
  hypothesis: string
}

// ─── Persona Response ─────────────────────────────────────────────────────────

export type PersonaStage = "stage_early" | "stage_growth" | "stage_mid_market"

export interface PersonaResponse {
  persona: PersonaStage
  interest_score: number       // 0–10
  objections: string[]
  likelihood: number           // 0–1
  willingness_to_pay: string
}

// ─── Pivot ───────────────────────────────────────────────────────────────────

export type PivotType = "pricing" | "messaging" | "icp" | "both" | "none"

export interface PivotDecision {
  should_pivot: boolean
  pivot_type: PivotType
  pivot_rationale: string
  updated_strategy: Strategy
}

// ─── Simulation ──────────────────────────────────────────────────────────────

export type SimulationStatus = "pending" | "running" | "complete" | "failed"

export interface Simulation {
  id: string
  idea: string
  status: SimulationStatus
  strategy: Strategy | null
  round1: PersonaResponse[] | null
  pivot: PivotDecision | null
  round2: PersonaResponse[] | null
  round3: PersonaResponse[] | null
  validation_score: number | null
  adoption_rate: number | null
  rounds_completed: number
  failure_reason: string | null
  created_at: string
  updated_at: string
}

// ─── API Response ─────────────────────────────────────────────────────────────

export interface SimulateResponse {
  simulation_id: string
  strategy: Strategy
  round1: PersonaResponse[]
  pivot: PivotDecision | null
  round2: PersonaResponse[] | null
  pivot2: PivotDecision | null
  round3: PersonaResponse[] | null
  rounds_completed: number
  validation_score: number
  adoption_rate: number
  failure_reason: string | null
  error?: string
}
