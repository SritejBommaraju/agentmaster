import { selectEvidencePack } from "@/lib/evidence-packs"
import { callMinimax, parseLLMJson } from "@/lib/minimax"
import {
  BuyerProfile,
  DecisionAuthority,
  BudgetTolerance,
  LanguageStyle,
  ObjectionCategory,
  ObjectionSeverity,
  PersonaResponse,
  PersonaStage,
  Strategy,
  StructuredObjection,
  TrustLevel,
} from "@/lib/types"

const PROFILE_GENERATOR_PROMPT = `You generate realistic B2B buyer profiles for simulation.

Output a JSON array of exactly 3 buyer_profile objects in this order:
1. stage_early
2. stage_growth
3. stage_mid_market

Each buyer_profile must include:
- stage
- company_size
- role
- decision_authority
- budget_tolerance
- current_stack: string[]
- procurement_friction
- success_metrics: string[]
- switching_resistance
- trust_requirements: string[]
- buying_triggers: string[]
- top_risks: string[]
- language_style

Rules:
- Keep scalar strings under 8 words.
- Keep array items under 5 words each.
- Use 2-4 items per array.
- decision_authority must be one of: owner, influencer, approver, committee
- budget_tolerance must be one of: tight, managed, flexible
- language_style must be one of: direct, analytical, procurement
- Reflect actual B2B buying behavior, not generic personas.
- Use plain ASCII only.
- Output strict JSON only.`

const BUYER_EVALUATOR_PROMPT = `You evaluate a strategy as specific B2B buyers.

Output a JSON array of exactly 3 persona responses matching the provided buyer profiles in the same order.

Each object must include:
- persona
- buyer_profile
- evaluation_summary
- interest_score: integer 0-10
- objections: array of 2-4 objects with text, category, severity, blocking
- likelihood: float 0-1
- willingness_to_pay
- trust_signal
- procurement_intensity

Allowed objection categories:
roi, workflow, integration, trust, security, procurement, pricing, change_management

Allowed severity:
low, medium, high

Allowed trust_signal and procurement_intensity:
low, medium, high

Rules:
- Use the evidence pack to ground wording and concerns.
- Keep objection text under 18 words.
- Keep evaluation_summary under 18 words.
- Make at least one objection blocking when likelihood < 0.5.
- Keep willingness_to_pay under 14 words.
- Use plain ASCII only.
- Output strict JSON only.`

const VALID_STAGES: PersonaStage[] = ["stage_early", "stage_growth", "stage_mid_market"]
const VALID_CATEGORIES: ObjectionCategory[] = [
  "roi",
  "workflow",
  "integration",
  "trust",
  "security",
  "procurement",
  "pricing",
  "change_management",
]
const VALID_SEVERITIES: ObjectionSeverity[] = ["low", "medium", "high"]
const VALID_SIGNALS: TrustLevel[] = ["low", "medium", "high"]
const VALID_AUTHORITIES: DecisionAuthority[] = ["owner", "influencer", "approver", "committee"]
const VALID_BUDGETS: BudgetTolerance[] = ["tight", "managed", "flexible"]
const VALID_LANGUAGE_STYLES: LanguageStyle[] = ["direct", "analytical", "procurement"]

function asNonEmptyString(value: unknown, fallback: string): string {
  return typeof value === "string" && value.trim() ? value.trim() : fallback
}

function asStringArray(value: unknown, fallback: string[]): string[] {
  if (!Array.isArray(value)) return fallback
  const normalized = value
    .map((item) => (typeof item === "string" ? item.trim() : ""))
    .filter(Boolean)
  return normalized.length ? normalized : fallback
}

function asEnumValue<T extends string>(value: unknown, allowed: T[], fallback: T): T {
  return typeof value === "string" && allowed.includes(value as T) ? (value as T) : fallback
}

function normalizeBuyerProfile(raw: unknown, expectedStage: PersonaStage): BuyerProfile {
  const profile = (raw ?? {}) as Partial<BuyerProfile>

  return {
    stage: expectedStage,
    company_size: asNonEmptyString(profile.company_size, expectedStage === "stage_early" ? "1-20 employees" : expectedStage === "stage_growth" ? "20-150 employees" : "150-500 employees"),
    role: asNonEmptyString(profile.role, expectedStage === "stage_early" ? "Founder" : expectedStage === "stage_growth" ? "Operations lead" : "Department director"),
    decision_authority: asEnumValue(profile.decision_authority, VALID_AUTHORITIES, expectedStage === "stage_early" ? "owner" : expectedStage === "stage_growth" ? "approver" : "committee"),
    budget_tolerance: asEnumValue(profile.budget_tolerance, VALID_BUDGETS, expectedStage === "stage_early" ? "tight" : expectedStage === "stage_growth" ? "managed" : "flexible"),
    current_stack: asStringArray(profile.current_stack, ["Slack", "Spreadsheet workflow"]),
    procurement_friction: asNonEmptyString(profile.procurement_friction, "Needs a clear internal case before adopting a new tool."),
    success_metrics: asStringArray(profile.success_metrics, ["time saved", "workflow reliability"]),
    switching_resistance: asNonEmptyString(profile.switching_resistance, "Will resist change if migration risk feels high."),
    trust_requirements: asStringArray(profile.trust_requirements, ["clear security posture"]),
    buying_triggers: asStringArray(profile.buying_triggers, ["manual process pain"]),
    top_risks: asStringArray(profile.top_risks, ["implementation risk"]),
    language_style: asEnumValue(profile.language_style, VALID_LANGUAGE_STYLES, expectedStage === "stage_mid_market" ? "procurement" : expectedStage === "stage_growth" ? "analytical" : "direct"),
  }
}

function normalizeObjection(raw: unknown, likelihood: number): StructuredObjection | null {
  const objection = (raw ?? {}) as Partial<StructuredObjection> & { blocker?: boolean }
  const text = asNonEmptyString(objection.text, "")
  if (!text) return null

  return {
    text,
    category: asEnumValue(objection.category, VALID_CATEGORIES, "workflow"),
    severity: asEnumValue(objection.severity, VALID_SEVERITIES, likelihood < 0.5 ? "high" : "medium"),
    blocking: typeof objection.blocking === "boolean" ? objection.blocking : typeof objection.blocker === "boolean" ? objection.blocker : likelihood < 0.5,
  }
}

function normalizePersona(
  raw: unknown,
  expectedStage: PersonaStage,
  fallbackProfile: BuyerProfile
): PersonaResponse {
  const persona = (raw ?? {}) as Partial<PersonaResponse> & { objections?: unknown[] }
  const likelihood =
    typeof persona.likelihood === "number"
      ? Math.min(1, Math.max(0, persona.likelihood))
      : 0.35

  const objections = Array.isArray(persona.objections)
    ? persona.objections
        .map((objection) => normalizeObjection(objection, likelihood))
        .filter((objection): objection is StructuredObjection => Boolean(objection))
    : []

  const fallbackObjections: StructuredObjection[] = [
    {
      text: "The offer still needs clearer proof and implementation detail.",
      category: "workflow",
      severity: likelihood < 0.5 ? "high" : "medium",
      blocking: likelihood < 0.5,
    },
  ]

  const normalizedObjections: StructuredObjection[] =
    objections.length > 0
      ? objections
      : fallbackObjections

  return {
    persona: expectedStage,
    buyer_profile: normalizeBuyerProfile(persona.buyer_profile ?? fallbackProfile, expectedStage),
    evaluation_summary: asNonEmptyString(
      persona.evaluation_summary,
      "The buyer sees some value but still has unresolved adoption concerns."
    ),
    interest_score:
      typeof persona.interest_score === "number"
        ? Math.min(10, Math.max(0, Math.round(persona.interest_score)))
        : Math.max(1, Math.min(10, Math.round(likelihood * 10))),
    objections: normalizedObjections,
    likelihood,
    willingness_to_pay: asNonEmptyString(persona.willingness_to_pay, "Pilot budget after proof"),
    trust_signal: asEnumValue(persona.trust_signal, VALID_SIGNALS, likelihood >= 0.55 ? "medium" : "low"),
    procurement_intensity: asEnumValue(
      persona.procurement_intensity,
      VALID_SIGNALS,
      expectedStage === "stage_mid_market" ? "high" : expectedStage === "stage_growth" ? "medium" : "low"
    ),
  }
}

async function runBuyerProfileGenerator(idea: string, strategy: Strategy): Promise<BuyerProfile[]> {
  const evidencePack = selectEvidencePack(idea, strategy)
  const raw = await callMinimax(
    [
      { role: "system", content: PROFILE_GENERATOR_PROMPT },
      {
        role: "user",
        content: `Idea: ${idea}

Strategy:
- ICP: ${strategy.icp}
- Pricing: ${strategy.pricing}
- Messaging: ${strategy.messaging}
- Hypothesis: ${strategy.hypothesis}

Evidence pack: ${evidencePack.domain}
- Buyer language: ${evidencePack.buyer_language_examples.join(" | ")}
- Common objections: ${evidencePack.common_objections.map((item) => `${item.category}: ${item.text}`).join(" | ")}
- Procurement expectations: ${evidencePack.procurement_expectations.join(" | ")}
- Typical budgets: ${Object.entries(evidencePack.typical_budgets)
            .map(([stage, budget]) => `${stage}: ${budget}`)
            .join(" | ")}
- Required integrations: ${evidencePack.required_integrations.join(" | ")}
- Trust expectations: ${evidencePack.trust_expectations.join(" | ")}
- Adoption blockers: ${evidencePack.adoption_blockers.join(" | ")}`,
      },
    ],
    { temperature: 0.2, max_tokens: 3200 }
  )

  const profiles = parseLLMJson<unknown[]>(raw)

  if (!Array.isArray(profiles) || profiles.length !== 3) {
    throw new Error("Buyer profile generator returned unexpected output")
  }

  return VALID_STAGES.map((stage, index) => normalizeBuyerProfile(profiles[index], stage))
}

export async function runPersonaAgent(idea: string, strategy: Strategy): Promise<PersonaResponse[]> {
  const evidencePack = selectEvidencePack(idea, strategy)
  const buyerProfiles = await runBuyerProfileGenerator(idea, strategy)

  const raw = await callMinimax(
    [
      { role: "system", content: BUYER_EVALUATOR_PROMPT },
      {
        role: "user",
        content: `Idea: ${idea}

Strategy:
- ICP: ${strategy.icp}
- Pricing: ${strategy.pricing}
- Messaging: ${strategy.messaging}
- Hypothesis: ${strategy.hypothesis}

Evidence pack: ${evidencePack.domain}
- Buyer language: ${evidencePack.buyer_language_examples.join(" | ")}
- ROI language: ${evidencePack.expected_roi_language.join(" | ")}
- Procurement expectations: ${evidencePack.procurement_expectations.join(" | ")}
- Typical budgets: ${Object.entries(evidencePack.typical_budgets)
            .map(([stage, budget]) => `${stage}: ${budget}`)
            .join(" | ")}
- Required integrations: ${evidencePack.required_integrations.join(" | ")}
- Trust expectations: ${evidencePack.trust_expectations.join(" | ")}
- Adoption blockers: ${evidencePack.adoption_blockers.join(" | ")}

Buyer profiles:
${JSON.stringify(buyerProfiles)}`,
      },
    ],
    { temperature: 0.2, max_tokens: 2800 }
  )

  const parsed = parseLLMJson<unknown[]>(raw)

  if (!Array.isArray(parsed) || parsed.length !== 3) {
    throw new Error("Persona agent returned unexpected output - expected 3 buyers")
  }

  return VALID_STAGES.map((stage, index) => normalizePersona(parsed[index], stage, buyerProfiles[index]))
}
