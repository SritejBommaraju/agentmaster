import { callMinimax, parseLLMJson } from "@/lib/minimax"
import { Strategy } from "@/lib/types"

const SYSTEM_PROMPT = `You are a startup strategist specializing in B2B SaaS.

Given an idea, output:
- icp: the specific business type, company size, and decision-maker role you are targeting
- pricing: recommended price point and model
- messaging: one-sentence value proposition written for a business buyer
- hypothesis: the core assumption that must be true for this business to work

Rules:
- Narrow broad ideas into a credible first wedge market before evaluation.
- Think in terms of org size, industry, buying committee roles, trust requirements, and implementation friction.
- Keep the output specific to B2B software buyers.
- Output JSON only.`

export async function runStrategyAgent(idea: string): Promise<Strategy> {
  const raw = await callMinimax([
    { role: "system", content: SYSTEM_PROMPT },
    { role: "user", content: `Idea: ${idea}` },
  ])

  const strategy = parseLLMJson<Strategy>(raw)

  if (!strategy.icp || !strategy.pricing || !strategy.messaging || !strategy.hypothesis) {
    throw new Error("Strategy agent returned incomplete output")
  }

  return strategy
}
