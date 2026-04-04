import { PersonaResponse, PersonaStage } from "@/lib/types"

const WEIGHTS: Record<PersonaStage, number> = {
  stage_early: 1.0,
  stage_growth: 1.2,
  stage_mid_market: 1.5,
}

export interface ScoreResult {
  validation_score: number  // 0–1
  adoption_rate: number     // 0–1
  failure_reason: string | null
}

/** Compute weighted validation score from the final round of personas.
 *  Formula: avg(likelihood) * 0.6 + adoption_rate * 0.4
 *  Weights:  mid-market 1.5x | growth 1.2x | early 1.0x
 */
export function computeScore(personas: PersonaResponse[]): ScoreResult {
  const totalWeight = personas.reduce((sum, p) => sum + WEIGHTS[p.persona], 0)

  const weightedLikelihood =
    personas.reduce((sum, p) => sum + p.likelihood * WEIGHTS[p.persona], 0) / totalWeight

  const weightedAdopters = personas
    .filter((p) => p.likelihood >= 0.5)
    .reduce((sum, p) => sum + WEIGHTS[p.persona], 0)
  const adoption_rate = weightedAdopters / totalWeight

  const validation_score = weightedLikelihood * 0.6 + adoption_rate * 0.4

  let failure_reason: string | null = null
  if (validation_score < 0.5) {
    // Collect top objections from the final round as the failure summary
    const allObjections = personas.flatMap((p) => p.objections)
    const top = allObjections.slice(0, 3)
    failure_reason =
      `Idea did not reach the validation threshold (${(validation_score * 100).toFixed(0)}%). ` +
      `Top objections: ${top.join("; ")}.`
  }

  return { validation_score, adoption_rate, failure_reason }
}
