import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@insforge/sdk"
import { runStrategyAgent } from "@/lib/agents/strategyAgent"
import { runPersonaAgent } from "@/lib/agents/personaAgent"
import { runSupervisorAgent } from "@/lib/agents/supervisorAgent"
import { computeScore } from "@/lib/scoring"
import { PersonaResponse, PivotDecision, ScoreResult, Strategy } from "@/lib/types"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"
export const maxDuration = 60

function getInsforge() {
  return createClient({
    baseUrl: process.env.NEXT_PUBLIC_INSFORGE_URL!,
    anonKey: process.env.INSFORGE_API_KEY ?? process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY!,
  })
}

export async function POST(req: NextRequest) {
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
        controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`))
      }

      const updateSimulation = async (id: string, payload: Record<string, unknown>) => {
        const { error } = await insforge.database.from("simulations").update(payload).eq("id", id)
        if (error) {
          throw new Error(`Failed to update simulation ${id}: ${error.message}`)
        }
      }

      const failWith = async (id: string | null, message: string) => {
        if (id) {
          await updateSimulation(id, { status: "failed", failure_reason: message })
        }
        send("error", { message })
      }

      const finalize = async (
        id: string,
        personas: PersonaResponse[],
        roundsCompleted: number,
        previousRound?: PersonaResponse[]
      ) => {
        const score: ScoreResult = computeScore(personas, previousRound)
        await updateSimulation(id, { ...score, rounds_completed: roundsCompleted, status: "complete" })
        send("score", { ...score, rounds_completed: roundsCompleted })
        send("done", {})
      }

      let simulationId: string | null = null

      try {
        const { data: simRow, error: insertError } = await insforge.database
          .from("simulations")
          .insert([{ idea, status: "running" }])
          .select()

        if (insertError || !simRow?.[0]) {
          send("error", {
            message: insertError?.message ?? "Failed to create simulation record",
          })
          return
        }

        simulationId = simRow[0].id as string
        send("start", { simulation_id: simulationId })

        let strategy: Strategy
        try {
          strategy = await runStrategyAgent(idea)
        } catch (err) {
          await failWith(simulationId, err instanceof Error ? err.message : "Strategy agent failed")
          return
        }

        await updateSimulation(simulationId, { strategy })
        send("strategy", { strategy })

        let round1: PersonaResponse[]
        try {
          round1 = await runPersonaAgent(idea, strategy)
        } catch (err) {
          await failWith(simulationId, err instanceof Error ? err.message : "Persona agent failed (round 1)")
          return
        }

        await updateSimulation(simulationId, { round1, rounds_completed: 1 })
        send("round_personas", { roundNumber: 1, personas: round1 })

        let pivot: PivotDecision
        try {
          pivot = await runSupervisorAgent(idea, strategy, round1, 1)
        } catch (err) {
          await failWith(simulationId, err instanceof Error ? err.message : "Supervisor failed (round 1)")
          return
        }

        await updateSimulation(simulationId, { pivot })
        send("supervisor", { roundNumber: 1, pivot })

        if (!pivot.should_pivot) {
          await finalize(simulationId, round1, 1)
          return
        }

        const strategy2 = pivot.updated_strategy

        let round2: PersonaResponse[]
        try {
          round2 = await runPersonaAgent(idea, strategy2)
        } catch (err) {
          await failWith(simulationId, err instanceof Error ? err.message : "Persona agent failed (round 2)")
          return
        }

        await updateSimulation(simulationId, { round2, rounds_completed: 2 })
        send("round_personas", { roundNumber: 2, personas: round2 })

        let pivot2: PivotDecision
        try {
          pivot2 = await runSupervisorAgent(idea, strategy2, round2, 2, round1)
        } catch (err) {
          await failWith(simulationId, err instanceof Error ? err.message : "Supervisor failed (round 2)")
          return
        }

        await updateSimulation(simulationId, { pivot2 })
        send("supervisor", { roundNumber: 2, pivot: pivot2 })

        if (!pivot2.should_pivot || !pivot2.should_run_round_three) {
          await finalize(simulationId, round2, 2, round1)
          return
        }

        const strategy3 = pivot2.updated_strategy

        let round3: PersonaResponse[]
        try {
          round3 = await runPersonaAgent(idea, strategy3)
        } catch (err) {
          await failWith(simulationId, err instanceof Error ? err.message : "Persona agent failed (round 3)")
          return
        }

        await updateSimulation(simulationId, { round3, rounds_completed: 3 })
        send("round_personas", { roundNumber: 3, personas: round3 })

        await finalize(simulationId, round3, 3, round2)
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unexpected error"
        if (simulationId) {
          await updateSimulation(simulationId, { status: "failed", failure_reason: message })
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
      Connection: "keep-alive",
    },
  })
}
