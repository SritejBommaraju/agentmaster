import { callMinimax, parseLLMJson } from "@/lib/minimax"
import { PersonaResponse, Strategy } from "@/lib/types"

const SYSTEM_PROMPT = `You are a synthetic market research system that simulates B2B buyer reactions.

Given a business idea and its go-to-market strategy, generate responses from 3 synthetic business buyers at different company stages.

Output a JSON array of exactly 3 objects in this order:
1. stage_early — early-stage founder (1–20 people, needs it to work today, free trial mentality, budget-constrained)
2. stage_growth — growth-stage ops/VP (20–150 people, needs ROI justification and stack integration)
3. stage_mid_market — mid-market director (150–500 people, procurement process, SOC 2, legal review, buying committee)

Each object must have:
- persona: one of "stage_early", "stage_growth", "stage_mid_market"
- interest_score: integer 0–10 (how interested this buyer is in the idea)
- objections: array of 2–4 specific, realistic objections this buyer type would raise
- likelihood: float 0–1 (probability they would purchase or adopt)
- willingness_to_pay: string describing price they would accept (e.g., "$50/month per seat")

Be realistic. Mid-market has more friction and compliance requirements. Early-stage buyers are agile but cash-constrained. Output JSON array only — no explanation, no markdown fences.`

export async function runPersonaAgent(
  idea: string,
  strategy: Strategy
): Promise<PersonaResponse[]> {
  const raw = await callMinimax([
    { role: "system", content: SYSTEM_PROMPT },
    {
      role: "user",
      content: `Idea: ${idea}\n\nStrategy:\n- ICP: ${strategy.icp}\n- Pricing: ${strategy.pricing}\n- Messaging: ${strategy.messaging}\n- Hypothesis: ${strategy.hypothesis}`,
    },
  ])

  const personas = parseLLMJson<PersonaResponse[]>(raw)

  if (!Array.isArray(personas) || personas.length !== 3) {
    throw new Error("Persona agent returned unexpected output — expected 3 personas")
  }

  for (const p of personas) {
    if (
      !p.persona ||
      p.interest_score == null ||
      !Array.isArray(p.objections) ||
      p.likelihood == null ||
      !p.willingness_to_pay
    ) {
      throw new Error("Persona agent returned incomplete persona data")
    }
  }

  return personas
}
