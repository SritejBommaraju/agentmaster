import { callMinimax } from "@/lib/minimax"

describe("callMinimax", () => {
  const originalEnv = process.env
  const originalFetch = global.fetch

  beforeEach(() => {
    jest.useFakeTimers()
    process.env = {
      ...originalEnv,
      MINIMAX_API_KEY: "test-key",
      MINIMAX_TIMEOUT_MS: "25",
    }
  })

  afterEach(() => {
    jest.useRealTimers()
    process.env = originalEnv
    global.fetch = originalFetch
  })

  it("times out stalled MiniMax requests", async () => {
    global.fetch = jest.fn((_: RequestInfo | URL, init?: RequestInit) => {
      return new Promise((_, reject) => {
        init?.signal?.addEventListener("abort", () => {
          const error = new Error("aborted")
          error.name = "AbortError"
          reject(error)
        })
      })
    }) as typeof fetch

    const pending = callMinimax([{ role: "user", content: "hello" }])

    jest.advanceTimersByTime(30)

    await expect(pending).rejects.toThrow("MiniMax request timed out after 25ms")
  })
})
