const MINIMAX_API_URL = "https://api.minimax.io/v1/text/chatcompletion_v2"
const MINIMAX_MODEL = "MiniMax-M2.5"

export interface MinimaxMessage {
  role: "system" | "user" | "assistant"
  content: string
}

export interface MinimaxOptions {
  temperature?: number
  max_tokens?: number
}

export async function callMinimax(
  messages: MinimaxMessage[],
  options: MinimaxOptions = {}
): Promise<string> {
  const apiKey = process.env.MINIMAX_API_KEY
  if (!apiKey || apiKey === "your_minimax_api_key_here") {
    throw new Error("MINIMAX_API_KEY is not configured. Set it in .env.local")
  }

  const res = await fetch(MINIMAX_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MINIMAX_MODEL,
      messages,
      temperature: options.temperature ?? 0.7,
      max_tokens: options.max_tokens ?? 1000,
    }),
  })

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`MiniMax API error ${res.status}: ${body}`)
  }

  const json = await res.json()
  const content =
    json?.choices?.[0]?.message?.content ??
    json?.reply ??
    json?.output?.text ??
    json?.data?.text

  if (!content) {
    const statusCode = json?.base_resp?.status_code
    const statusMsg = json?.base_resp?.status_msg
    const diagnostic =
      statusCode || statusMsg
        ? `MiniMax returned no content (status ${statusCode ?? "unknown"}: ${statusMsg ?? "no status message"})`
        : `MiniMax returned no content. Response: ${JSON.stringify(json).slice(0, 400)}`

    throw new Error(diagnostic)
  }

  return content
}

/** Parse JSON from LLM output — strips markdown code fences if present */
export function parseLLMJson<T>(raw: string): T {
  const stripped = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim()
  return JSON.parse(stripped) as T
}
