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

function stripCodeFencesAndThinking(raw: string): string {
  return raw
    .replace(/[\u201C\u201D]/g, "\"")
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/<think>[\s\S]*?<\/think>/gi, "")
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim()
}

function extractBalancedJson(raw: string): string | null {
  const start = raw.search(/[\[{]/)
  if (start === -1) return null

  const opener = raw[start]
  const closer = opener === "{" ? "}" : "]"
  let depth = 0
  let inString = false
  let escaped = false

  for (let i = start; i < raw.length; i += 1) {
    const char = raw[i]

    if (inString) {
      if (escaped) {
        escaped = false
      } else if (char === "\\") {
        escaped = true
      } else if (char === "\"") {
        inString = false
      }
      continue
    }

    if (char === "\"") {
      inString = true
      continue
    }

    if (char === opener) depth += 1
    if (char === closer) depth -= 1

    if (depth === 0) {
      return raw.slice(start, i + 1)
    }
  }

  return null
}

function sanitizeJsonLikeString(raw: string): string {
  let result = ""
  let inString = false
  let escaped = false

  for (let i = 0; i < raw.length; i += 1) {
    const char = raw[i]

    if (inString) {
      if (escaped) {
        result += char
        escaped = false
        continue
      }

      if (char === "\\") {
        result += char
        escaped = true
        continue
      }

      if (char === "\"") {
        result += char
        inString = false
        continue
      }

      if (char === "\n") {
        result += "\\n"
        continue
      }

      if (char === "\r") {
        result += "\\r"
        continue
      }

      if (char === "\t") {
        result += "\\t"
        continue
      }

      result += char
      continue
    }

    if (char === "\"") {
      inString = true
      result += char
      continue
    }

    result += char
  }

  return result.replace(/,\s*([}\]])/g, "$1")
}

function tryParseJson<T>(raw: string): T | null {
  try {
    return JSON.parse(raw) as T
  } catch {
    return null
  }
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
  const stripped = stripCodeFencesAndThinking(raw)
  const extracted = extractBalancedJson(stripped)

  const candidates = [
    stripped,
    sanitizeJsonLikeString(stripped),
    extracted,
    extracted ? sanitizeJsonLikeString(extracted) : null,
  ].filter((value): value is string => Boolean(value))

  for (const candidate of candidates) {
    const parsed = tryParseJson<T>(candidate)
    if (parsed !== null) {
      return parsed
    }
  }

  throw new Error(`Failed to parse LLM JSON. Raw response: ${stripped.slice(0, 500)}`)
}
