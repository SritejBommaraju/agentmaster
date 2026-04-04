import { PersonaResponse, PersonaStage, ScoreResult, SupervisorSignals } from "@/lib/types"

const WEIGHTS: Record<PersonaStage, number> = {
  stage_early: 1.0,
  stage_growth: 1.2,
  stage_mid_market: 1.5,
}

const LOW_LIKELIHOOD_THRESHOLD = 0.45

function average(values: number[]): number {
  return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0
}

function clamp(value: number): number {
  return Math.min(1, Math.max(0, value))
}

function trustScore(level: "low" | "medium" | "high"): number {
  if (level === "high") return 1
  if (level === "medium") return 0.6
  return 0.25
}

export function summarizeSignals(personas: PersonaResponse[], previousRound?: PersonaResponse[]): SupervisorSignals {
  const totalWeight = personas.reduce((sum, persona) => sum + WEIGHTS[persona.persona], 0)

  const objectionCategories: SupervisorSignals["objection_categories"] = {}
  const severityDistribution: SupervisorSignals["severity_distribution"] = {}
  let blockingObjectionCount = 0

  for (const persona of personas) {
    for (const objection of persona.objections) {
      objectionCategories[objection.category] = (objectionCategories[objection.category] ?? 0) + 1
      severityDistribution[objection.severity] = (severityDistribution[objection.severity] ?? 0) + 1
      if (objection.blocking) blockingObjectionCount += 1
    }
  }

  const weightedLikelihood =
    personas.reduce((sum, persona) => sum + persona.likelihood * WEIGHTS[persona.persona], 0) / totalWeight

  const previousWtp = previousRound?.map((persona) => persona.willingness_to_pay).join(" | ")
  const currentWtp = personas.map((persona) => persona.willingness_to_pay).join(" | ")

  const stageBreakdown = personas.map((persona) => ({
    persona: persona.persona,
    likelihood: persona.likelihood,
    trust_signal: persona.trust_signal,
    procurement_intensity: persona.procurement_intensity,
    blocking_objections: persona.objections.filter((objection) => objection.blocking).length,
  }))

  const lowSegment = [...personas].sort((a, b) => a.likelihood - b.likelihood)[0]
  const trustIntensity = average(personas.map((persona) => trustScore(persona.trust_signal)))
  const procurementIntensity = average(personas.map((persona) => trustScore(persona.procurement_intensity)))

  return {
    buyer_stage_breakdown: stageBreakdown,
    objection_categories: objectionCategories,
    severity_distribution: severityDistribution,
    blocking_objection_count: blockingObjectionCount,
    average_likelihood: weightedLikelihood,
    lowest_likelihood_segment: lowSegment.persona,
    willingness_to_pay_shift: previousWtp
      ? `Previous: ${previousWtp}. Current: ${currentWtp}.`
      : `Current willingness to pay: ${currentWtp}.`,
    trust_intensity: trustIntensity >= 0.75 ? "high" : trustIntensity >= 0.45 ? "medium" : "low",
    procurement_intensity:
      procurementIntensity >= 0.75 ? "high" : procurementIntensity >= 0.45 ? "medium" : "low",
  }
}

export function computeScore(personas: PersonaResponse[], previousRound?: PersonaResponse[]): ScoreResult {
  const totalWeight = personas.reduce((sum, persona) => sum + WEIGHTS[persona.persona], 0)

  const weightedLikelihood =
    personas.reduce((sum, persona) => sum + persona.likelihood * WEIGHTS[persona.persona], 0) / totalWeight

  const weightedAdopters = personas
    .filter((persona) => persona.likelihood >= 0.5)
    .reduce((sum, persona) => sum + WEIGHTS[persona.persona], 0)

  const adoption_rate = weightedAdopters / totalWeight

  const blockingRatio =
    personas.flatMap((persona) => persona.objections).filter((objection) => objection.blocking).length /
    Math.max(1, personas.flatMap((persona) => persona.objections).length)

  const avgInterest = average(personas.map((persona) => persona.interest_score / 10))
  const avgTrust = average(personas.map((persona) => trustScore(persona.trust_signal)))
  const avgProcurement = average(personas.map((persona) => 1 - trustScore(persona.procurement_intensity)))
  const lowLikelihoodPenalty =
    personas.filter((persona) => persona.likelihood < LOW_LIKELIHOOD_THRESHOLD).length / personas.length
  const clarityMomentum = previousRound
    ? average(
        personas.map((persona) => {
          const previous = previousRound.find((candidate) => candidate.persona === persona.persona)
          return previous ? Math.max(0, persona.likelihood - previous.likelihood) : 0
        })
      )
    : 0

  const buyer_readiness_score = clamp(weightedLikelihood * 0.55 + adoption_rate * 0.25 + avgTrust * 0.2)
  const gtm_clarity_score = clamp(avgInterest * 0.32 + (1 - blockingRatio) * 0.34 + clarityMomentum * 0.34)
  const venture_upside_signal = clamp(
    avgInterest * 0.35 + avgTrust * 0.25 + avgProcurement * 0.2 + (1 - lowLikelihoodPenalty) * 0.2
  )

  const validation_score = buyer_readiness_score
  let failure_reason: string | null = null

  if (buyer_readiness_score < 0.5) {
    const topObjections = personas
      .flatMap((persona) => persona.objections)
      .sort((left, right) => Number(right.blocking) - Number(left.blocking))
      .slice(0, 3)
      .map((objection) => `${objection.category}: ${objection.text}`)
    failure_reason =
      `Current buyer readiness is weak (${Math.round(buyer_readiness_score * 100)}%). ` +
      `Top blockers: ${topObjections.join("; ")}.`
  }

  const score_summary =
    `Readiness ${Math.round(buyer_readiness_score * 100)}%, ` +
    `GTM clarity ${Math.round(gtm_clarity_score * 100)}%, ` +
    `Upside ${Math.round(venture_upside_signal * 100)}%.`

  return {
    validation_score,
    adoption_rate,
    buyer_readiness_score,
    gtm_clarity_score,
    venture_upside_signal,
    failure_reason,
    score_summary,
  }
}

