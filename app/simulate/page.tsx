"use client"

import { useState, useEffect, useRef } from "react"
import { Navbar } from "@/components/Navbar"
import { StatusBadge, SimulationStatus } from "@/components/StatusBadge"
import { DashboardPanel } from "@/components/DashboardPanel"
import { StrategyDisplay } from "@/components/StrategyDisplay"
import { PersonaGrid } from "@/components/PersonaGrid"
import { SupervisorDisplay } from "@/components/SupervisorDisplay"
import { ScoreDisplay } from "@/components/ScoreDisplay"
import { ArrowUpRight } from "lucide-react"
import { Strategy, PersonaResponse, PivotDecision } from "@/lib/types"
import { getDemoEvents, DEMO_IDEA } from "@/lib/demo-fixture"

// ─── Types ────────────────────────────────────────────────────────────────────

type PanelKey = "panel1" | "panel2" | "panel3" | "panel4" | "panel5"

type PanelVisibility = Record<PanelKey, boolean>

type RoundData = { roundNumber: number; personas: PersonaResponse[] }

type SupervisorRound = { roundNumber: number; decision: PivotDecision }

// ─── SSE Parser ───────────────────────────────────────────────────────────────

interface ParsedEvent {
  event: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any
}

function parseSSEBuffer(buffer: string): { events: ParsedEvent[]; remainder: string } {
  const events: ParsedEvent[] = []
  const blocks = buffer.split("\n\n")
  const remainder = blocks.pop() ?? ""

  for (const block of blocks) {
    if (!block.trim()) continue
    let eventType = "message"
    let dataStr = ""
    for (const line of block.split("\n")) {
      if (line.startsWith("event: ")) eventType = line.slice(7).trim()
      else if (line.startsWith("data: ")) dataStr = line.slice(6).trim()
    }
    if (dataStr) {
      try {
        events.push({ event: eventType, data: JSON.parse(dataStr) })
      } catch {
        // skip malformed
      }
    }
  }

  return { events, remainder }
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SimulatePage() {
  const [idea, setIdea] = useState("")
  const [isDemoMode, setIsDemoMode] = useState(false)
  const [status, setStatus] = useState<SimulationStatus>("ready")
  const [statusMessage, setStatusMessage] = useState("")
  const [simulationId, setSimulationId] = useState<string | null>(null)
  const [strategy, setStrategy] = useState<Strategy | null>(null)
  const [personaRounds, setPersonaRounds] = useState<RoundData[]>([])
  const [supervisorRounds, setSupervisorRounds] = useState<SupervisorRound[]>([])
  const [validationScore, setValidationScore] = useState<number | null>(null)
  const [adoptionRate, setAdoptionRate] = useState<number | null>(null)
  const [failureReason, setFailureReason] = useState<string | null>(null)
  const [roundsCompleted, setRoundsCompleted] = useState<number>(0)
  const [error, setError] = useState<string | null>(null)
  const [panels, setPanels] = useState<PanelVisibility>({
    panel1: true,
    panel2: false,
    panel3: false,
    panel4: false,
    panel5: false,
  })

  const abortRef = useRef<AbortController | null>(null)

  // Detect ?demo=1 on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get("demo") === "1") {
      setIsDemoMode(true)
      setIdea(DEMO_IDEA)
    }
  }, [])

  function reveal(key: PanelKey) {
    setPanels((prev) => ({ ...prev, [key]: true }))
  }

  function resetState() {
    setStatus("running")
    setStatusMessage("Connecting to simulation engine...")
    setError(null)
    setStrategy(null)
    setPersonaRounds([])
    setSupervisorRounds([])
    setValidationScore(null)
    setAdoptionRate(null)
    setFailureReason(null)
    setRoundsCompleted(0)
    setSimulationId(null)
    setPanels({ panel1: true, panel2: true, panel3: false, panel4: false, panel5: false })
  }

  // ── Event handler (shared by live and demo modes) ──────────────────────────
  function applyEvent(event: string, data: any) {
    switch (event) {
      case "start":
        setSimulationId(data.simulation_id)
        setStatusMessage("Strategy Agent analyzing idea...")
        break

      case "strategy":
        setStrategy(data.strategy)
        setStatusMessage("Generating synthetic buyer personas...")
        break

      case "round_personas":
        setPersonaRounds((prev) => {
          const exists = prev.some((r) => r.roundNumber === data.roundNumber)
          if (exists) return prev
          return [...prev, { roundNumber: data.roundNumber, personas: data.personas }]
        })
        reveal("panel3")
        setStatusMessage(`Round ${data.roundNumber} complete — Executive Supervisor deliberating...`)
        break

      case "supervisor":
        setSupervisorRounds((prev) => {
          const exists = prev.some((r) => r.roundNumber === data.roundNumber)
          if (exists) return prev
          return [...prev, { roundNumber: data.roundNumber, decision: data.pivot }]
        })
        reveal("panel4")
        setStatusMessage(
          data.pivot.should_pivot
            ? `Pivoting strategy — running Round ${data.roundNumber + 1}...`
            : "Computing weighted validation score..."
        )
        break

      case "score":
        setValidationScore(data.validation_score)
        setAdoptionRate(data.adoption_rate)
        setFailureReason(data.failure_reason ?? null)
        setRoundsCompleted(data.rounds_completed)
        reveal("panel5")
        setStatusMessage("")
        setStatus(data.failure_reason ? "failed" : "complete")
        break

      case "done":
        // Stream complete — status already set by "score" event
        break

      case "error":
        setError(data.message)
        setStatus("failed")
        setStatusMessage("")
        break
    }
  }

  // ── Live streaming mode ────────────────────────────────────────────────────
  async function runLiveSimulation() {
    const abort = new AbortController()
    abortRef.current = abort

    const res = await fetch("/api/simulate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idea }),
      signal: abort.signal,
    })

    if (!res.ok) {
      const json = await res.json().catch(() => ({}))
      throw new Error(json.error ?? `Server error ${res.status}`)
    }

    const reader = res.body!.getReader()
    const decoder = new TextDecoder()
    let buffer = ""

    while (true) {
      const { done, value } = await reader.read()
      if (done) {
        // Flush any remaining buffer
        if (buffer.trim()) {
          const { events } = parseSSEBuffer(buffer + "\n\n")
          events.forEach(({ event, data }) => applyEvent(event, data))
        }
        break
      }
      buffer += decoder.decode(value, { stream: true })
      const { events, remainder } = parseSSEBuffer(buffer)
      buffer = remainder
      events.forEach(({ event, data }) => applyEvent(event, data))
    }
  }

  // ── Demo replay mode ───────────────────────────────────────────────────────
  async function runDemoSimulation() {
    const events = getDemoEvents()
    for (const { event, data, delay } of events) {
      await new Promise<void>((resolve) => setTimeout(resolve, delay))
      applyEvent(event, data)
    }
  }

  // ── Submit handler ─────────────────────────────────────────────────────────
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!idea.trim() || status === "running") return

    resetState()

    try {
      if (isDemoMode) {
        await runDemoSimulation()
      } else {
        await runLiveSimulation()
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") return
      setError(err instanceof Error ? err.message : "Unknown error")
      setStatus("failed")
      setStatusMessage("")
    }
  }

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <main className="min-h-screen bg-[#111111] pb-24">
      <Navbar />

      <div className="max-w-3xl mx-auto px-6 pt-28 flex flex-col gap-4">
        {/* Header row */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-white/80 text-sm font-mono tracking-wider uppercase">
              Market Simulation
            </h1>
            {statusMessage && (
              <p className="font-mono text-[10px] tracking-wider text-white/30 uppercase mt-1 animate-pulse">
                {statusMessage}
              </p>
            )}
          </div>
          <StatusBadge status={status} />
        </div>

        {error && (
          <div
            data-testid="error-message"
            className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-red-400 text-sm"
          >
            {error}
          </div>
        )}

        {isDemoMode && (
          <div className="rounded-xl border border-white/7 bg-[#1a1a1a] px-4 py-2 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-white/40 shrink-0" />
            <p className="font-mono text-[10px] tracking-widest text-white/40 uppercase">
              Demo Mode — pre-cached scenario, no LLM required
            </p>
          </div>
        )}

        {/* Panel 1 — Idea Input */}
        <DashboardPanel panelNumber={1} title="Your Idea" tag="INPUT_" visible={panels.panel1}>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <textarea
              data-testid="idea-input"
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder="Describe your B2B idea in one sentence…"
              className="w-full bg-[#141414] border border-white/10 rounded-xl px-4 py-3
                         text-white placeholder-white/25 text-sm resize-none
                         focus:outline-none focus:border-white/20 min-h-[80px]"
              disabled={status === "running"}
            />
            <div className="flex items-center justify-between">
              {!isDemoMode ? (
                <a
                  href="/simulate?demo=1"
                  className="font-mono text-[10px] tracking-widest text-white/30 uppercase
                             hover:text-white/50 transition-colors"
                >
                  Try Demo →
                </a>
              ) : (
                <a
                  href="/simulate"
                  className="font-mono text-[10px] tracking-widest text-white/30 uppercase
                             hover:text-white/50 transition-colors"
                >
                  ← Live Mode
                </a>
              )}
              <button
                type="submit"
                data-testid="submit-button"
                disabled={!idea.trim() || status === "running"}
                className="flex items-center gap-2 px-4 py-2 rounded-full
                           bg-white text-black text-sm font-medium
                           hover:bg-white/90 transition-colors
                           disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ArrowUpRight className="w-4 h-4" />
                {status === "running"
                  ? "Simulating…"
                  : isDemoMode
                  ? "Run Demo"
                  : "Run Simulation"}
              </button>
            </div>
          </form>
        </DashboardPanel>

        {/* Panel 2 — Strategy */}
        <DashboardPanel
          panelNumber={2}
          title="Strategy"
          tag="STRATEGY_AGT"
          visible={panels.panel2}
        >
          {strategy ? (
            <StrategyDisplay strategy={strategy} />
          ) : (
            <div data-testid="strategy-loading" className="space-y-2">
              <div className="h-2 rounded shimmer w-full" />
              <div className="h-2 rounded shimmer w-4/5" />
              <div className="h-2 rounded shimmer w-2/3" />
            </div>
          )}
        </DashboardPanel>

        {/* Panel 3 — Market Responses */}
        <DashboardPanel
          panelNumber={3}
          title="Market Responses"
          tag="PERSONA_GRID"
          visible={panels.panel3}
        >
          {personaRounds.length > 0 ? (
            <div className="flex flex-col gap-6">
              {personaRounds.map((round, i) => (
                <div key={round.roundNumber}>
                  {personaRounds.length > 1 && i > 0 && (
                    <div className="border-t border-white/7 mb-5" />
                  )}
                  {personaRounds.length > 1 && (
                    <p className="font-mono text-[10px] tracking-widest text-white/30 uppercase mb-3">
                      Round {round.roundNumber}
                    </p>
                  )}
                  <PersonaGrid personas={round.personas} />
                </div>
              ))}
            </div>
          ) : (
            <div data-testid="personas-loading" className="space-y-2">
              <div className="h-2 rounded shimmer w-full" />
              <div className="h-2 rounded shimmer w-4/5" />
              <div className="h-2 rounded shimmer w-2/3" />
            </div>
          )}
        </DashboardPanel>

        {/* Panel 4 — Executive Decision */}
        <DashboardPanel
          panelNumber={4}
          title="Executive Decision"
          tag="EXEC_SUPV"
          visible={panels.panel4}
        >
          {supervisorRounds.length > 0 ? (
            <SupervisorDisplay rounds={supervisorRounds} />
          ) : (
            <div data-testid="supervisor-loading" className="space-y-2">
              <div className="h-2 rounded shimmer w-full" />
              <div className="h-2 rounded shimmer w-4/5" />
              <div className="h-2 rounded shimmer w-2/3" />
            </div>
          )}
        </DashboardPanel>

        {/* Panel 5 — Validation Score */}
        <DashboardPanel
          panelNumber={5}
          title="Validation Score"
          tag="SCORE_OUT"
          visible={panels.panel5}
        >
          {validationScore !== null && adoptionRate !== null ? (
            <ScoreDisplay
              validationScore={validationScore}
              adoptionRate={adoptionRate}
              roundsCompleted={roundsCompleted}
              failureReason={failureReason}
            />
          ) : (
            <div data-testid="score-loading" className="space-y-2">
              <div className="h-2 rounded bg-white/10 w-full" />
              <div className="h-2 rounded shimmer w-3/4" />
              <div className="h-2 rounded shimmer w-1/2" />
            </div>
          )}
        </DashboardPanel>
      </div>
    </main>
  )
}
