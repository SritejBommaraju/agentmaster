import { callMinimax, parseLLMJson } from "@/lib/minimax"
import { summarizeSignals } from "@/lib/scoring"
import { PivotDecision, PersonaResponse, Strategy } from "@/lib/types"

const SYSTEM_PROMPT = `You are an executive supervisor for B2B idea simulations.

You consume structured buyer signals, not just prose. Your job is to decide whether the strategy should pivot, what kind of pivot is needed, and whether a third round is justified.

Output a JSON object with:
- should_pivot
- pivot_type: one of "pricing" | "messaging" | "icp" | "trust" | "workflow" | "both" | "none"
- pivot_rationale
- updated_strategy: object with icp, pricing, messaging, hypothesis
- primary_failure_mode
- highest_risk_segment
- confidence_note
- should_run_round_three

Rules:
- Round 1 can pivot if needed.
- Round 2 should usually stop unless the signal is borderline and blockers look fixable.
- Only set should_run_round_three to true when the current market signal is promising but unresolved.
- If should_pivot is false, set pivot_type to "none" and keep updated_strategy aligned to the current strategy.
- Keep pivot_rationale under 240 characters.
- Use plain ASCII only.
- Output strict JSON only.`

export async function runSupervisorAgent(
  idea: string,
  strategy: Strategy,
  personas: PersonaResponse[],
  roundNumber: number,
  previousRound?: PersonaResponse[]
): Promise<PivotDecision> {
  const signals = summarizeSignals(personas, previousRound)

  const personaSummary = personas
    .map((persona) => {
      const blocking = persona.objections.filter((objection) => objection.blocking).length
      const objections = persona.objections
        .map((objection) => `${objection.category}/${objection.severity}/${objection.blocking ? "blocker" : "nonblocker"}: ${objection.text}`)
        .join("; ")
      return `- ${persona.persona}: role ${persona.buyer_profile.role}, likelihood ${persona.likelihood}, WTP ${persona.willingness_to_pay}, blockers ${blocking}, trust ${persona.trust_signal}, procurement ${persona.procurement_intensity}, objections: ${objections}`
    })
    .join("\n")

  const raw = await callMinimax(
    [
      { role: "system", content: SYSTEM_PROMPT },
      {
        role: "user",
        content: `Idea: ${idea}

Current strategy:
- ICP: ${strategy.icp}
- Pricing: ${strategy.pricing}
- Messaging: ${strategy.messaging}
- Hypothesis: ${strategy.hypothesis}

Round number: ${roundNumber}

Structured signals:
${JSON.stringify(signals)}

Buyer summaries:
${personaSummary}`,
      },
    ],
    { temperature: 0.2, max_tokens: 1200 }
  )

  const decision = parseLLMJson<PivotDecision>(raw)

  if (
    decision.should_pivot === undefined ||
    !decision.pivot_type ||
    !decision.pivot_rationale ||
    !decision.updated_strategy ||
    !decision.primary_failure_mode ||
    !decision.highest_risk_segment ||
    !decision.confidence_note
  ) {
    throw new Error("Supervisor agent returned incomplete output")
  }

  if (!decision.should_pivot) {
    decision.pivot_type = "none"
    decision.updated_strategy = strategy
    decision.should_run_round_three = false
  }

  if (roundNumber === 1 && decision.should_run_round_three) {
    decision.should_run_round_three = false
  }

  return decision
}

