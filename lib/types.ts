export interface Strategy {
  icp: string
  pricing: string
  messaging: string
  hypothesis: string
}

export type PersonaStage = "stage_early" | "stage_growth" | "stage_mid_market"
export type DecisionAuthority = "owner" | "influencer" | "approver" | "committee"
export type BudgetTolerance = "tight" | "managed" | "flexible"
export type LanguageStyle = "direct" | "analytical" | "procurement"
export type TrustLevel = "low" | "medium" | "high"
export type ObjectionCategory =
  | "roi"
  | "workflow"
  | "integration"
  | "trust"
  | "security"
  | "procurement"
  | "pricing"
  | "change_management"
export type ObjectionSeverity = "low" | "medium" | "high"
export type PivotType = "pricing" | "messaging" | "icp" | "trust" | "workflow" | "both" | "none"
export type SimulationStatus = "pending" | "running" | "complete" | "failed"

export interface BuyerProfile {
  stage: PersonaStage
  company_size: string
  role: string
  decision_authority: DecisionAuthority
  budget_tolerance: BudgetTolerance
  current_stack: string[]
  procurement_friction: string
  success_metrics: string[]
  switching_resistance: string
  trust_requirements: string[]
  buying_triggers: string[]
  top_risks: string[]
  language_style: LanguageStyle
}

export interface StructuredObjection {
  text: string
  category: ObjectionCategory
  severity: ObjectionSeverity
  blocking: boolean
}

export interface PersonaResponse {
  persona: PersonaStage
  buyer_profile: BuyerProfile
  evaluation_summary: string
  interest_score: number
  objections: StructuredObjection[]
  likelihood: number
  willingness_to_pay: string
  trust_signal: TrustLevel
  procurement_intensity: TrustLevel
}

export interface SupervisorSignals {
  buyer_stage_breakdown: Array<{
    persona: PersonaStage
    likelihood: number
    trust_signal: TrustLevel
    procurement_intensity: TrustLevel
    blocking_objections: number
  }>
  objection_categories: Partial<Record<ObjectionCategory, number>>
  severity_distribution: Partial<Record<ObjectionSeverity, number>>
  blocking_objection_count: number
  average_likelihood: number
  lowest_likelihood_segment: PersonaStage
  willingness_to_pay_shift: string
  trust_intensity: TrustLevel
  procurement_intensity: TrustLevel
}

export interface PivotDecision {
  should_pivot: boolean
  pivot_type: PivotType
  pivot_rationale: string
  updated_strategy: Strategy
  primary_failure_mode: string
  highest_risk_segment: PersonaStage
  confidence_note: string
  should_run_round_three?: boolean
}

export interface ScoreResult {
  validation_score: number
  adoption_rate: number
  buyer_readiness_score: number
  gtm_clarity_score: number
  venture_upside_signal: number
  failure_reason: string | null
  score_summary: string
}

export interface Simulation {
  id: string
  idea: string
  status: SimulationStatus
  strategy: Strategy | null
  round1: PersonaResponse[] | null
  pivot: PivotDecision | null
  round2: PersonaResponse[] | null
  pivot2: PivotDecision | null
  round3: PersonaResponse[] | null
  validation_score: number | null
  adoption_rate: number | null
  buyer_readiness_score: number | null
  gtm_clarity_score: number | null
  venture_upside_signal: number | null
  score_summary: string | null
  rounds_completed: number
  failure_reason: string | null
  created_at: string
  updated_at: string
}

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
  buyer_readiness_score: number
  gtm_clarity_score: number
  venture_upside_signal: number
  score_summary: string
  failure_reason: string | null
  error?: string
}
