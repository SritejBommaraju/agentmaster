import { callMinimax, parseLLMJson } from "@/lib/minimax"
import { PivotDecision, PersonaResponse, Strategy } from "@/lib/types"

const SYSTEM_PROMPT = `You are an AI executive advisor analyzing B2B market simulation data.

Given a business idea, the current strategy, simulated responses from 3 buyer personas, and the current round number, decide whether the strategy needs to pivot.

Output a JSON object with:
- should_pivot: boolean
- pivot_type: one of "pricing" | "messaging" | "icp" | "both" | "none"
- pivot_rationale: 1-2 short sentences
- updated_strategy: object with icp, pricing, messaging, hypothesis

Rules:
- If round_number >= 2, set should_pivot to false
- If should_pivot is false, set pivot_type to "none"
- Keep pivot_rationale under 220 characters
- Use plain ASCII characters only
- Output strict JSON object only
- No markdown, no commentary, no trailing commas`

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

  const raw = await callMinimax(
    [
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
    ],
    { temperature: 0.2, max_tokens: 900 }
  )

  const decision = parseLLMJson<PivotDecision>(raw)

  if (
    decision.should_pivot === undefined ||
    !decision.pivot_type ||
    !decision.pivot_rationale ||
    !decision.updated_strategy
  ) {
    throw new Error("Supervisor agent returned incomplete output")
  }

  if (roundNumber >= 2) {
    decision.should_pivot = false
    decision.pivot_type = "none"
  }

  return decision
}
