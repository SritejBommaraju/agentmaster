import { parseLLMJson } from "@/lib/minimax"

describe("parseLLMJson", () => {
  it("parses plain JSON string", () => {
    const input = '{"key": "value"}'
    expect(parseLLMJson<{ key: string }>(input)).toEqual({ key: "value" })
  })

  it("strips markdown json code fence", () => {
    const input = "```json\n{\"key\": \"value\"}\n```"
    expect(parseLLMJson<{ key: string }>(input)).toEqual({ key: "value" })
  })

  it("strips plain code fence without language tag", () => {
    const input = "```\n{\"key\": \"value\"}\n```"
    expect(parseLLMJson<{ key: string }>(input)).toEqual({ key: "value" })
  })

  it("handles whitespace around JSON", () => {
    const input = "  \n  {\"key\": \"value\"}  \n  "
    expect(parseLLMJson<{ key: string }>(input)).toEqual({ key: "value" })
  })

  it("parses nested objects", () => {
    const input = JSON.stringify({ icp: "fintech", pricing: { model: "per-seat", amount: 500 } })
    const result = parseLLMJson<{ icp: string; pricing: { model: string; amount: number } }>(input)
    expect(result.pricing.model).toBe("per-seat")
  })

  it("throws on invalid JSON", () => {
    expect(() => parseLLMJson("not json at all")).toThrow()
  })

  it("extracts JSON when the model wraps it in extra text", () => {
    const input = 'Here is the result:\n{"key":"value"}\nDone.'
    expect(parseLLMJson<{ key: string }>(input)).toEqual({ key: "value" })
  })

  it("extracts JSON arrays when surrounded by extra text", () => {
    const input = 'Result:\n[{"key":"value"}]\nThanks.'
    expect(parseLLMJson<Array<{ key: string }>>(input)).toEqual([{ key: "value" }])
  })
})
