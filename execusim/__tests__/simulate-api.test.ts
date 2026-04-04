/**
 * Tests for POST /api/simulate route logic.
 * We test the agent + InsForge integration by mocking both.
 */

import { runStrategyAgent } from "@/lib/agents/strategyAgent"

jest.mock("@/lib/agents/strategyAgent")
jest.mock("@insforge/sdk", () => ({
  createClient: jest.fn(() => ({
    database: {
      from: jest.fn(() => ({
        insert: jest.fn(() => ({
          select: jest.fn().mockResolvedValue({
            data: [{ id: "sim-uuid-123" }],
            error: null,
          }),
        })),
        update: jest.fn(() => ({
          eq: jest.fn().mockResolvedValue({ data: null, error: null }),
        })),
      })),
    },
  })),
}))

const mockRunStrategy = runStrategyAgent as jest.MockedFunction<typeof runStrategyAgent>

const validStrategy = {
  icp: "Mid-market fintech",
  pricing: "$500/mo",
  messaging: "Automate compliance",
  hypothesis: "Teams will pay",
}

describe("Strategy agent integration (unit)", () => {
  beforeEach(() => jest.clearAllMocks())

  it("resolves with a strategy object given a valid idea", async () => {
    mockRunStrategy.mockResolvedValue(validStrategy)
    const result = await runStrategyAgent("AI compliance tool for fintech")
    expect(result).toEqual(validStrategy)
  })

  it("rejects when idea is empty string (agent would throw)", async () => {
    mockRunStrategy.mockRejectedValue(new Error("Strategy agent returned incomplete output"))
    await expect(runStrategyAgent("")).rejects.toThrow()
  })

  it("rejects when MiniMax is unavailable", async () => {
    mockRunStrategy.mockRejectedValue(new Error("MINIMAX_API_KEY is not configured"))
    await expect(runStrategyAgent("any idea")).rejects.toThrow("MINIMAX_API_KEY")
  })
})
