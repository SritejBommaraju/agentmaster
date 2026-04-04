import { callMinimax, parseLLMJson } from "@/lib/minimax"
import { PivotDecision, PersonaResponse, Strategy } from "@/lib/types"

const SYSTEM_PROMPT = `You are an AI executive advisor analyzing B2B market simulation data.

Given a business idea, the current go-to-market strategy, simulated responses from 3 buyer personas, and the current round number, decide whether the strategy needs to pivot.

Output a JSON object with:
- should_pivot: boolean — true if the strategy needs adjustment before another round; false to proceed to scoring
- pivot_type: one of "pricing" | "messaging" | "icp" | "both" | "none" (use "none" when should_pivot is false)
- pivot_rationale: 1–2 sentences explaining your decision — be specific about which signals drove it
- updated_strategy: the revised Strategy object with adjusted fields (return the unchanged strategy if should_pivot is false)

Decision rules:
- If round_number >= 2, always set should_pivot = false — max 3 rounds total, never exceed
- If at least 2 personas have likelihood >= 0.5, do NOT pivot — signals are already strong
- If average likelihood < 0.35 AND at least 2 personas share similar objection themes, pivot
- Focus pivot on the weakest signal: if pricing objections dominate use "pricing", if messaging is confused use "messaging", if wrong ICP use "icp", if both pricing and messaging need work use "both"
- When pivoting, make a concrete specific adjustment to the strategy — not generic advice

Output JSON only — no explanation, no markdown fences.`

export async function runSupervisorAgent(
  idea: string,
  strategy: Strategy,
  personas: PersonaResponse[],
  roundNumber: number
): Promise<PivotDecision> {
  const avgLikelihood = personas.reduce((sum, p) => sum + p.likelihood, 0) / personas.length

  const personaSummary = personas
    .map(
      (p) =>
        `- ${p.persona}: interest ${p.interest_score}/10, likelihood ${p.likelihood}, WTP ${p.willingness_to_pay}, objections: ${p.objections.join("; ")}`
    )
    .join("\n")

  const raw = await callMinimax([
    { role: "system", content: SYSTEM_PROMPT },
    {
      role: "user",
      content: `Idea: ${idea}

Current Strategy:
- ICP: ${strategy.icp}
- Pricing: ${strategy.pricing}
- Messaging: ${strategy.messaging}
- Hypothesis: ${strategy.hypothesis}

Round ${roundNumber} Persona Responses (avg likelihood: ${avgLikelihood.toFixed(2)}):
${personaSummary}

round_number: ${roundNumber}`,
    },
  ])

  const decision = parseLLMJson<PivotDecision>(raw)

  if (
    decision.should_pivot === undefined ||
    !decision.pivot_type ||
    !decision.pivot_rationale ||
    !decision.updated_strategy
  ) {
    throw new Error("Supervisor agent returned incomplete output")
  }

  // Enforce round cap — never pivot past round 2
  if (roundNumber >= 2) {
    decision.should_pivot = false
    decision.pivot_type = "none"
  }

  return decision
}
