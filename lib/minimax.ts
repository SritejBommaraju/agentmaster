const MINIMAX_API_URL = "https://api.minimax.chat/v1/text/chatcompletion_v2"

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
      model: "abab6.5s-chat",
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
  const content = json?.choices?.[0]?.message?.content
  if (!content) {
    throw new Error("MiniMax returned an empty response")
  }
  return content
}

/** Parse JSON from LLM output — strips markdown code fences if present */
export function parseLLMJson<T>(raw: string): T {
  const stripped = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim()
  return JSON.parse(stripped) as T
}
