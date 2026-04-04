import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@insforge/sdk"
import { runStrategyAgent } from "@/lib/agents/strategyAgent"
import { runPersonaAgent } from "@/lib/agents/personaAgent"
import { runSupervisorAgent } from "@/lib/agents/supervisorAgent"
import { computeScore } from "@/lib/scoring"
import { PersonaResponse, PivotDecision, Strategy } from "@/lib/types"

function getInsforge() {
  return createClient({
    baseUrl: process.env.NEXT_PUBLIC_INSFORGE_URL!,
    anonKey: process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY!,
  })
}

type InsforgeClient = ReturnType<typeof getInsforge>

export async function POST(req: NextRequest) {
  // Validate before streaming (status code can't change once stream starts)
  let body: { idea?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  const idea = body.idea?.trim()
  if (!idea) {
    return NextResponse.json({ error: "idea is required" }, { status: 400 })
  }

  const insforge = getInsforge()
  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    async start(controller) {
      const send = (event: string, data: unknown) => {
        controller.enqueue(
          encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`)
        )
      }

      const failWith = async (id: string | null, message: string) => {
        if (id) {
          await insforge.database
            .from("simulations")
            .update({ status: "failed", failure_reason: message })
            .eq("id", id)
        }
        send("error", { message })
      }

      let simulationId: string | null = null

      try {
        // ── Create record ───────────────────────────────────────────────────
        const { data: simRow, error: insertError } = await insforge.database
          .from("simulations")
          .insert([{ idea, status: "running" }])
          .select()

        if (insertError || !simRow?.[0]) {
          send("error", { message: "Failed to create simulation record" })
          return
        }

        simulationId = simRow[0].id as string
        send("start", { simulation_id: simulationId })

        // ── Strategy Agent ──────────────────────────────────────────────────
        let strategy: Strategy
        try {
          strategy = await runStrategyAgent(idea)
        } catch (err) {
          await failWith(simulationId, err instanceof Error ? err.message : "Strategy agent failed")
          return
        }

        await insforge.database
          .from("simulations")
          .update({ strategy })
          .eq("id", simulationId)

        send("strategy", { strategy })

        // ── Round 1 Personas ────────────────────────────────────────────────
        let round1: PersonaResponse[]
        try {
          round1 = await runPersonaAgent(idea, strategy)
        } catch (err) {
          await failWith(simulationId, err instanceof Error ? err.message : "Persona agent failed (round 1)")
          return
        }

        await insforge.database
          .from("simulations")
          .update({ round1, rounds_completed: 1 })
          .eq("id", simulationId)

        send("round_personas", { roundNumber: 1, personas: round1 })

        // ── Supervisor after Round 1 ────────────────────────────────────────
        let pivot: PivotDecision
        try {
          pivot = await runSupervisorAgent(idea, strategy, round1, 1)
        } catch (err) {
          await failWith(simulationId, err instanceof Error ? err.message : "Supervisor failed (round 1)")
          return
        }

        await insforge.database
          .from("simulations")
          .update({ pivot })
          .eq("id", simulationId)

        send("supervisor", { roundNumber: 1, pivot })

        if (!pivot.should_pivot) {
          const score = computeScore(round1)
          await insforge.database
            .from("simulations")
            .update({ ...score, status: "complete" })
            .eq("id", simulationId)
          send("score", { ...score, rounds_completed: 1 })
          send("done", {})
          return
        }

        // ── Round 2 Personas ────────────────────────────────────────────────
        const strategy2 = pivot.updated_strategy

        let round2: PersonaResponse[]
        try {
          round2 = await runPersonaAgent(idea, strategy2)
        } catch (err) {
          await failWith(simulationId, err instanceof Error ? err.message : "Persona agent failed (round 2)")
          return
        }

        await insforge.database
          .from("simulations")
          .update({ round2, rounds_completed: 2 })
          .eq("id", simulationId)

        send("round_personas", { roundNumber: 2, personas: round2 })

        // ── Supervisor after Round 2 ────────────────────────────────────────
        let pivot2: PivotDecision
        try {
          pivot2 = await runSupervisorAgent(idea, strategy2, round2, 2)
        } catch (err) {
          await failWith(simulationId, err instanceof Error ? err.message : "Supervisor failed (round 2)")
          return
        }

        send("supervisor", { roundNumber: 2, pivot: pivot2 })

        if (!pivot2.should_pivot) {
          const score = computeScore(round2)
          await insforge.database
            .from("simulations")
            .update({ ...score, status: "complete" })
            .eq("id", simulationId)
          send("score", { ...score, rounds_completed: 2 })
          send("done", {})
          return
        }

        // ── Round 3 Personas ────────────────────────────────────────────────
        const strategy3 = pivot2.updated_strategy

        let round3: PersonaResponse[]
        try {
          round3 = await runPersonaAgent(idea, strategy3)
        } catch (err) {
          await failWith(simulationId, err instanceof Error ? err.message : "Persona agent failed (round 3)")
          return
        }

        await insforge.database
          .from("simulations")
          .update({ round3, rounds_completed: 3 })
          .eq("id", simulationId)

        send("round_personas", { roundNumber: 3, personas: round3 })

        const score = computeScore(round3)
        await insforge.database
          .from("simulations")
          .update({ ...score, status: "complete" })
          .eq("id", simulationId)

        send("score", { ...score, rounds_completed: 3 })
        send("done", {})
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unexpected error"
        if (simulationId) {
          await insforge.database
            .from("simulations")
            .update({ status: "failed", failure_reason: message })
            .eq("id", simulationId)
        }
        send("error", { message })
      } finally {
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    },
  })
}
