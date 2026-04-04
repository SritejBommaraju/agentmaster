"use client"

import Link from "next/link"
import { useEffect, useMemo, useRef, useState } from "react"
import {
  ArrowUpRight,
  BrainCircuit,
  CircleDashed,
  Play,
  Radar,
  RotateCcw,
  Square,
  Users,
} from "lucide-react"
import { Navbar } from "@/components/Navbar"
import { StatusBadge, SimulationStatus } from "@/components/StatusBadge"
import { DashboardPanel } from "@/components/DashboardPanel"
import { StrategyDisplay } from "@/components/StrategyDisplay"
import { PersonaGrid } from "@/components/PersonaGrid"
import { SupervisorDisplay } from "@/components/SupervisorDisplay"
import { ScoreDisplay } from "@/components/ScoreDisplay"
import { Strategy, PersonaResponse, PivotDecision } from "@/lib/types"
import { getDemoEvents, DEMO_IDEA } from "@/lib/demo-fixture"

type PanelKey = "panel1" | "panel2" | "panel3" | "panel4" | "panel5"
type PanelVisibility = Record<PanelKey, boolean>
type RoundData = { roundNumber: number; personas: PersonaResponse[] }
type SupervisorRound = { roundNumber: number; decision: PivotDecision }

interface ParsedEvent {
  event: string
  data: unknown
}

const EXAMPLE_IDEAS = [
  "Inventory forecasting tool for independent guitar retailers",
  "AI compliance automation tool for fintech",
  "Repair-shop workflow software for multi-location music stores",
]

const RUN_STEPS = [
  { key: "panel2", title: "Strategy", detail: "Define ICP, pricing, messaging", icon: Radar },
  { key: "panel3", title: "Buyer responses", detail: "Stage-based objections and demand", icon: Users },
  { key: "panel4", title: "Executive pivot", detail: "Pricing, messaging, or ICP correction", icon: BrainCircuit },
  { key: "panel5", title: "Validation score", detail: "Weighted signal and next step", icon: CircleDashed },
] as const

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
    if (!dataStr) continue
    try {
      events.push({ event: eventType, data: JSON.parse(dataStr) })
    } catch {
      // Skip malformed fragments and continue streaming.
    }
  }

  return { events, remainder }
}

function stepState(stepKey: string, panels: PanelVisibility, status: SimulationStatus): "idle" | "active" | "complete" {
  if (!panels[stepKey as PanelKey]) return "idle"
  if (stepKey === "panel5" && status === "complete") return "complete"
  if (stepKey === "panel5" && status === "failed") return "active"
  if (status === "running") {
    const ordered: PanelKey[] = ["panel2", "panel3", "panel4", "panel5"]
    const visibleOrdered = ordered.filter((key) => panels[key])
    const latest = visibleOrdered[visibleOrdered.length - 1]
    return latest === stepKey ? "active" : "complete"
  }
  return status === "ready" ? "idle" : "complete"
}

function StatCard({
  label,
  value,
  muted,
}: {
  label: string
  value: string
  muted?: boolean
}) {
  return (
    <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
      <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/28">{label}</p>
      <p className={`mt-3 text-sm leading-6 ${muted ? "text-white/46" : "text-white/76"}`}>{value}</p>
    </div>
  )
}

export default function SimulatePage() {
  const [isDemoMode, setIsDemoMode] = useState(false)
  const [idea, setIdea] = useState("")
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

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const demo = params.get("demo") === "1"
    setIsDemoMode(demo)
    if (demo) setIdea(DEMO_IDEA)
  }, [])

  const currentPhase = useMemo(() => {
    if (status === "failed") return "Run interrupted"
    if (validationScore !== null) return "Scoring complete"
    if (supervisorRounds.length > 0) return "Supervisor review"
    if (personaRounds.length > 0) return "Buyer simulation"
    if (strategy) return "Strategy shaping"
    return status === "running" ? "Initializing session" : "Awaiting idea"
  }, [personaRounds.length, status, strategy, supervisorRounds.length, validationScore])

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

  function applyEvent(event: string, payload: unknown) {
    const data = (payload ?? {}) as Record<string, unknown>

    switch (event) {
      case "start":
        setSimulationId((data.simulation_id as string) ?? null)
        setStatusMessage("Strategy agent analyzing idea...")
        break

      case "strategy":
        setStrategy((data.strategy as Strategy) ?? null)
        setStatusMessage("Generating synthetic buyer personas...")
        break

      case "round_personas":
        setPersonaRounds((prev) => {
          const roundNumber = data.roundNumber as number
          const exists = prev.some((r) => r.roundNumber === roundNumber)
          if (exists) return prev
          return [...prev, { roundNumber, personas: (data.personas as PersonaResponse[]) ?? [] }]
        })
        reveal("panel3")
        setStatusMessage(`Round ${String(data.roundNumber)} complete. Executive supervisor reviewing...`)
        break

      case "supervisor":
        setSupervisorRounds((prev) => {
          const roundNumber = data.roundNumber as number
          const exists = prev.some((r) => r.roundNumber === roundNumber)
          if (exists) return prev
          return [...prev, { roundNumber, decision: data.pivot as PivotDecision }]
        })
        reveal("panel4")
        setStatusMessage(
          (data.pivot as PivotDecision)?.should_pivot
            ? `Pivoting strategy for Round ${Number(data.roundNumber) + 1}...`
            : "Computing weighted validation score..."
        )
        break

      case "score":
        setValidationScore((data.validation_score as number) ?? null)
        setAdoptionRate((data.adoption_rate as number) ?? null)
        setFailureReason((data.failure_reason as string | null) ?? null)
        setRoundsCompleted((data.rounds_completed as number) ?? 0)
        reveal("panel5")
        setStatusMessage("")
        setStatus(data.failure_reason ? "failed" : "complete")
        break

      case "error":
        setError((data.message as string) ?? "Unknown error")
        setStatus("failed")
        setStatusMessage("")
        break

      default:
        break
    }
  }

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

    if (!res.body) {
      throw new Error("Simulation stream was empty")
    }

    const reader = res.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ""

    while (true) {
      const { done, value } = await reader.read()
      if (done) {
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

  async function runDemoSimulation() {
    const events = getDemoEvents()
    for (const { event, data, delay } of events) {
      await new Promise<void>((resolve) => setTimeout(resolve, delay))
      applyEvent(event, data)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!idea.trim() || status === "running") return

    resetState()

    try {
      if (isDemoMode) await runDemoSimulation()
      else await runLiveSimulation()
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") return
      setError(err instanceof Error ? err.message : "Unknown error")
      setStatus("failed")
      setStatusMessage("")
    }
  }

  function handleAbort() {
    abortRef.current?.abort()
    abortRef.current = null
    setStatus("failed")
    setStatusMessage("")
    setError("Simulation cancelled")
  }

  function handleResetIdea() {
    setIdea(isDemoMode ? DEMO_IDEA : "")
    setStatus("ready")
    setStatusMessage("")
    setError(null)
    setStrategy(null)
    setPersonaRounds([])
    setSupervisorRounds([])
    setValidationScore(null)
    setAdoptionRate(null)
    setFailureReason(null)
    setRoundsCompleted(0)
    setSimulationId(null)
    setPanels({
      panel1: true,
      panel2: false,
      panel3: false,
      panel4: false,
      panel5: false,
    })
  }

  return (
    <main className="min-h-screen bg-[#111111] pb-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_10%,rgba(255,255,255,0.07),transparent_28%),radial-gradient(circle_at_88%_8%,rgba(255,255,255,0.05),transparent_22%)]" />
      <Navbar />

      <div className="mx-auto grid max-w-7xl gap-8 px-6 pb-16 pt-28 lg:grid-cols-[minmax(0,1fr)_320px] lg:px-10">
        <div className="flex flex-col gap-5">
          <section className="rounded-[30px] border border-white/8 bg-[#171717] p-6 sm:p-7">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-white/28">
                  Market Simulation Workspace
                </p>
                <h1 className="mt-4 text-3xl font-normal tracking-[-0.04em] text-white sm:text-4xl">
                  Pressure-test the idea before you pressure-test the market.
                </h1>
                <p className="mt-4 max-w-xl text-sm leading-7 text-white/56 sm:text-[15px]">
                  This workspace turns one line of intent into a visible decision loop:
                  strategy, buyer pushback, executive revision, and a weighted signal.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <StatusBadge status={status} />
                <div className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 font-mono text-[11px] uppercase tracking-[0.22em] text-white/58">
                  {isDemoMode ? "Demo session" : "Live session"}
                </div>
              </div>
            </div>

            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              <StatCard label="Current phase" value={currentPhase} />
              <StatCard
                label="Session"
                value={simulationId ? simulationId.slice(0, 8).toUpperCase() : "Not started"}
                muted={!simulationId}
              />
              <StatCard
                label="Rounds completed"
                value={`${roundsCompleted} / 3`}
                muted={roundsCompleted === 0}
              />
            </div>

            {statusMessage && (
              <div className="mt-5 rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3">
                <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/34">Live status</p>
                <p className="mt-2 text-sm text-white/72">{statusMessage}</p>
              </div>
            )}

            {error && (
              <div
                data-testid="error-message"
                className="mt-5 rounded-2xl border border-red-500/20 bg-red-500/6 px-4 py-4"
              >
                <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-red-400/60">Run issue</p>
                <p className="mt-2 text-sm leading-7 text-red-300/88">{error}</p>
              </div>
            )}
          </section>

          <DashboardPanel panelNumber={1} title="Your Idea" tag="INPUT_" visible={panels.panel1} className="rounded-[30px] p-7">
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_220px]">
                <div className="rounded-[24px] border border-white/8 bg-[#141414] p-4">
                  <div className="flex items-center justify-between">
                    <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/30">Idea brief</p>
                    <span className="text-xs text-white/30">{idea.length} chars</span>
                  </div>
                  <textarea
                    data-testid="idea-input"
                    value={idea}
                    onChange={(e) => setIdea(e.target.value)}
                    placeholder="Describe your B2B idea in one sentence..."
                    className="mt-3 min-h-[132px] w-full resize-none bg-transparent text-[17px] leading-8 text-white placeholder:text-white/22 focus:outline-none"
                    disabled={status === "running"}
                  />
                </div>

                <div className="rounded-[24px] border border-white/8 bg-white/[0.03] p-4">
                  <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/30">Run mode</p>
                  <div className="mt-4 space-y-3">
                    <Link
                      href="/simulate"
                      className={`block rounded-2xl border px-4 py-3 text-sm transition-colors ${
                        !isDemoMode
                          ? "border-white/18 bg-white/[0.06] text-white"
                          : "border-white/8 bg-[#141414] text-white/56 hover:text-white/80"
                      }`}
                    >
                      Live run
                    </Link>
                    <Link
                      href="/simulate?demo=1"
                      className={`block rounded-2xl border px-4 py-3 text-sm transition-colors ${
                        isDemoMode
                          ? "border-white/18 bg-white/[0.06] text-white"
                          : "border-white/8 bg-[#141414] text-white/56 hover:text-white/80"
                      }`}
                    >
                      Demo mode
                    </Link>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-white/46">
                    {isDemoMode
                      ? "Uses the pre-cached showcase scenario. No live LLM call required."
                      : "Uses your current env keys and streams the simulation in real time."}
                  </p>
                </div>
              </div>

              <div className="rounded-[24px] border border-white/8 bg-white/[0.03] p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/30">Suggested prompts</p>
                  <p className="text-xs text-white/34">Use one of these to get a cleaner first run.</p>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {EXAMPLE_IDEAS.map((example) => (
                    <button
                      key={example}
                      type="button"
                      onClick={() => setIdea(example)}
                      className="rounded-full border border-white/10 bg-[#141414] px-4 py-2 text-sm text-white/62 transition-colors hover:border-white/18 hover:text-white"
                      disabled={status === "running"}
                    >
                      {example}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={handleResetIdea}
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white/66 transition-colors hover:border-white/18 hover:text-white"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Reset
                  </button>
                  {!isDemoMode ? (
                    <Link
                      href="/simulate?demo=1"
                      className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/34 transition-colors hover:text-white/60"
                    >
                      Try demo mode
                    </Link>
                  ) : (
                    <Link
                      href="/simulate"
                      className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/34 transition-colors hover:text-white/60"
                    >
                      Switch to live mode
                    </Link>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  {status === "running" && !isDemoMode && (
                    <button
                      type="button"
                      onClick={handleAbort}
                      className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#141414] px-4 py-3 text-sm text-white/66 transition-colors hover:border-white/18 hover:text-white"
                    >
                      <Square className="h-4 w-4" />
                      Stop Run
                    </button>
                  )}
                  <button
                    type="submit"
                    data-testid="submit-button"
                    disabled={!idea.trim() || status === "running"}
                    className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-medium text-black transition-colors hover:bg-white/92 disabled:cursor-not-allowed disabled:opacity-35"
                  >
                    {isDemoMode ? <Play className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
                    {status === "running" ? "Simulation running..." : isDemoMode ? "Run Demo" : "Run Simulation"}
                  </button>
                </div>
              </div>
            </form>
          </DashboardPanel>

          <DashboardPanel panelNumber={2} title="Strategy" tag="STRATEGY_AGT" visible={panels.panel2} className="rounded-[30px] p-7">
            {strategy ? (
              <StrategyDisplay strategy={strategy} />
            ) : (
              <div data-testid="strategy-loading" className="space-y-3">
                <div className="h-2 w-full rounded shimmer" />
                <div className="h-2 w-4/5 rounded shimmer" />
                <div className="h-2 w-2/3 rounded shimmer" />
              </div>
            )}
          </DashboardPanel>

          <DashboardPanel panelNumber={3} title="Market Responses" tag="PERSONA_GRID" visible={panels.panel3} className="rounded-[30px] p-7">
            {personaRounds.length > 0 ? (
              <div className="flex flex-col gap-7">
                {personaRounds.map((round, i) => (
                  <div key={round.roundNumber}>
                    {personaRounds.length > 1 && i > 0 && <div className="mb-6 border-t border-white/7" />}
                    {personaRounds.length > 1 && (
                      <div className="mb-4 inline-flex rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.26em] text-white/34">
                        Round {round.roundNumber}
                      </div>
                    )}
                    <PersonaGrid personas={round.personas} />
                  </div>
                ))}
              </div>
            ) : (
              <div data-testid="personas-loading" className="space-y-3">
                <div className="h-2 w-full rounded shimmer" />
                <div className="h-2 w-4/5 rounded shimmer" />
                <div className="h-2 w-2/3 rounded shimmer" />
              </div>
            )}
          </DashboardPanel>

          <DashboardPanel panelNumber={4} title="Executive Decision" tag="EXEC_SUPV" visible={panels.panel4} className="rounded-[30px] p-7">
            {supervisorRounds.length > 0 ? (
              <SupervisorDisplay rounds={supervisorRounds} />
            ) : (
              <div data-testid="supervisor-loading" className="space-y-3">
                <div className="h-2 w-full rounded shimmer" />
                <div className="h-2 w-4/5 rounded shimmer" />
                <div className="h-2 w-2/3 rounded shimmer" />
              </div>
            )}
          </DashboardPanel>

          <DashboardPanel panelNumber={5} title="Validation Score" tag="SCORE_OUT" visible={panels.panel5} className="rounded-[30px] p-7">
            {validationScore !== null && adoptionRate !== null ? (
              <ScoreDisplay
                validationScore={validationScore}
                adoptionRate={adoptionRate}
                roundsCompleted={roundsCompleted}
                failureReason={failureReason}
              />
            ) : (
              <div data-testid="score-loading" className="space-y-3">
                <div className="h-2 w-full rounded bg-white/10" />
                <div className="h-2 w-3/4 rounded shimmer" />
                <div className="h-2 w-1/2 rounded shimmer" />
              </div>
            )}
          </DashboardPanel>
        </div>

        <aside className="lg:sticky lg:top-28 lg:h-fit">
          <div className="flex flex-col gap-5">
            <section className="rounded-[28px] border border-white/8 bg-[#171717] p-5">
              <div className="flex items-center justify-between">
                <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/30">Run progress</p>
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] text-white/48">
                  {status === "ready" ? "Idle" : status === "running" ? "Active" : status}
                </span>
              </div>
              <div className="mt-5 flex flex-col gap-4">
                {RUN_STEPS.map((step) => {
                  const Icon = step.icon
                  const state = stepState(step.key, panels, status)
                  return (
                    <div key={step.key} className="flex items-start gap-3">
                      <div
                        className={`mt-0.5 flex h-9 w-9 items-center justify-center rounded-full border ${
                          state === "complete"
                            ? "border-white/18 bg-white/[0.08] text-white"
                            : state === "active"
                            ? "border-white/18 bg-white/[0.06] text-white"
                            : "border-white/8 bg-[#141414] text-white/38"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className={`text-sm ${state === "idle" ? "text-white/44" : "text-white/84"}`}>{step.title}</p>
                        <p className="mt-1 text-sm leading-6 text-white/42">{step.detail}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>

            <section className="rounded-[28px] border border-white/8 bg-[#171717] p-5">
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/30">Operator notes</p>
              <div className="mt-4 space-y-4">
                <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                  <p className="text-sm text-white">Best demo path</p>
                  <p className="mt-2 text-sm leading-6 text-white/48">
                    Use demo mode when you want reliable panel progression for a pitch or recording.
                  </p>
                </div>
                <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                  <p className="text-sm text-white">Best live path</p>
                  <p className="mt-2 text-sm leading-6 text-white/48">
                    Keep inputs B2B and decision-maker oriented. The prompts are tuned for software buyers, not consumer ideas.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </aside>
      </div>
    </main>
  )
}
