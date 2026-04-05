import type { Strategy } from "@/lib/types"

const mockInsertSelect = jest.fn()
const mockUpdateEq = jest.fn()
const mockCreateClient = jest.fn(() => ({
  database: {
    from: jest.fn(() => ({
      insert: jest.fn(() => ({
        select: mockInsertSelect,
      })),
      update: jest.fn(() => ({
        eq: mockUpdateEq,
      })),
    })),
  },
}))

const mockRunStrategyAgent = jest.fn()
const mockRunPersonaAgent = jest.fn()
const mockRunSupervisorAgent = jest.fn()
const mockComputeScore = jest.fn()

jest.mock("@insforge/sdk", () => ({
  createClient: (...args: unknown[]) => mockCreateClient(...args),
}))

jest.mock("@/lib/agents/strategyAgent", () => ({
  runStrategyAgent: (...args: unknown[]) => mockRunStrategyAgent(...args),
}))

jest.mock("@/lib/agents/personaAgent", () => ({
  runPersonaAgent: (...args: unknown[]) => mockRunPersonaAgent(...args),
}))

jest.mock("@/lib/agents/supervisorAgent", () => ({
  runSupervisorAgent: (...args: unknown[]) => mockRunSupervisorAgent(...args),
}))

jest.mock("@/lib/scoring", () => ({
  computeScore: (...args: unknown[]) => mockComputeScore(...args),
}))

const strategy: Strategy = {
  icp: "Mid-size legal teams",
  pricing: "$499/mo",
  messaging: "Reduce matter admin overhead",
  hypothesis: "Legal ops teams will pay for workflow automation",
}

describe("POST /api/simulate", () => {
  const originalEnv = process.env

  beforeEach(() => {
    jest.resetModules()
    jest.clearAllMocks()
    process.env = {
      ...originalEnv,
      NEXT_PUBLIC_INSFORGE_URL: "https://example.insforge.app",
      NEXT_PUBLIC_INSFORGE_ANON_KEY: "anon-key",
      INSFORGE_API_KEY: "server-key",
    }

    mockInsertSelect.mockResolvedValue({
      data: [{ id: "sim-123" }],
      error: null,
    })
    mockUpdateEq.mockResolvedValue({ data: null, error: null })
    mockRunStrategyAgent.mockResolvedValue(strategy)
    mockRunPersonaAgent.mockResolvedValue([])
    mockRunSupervisorAgent.mockResolvedValue({
      should_pivot: false,
      should_run_round_three: false,
      pivot_type: "none",
      reason: "No pivot needed",
      updated_strategy: strategy,
      at_risk_segment: "none",
    })
    mockComputeScore.mockReturnValue({
      validation_score: 82,
      adoption_rate: 61,
      buyer_readiness_score: 74,
      gtm_clarity_score: 77,
      venture_upside_signal: "medium",
      score_summary: "Promising early signal",
      failure_reason: null,
    })
  })

  afterAll(() => {
    process.env = originalEnv
  })

  it("prefers the server-side InsForge API key when present", async () => {
    const { POST } = await import("@/app/api/simulate/route")

    await POST(
      new Request("http://localhost/api/simulate", {
        method: "POST",
        body: JSON.stringify({ idea: "Lawyer OS that saves time" }),
      }) as never
    )

    expect(mockCreateClient).toHaveBeenCalledWith({
      baseUrl: "https://example.insforge.app",
      anonKey: "server-key",
    })
  })

  it("surfaces simulation update failures in the SSE stream", async () => {
    mockUpdateEq.mockResolvedValueOnce({
      data: null,
      error: { message: "new row violates row-level security policy" },
    })

    const { POST } = await import("@/app/api/simulate/route")
    const response = await POST(
      new Request("http://localhost/api/simulate", {
        method: "POST",
        body: JSON.stringify({ idea: "Lawyer OS that saves time" }),
      }) as never
    )

    const body = await response.text()

    expect(body).toContain("event: start")
    expect(body).toContain("event: error")
    expect(body).toContain("Failed to update simulation sim-123: new row violates row-level security policy")
  })
})
