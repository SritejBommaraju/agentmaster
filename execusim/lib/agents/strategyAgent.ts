import { callMinimax, parseLLMJson } from "@/lib/minimax"
import { Strategy } from "@/lib/types"

const SYSTEM_PROMPT = `You are a startup strategist specializing in B2B SaaS.

Given an idea, output:
- icp: the specific business type, company size, and decision-maker role you are targeting
- pricing: recommended price point and model (per seat, per usage, flat license, etc.)
- messaging: one-sentence value proposition written for a business buyer, not a consumer
- hypothesis: the core assumption that must be true for this business to work

Be specific. Think in terms of org size, industry, and buying committee roles. Output JSON only — no explanation, no markdown, just the raw JSON object.`

export async function runStrategyAgent(idea: string): Promise<Strategy> {
  const raw = await callMinimax([
    { role: "system", content: SYSTEM_PROMPT },
    { role: "user", content: `Idea: ${idea}` },
  ])

  const strategy = parseLLMJson<Strategy>(raw)

  // Validate required fields
  if (!strategy.icp || !strategy.pricing || !strategy.messaging || !strategy.hypothesis) {
    throw new Error("Strategy agent returned incomplete output")
  }

  return strategy
}
