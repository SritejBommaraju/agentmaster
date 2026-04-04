import { runStrategyAgent } from "@/lib/agents/strategyAgent"
import * as minimax from "@/lib/minimax"

jest.mock("@/lib/minimax")

const mockCallMinimax = minimax.callMinimax as jest.MockedFunction<typeof minimax.callMinimax>
const mockParseLLMJson = minimax.parseLLMJson as jest.MockedFunction<typeof minimax.parseLLMJson>

const validStrategy = {
  icp: "Mid-market fintech compliance teams",
  pricing: "$500/mo per seat",
  messaging: "Automate audit trails without headcount",
  hypothesis: "Teams will pay to reduce manual compliance work by 80%",
}

describe("runStrategyAgent", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("returns a valid strategy object", async () => {
    mockCallMinimax.mockResolvedValue(JSON.stringify(validStrategy))
    mockParseLLMJson.mockReturnValue(validStrategy)

    const result = await runStrategyAgent("AI compliance tool for fintech")
    expect(result).toEqual(validStrategy)
  })

  it("calls MiniMax with the idea in the user message", async () => {
    mockCallMinimax.mockResolvedValue(JSON.stringify(validStrategy))
    mockParseLLMJson.mockReturnValue(validStrategy)

    await runStrategyAgent("My test idea")

    const calls = mockCallMinimax.mock.calls[0]
    const messages = calls[0]
    const userMessage = messages.find((m) => m.role === "user")
    expect(userMessage?.content).toContain("My test idea")
  })

  it("uses a system prompt about B2B SaaS strategy", async () => {
    mockCallMinimax.mockResolvedValue(JSON.stringify(validStrategy))
    mockParseLLMJson.mockReturnValue(validStrategy)

    await runStrategyAgent("Test idea")

    const messages = mockCallMinimax.mock.calls[0][0]
    const systemMessage = messages.find((m) => m.role === "system")
    expect(systemMessage?.content).toContain("B2B SaaS")
  })

  it("throws if strategy is missing required fields", async () => {
    const incomplete = { icp: "some ICP" } // missing pricing, messaging, hypothesis
    mockCallMinimax.mockResolvedValue(JSON.stringify(incomplete))
    mockParseLLMJson.mockReturnValue(incomplete)

    await expect(runStrategyAgent("test idea")).rejects.toThrow("incomplete")
  })

  it("throws if MiniMax call fails", async () => {
    mockCallMinimax.mockRejectedValue(new Error("API error"))

    await expect(runStrategyAgent("test idea")).rejects.toThrow("API error")
  })
})
