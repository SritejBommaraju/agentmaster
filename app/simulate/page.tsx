"use client"

import Link from "next/link"
import { useMemo, useRef, useState } from "react"
import {
  ArrowUpRight,
  BrainCircuit,
  CircleDashed,
  Play,
  Radar,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Square,
  Users,
  Waves,
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
  { key: "panel2", title: "Strategy", detail: "Sharper ICP, pricing, and wedge positioning.", icon: Radar },
  { key: "panel3", title: "Buyer responses", detail: "Embodied buyers surface blockers, trust gaps, and urgency.", icon: Users },
  { key: "panel4", title: "Executive pivot", detail: "The supervisor rewrites the angle based on structured signals.", icon: BrainCircuit },
  { key: "panel5", title: "Validation score", detail: "Readiness, GTM clarity, and upside land separately.", icon: CircleDashed },
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
    <div className="rounded-[26px] border border-[#f1d6a0]/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.015))] p-4 shadow-[0_18px_38px_rgba(0,0,0,0.18)]">
      <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#f1d6a0]/42">{label}</p>
      <p className={`mt-3 text-sm leading-6 ${muted ? "text-white/42" : "text-[#f4efe4]"}`}>{value}</p>
    </div>
  )
}

function SignalRibbon({
  icon: Icon,
  title,
  body,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  body: string
}) {
  return (
    <div className="rounded-[24px] border border-white/8 bg-white/[0.03] p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#f1d6a0]/18 bg-[#f1d6a0]/8 text-[#f1d6a0]">
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <p className="text-sm text-[#f4efe4]">{title}</p>
          <p className="mt-1 text-sm leading-6 text-white/46">{body}</p>
        </div>
      </div>
    </div>
  )
}

export default function SimulatePage() {
  const initialDemoMode =
    typeof window !== "undefined" && new URLSearchParams(window.location.search).get("demo") === "1"
  const [isDemoMode] = useState(initialDemoMode)
  const [idea, setIdea] = useState(initialDemoMode ? DEMO_IDEA : "")
  const [status, setStatus] = useState<SimulationStatus>("ready")
  const [statusMessage, setStatusMessage] = useState("")
  const [simulationId, setSimulationId] = useState<string | null>(null)
  const [strategy, setStrategy] = useState<Strategy | null>(null)
  const [personaRounds, setPersonaRounds] = useState<RoundData[]>([])
  const [supervisorRounds, setSupervisorRounds] = useState<SupervisorRound[]>([])
  const [validationScore, setValidationScore] = useState<number | null>(null)
  const [adoptionRate, setAdoptionRate] = useState<number | null>(null)
  const [buyerReadinessScore, setBuyerReadinessScore] = useState<number | null>(null)
  const [gtmClarityScore, setGtmClarityScore] = useState<number | null>(null)
  const [ventureUpsideSignal, setVentureUpsideSignal] = useState<number | null>(null)
  const [scoreSummary, setScoreSummary] = useState<string | null>(null)
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
    setBuyerReadinessScore(null)
    setGtmClarityScore(null)
    setVentureUpsideSignal(null)
    setScoreSummary(null)
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
        setBuyerReadinessScore((data.buyer_readiness_score as number) ?? null)
        setGtmClarityScore((data.gtm_clarity_score as number) ?? null)
        setVentureUpsideSignal((data.venture_upside_signal as number) ?? null)
        setScoreSummary((data.score_summary as string) ?? null)
        setFailureReason((data.failure_reason as string | null) ?? null)
        setRoundsCompleted((data.rounds_completed as number) ?? 0)
        reveal("panel5")
        setStatusMessage("")
        setStatus("complete")
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
    setBuyerReadinessScore(null)
    setGtmClarityScore(null)
    setVentureUpsideSignal(null)
    setScoreSummary(null)
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
    <main className="relative min-h-screen overflow-hidden pb-24">
      <div className="pointer-events-none absolute inset-0 app-shell-grid opacity-45" />
      <div className="pointer-events-none absolute inset-0 page-ambient-overlay" />
      <div className="pointer-events-none absolute left-[-8%] top-[18%] h-[420px] w-[420px] rounded-full bg-[#86b8c7]/8 blur-[120px]" />
      <div className="pointer-events-none absolute right-[-10%] top-[6%] h-[520px] w-[520px] rounded-full bg-[#e4b36a]/8 blur-[150px]" />
      <Navbar />

      <div className="mx-auto grid max-w-7xl gap-8 px-6 pb-16 pt-28 lg:grid-cols-[minmax(0,1fr)_330px] lg:px-10">
        <div className="flex flex-col gap-6">
          <section className="section-frame glass-panel rounded-[36px] p-6 sm:p-8">
            <div className="relative z-10 flex flex-col gap-8">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="max-w-3xl">
                  <div className="metal-label inline-flex rounded-full px-4 py-2 font-mono text-[10px] uppercase tracking-[0.32em] text-[#f1d6a0]/74">
                    Synthetic buyer pressure-testing
                  </div>
                  <h1 className="mt-5 max-w-3xl text-4xl leading-[0.95] text-[#f4efe4] sm:text-5xl">
                    Shape the wedge, survive the buyers, and watch the signal move for a reason.
                  </h1>
                  <p className="mt-5 max-w-2xl text-[15px] leading-8 text-white/56">
                    ExecuSim turns a rough B2B idea into a visibly staged decision loop:
                    strategy framing, buyer pushback, supervisor correction, and scored market signal.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 lg:self-center">
                  <StatusBadge status={status} />
                  <div className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 font-mono text-[11px] uppercase tracking-[0.22em] text-white/58">
                    {isDemoMode ? "Demo session" : "Live session"}
                  </div>
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-3">
                <StatCard label="Current phase" value={currentPhase} />
                <StatCard
                  label="Session"
                  value={simulationId ? simulationId.slice(0, 8).toUpperCase() : "Not started"}
                  muted={!simulationId}
                />
                <StatCard label="Rounds completed" value={`${roundsCompleted} / 3`} muted={roundsCompleted === 0} />
              </div>

              <div className="grid gap-3 lg:grid-cols-3">
                <SignalRibbon icon={Sparkles} title="Embodied buyers" body="Profiles, constraints, and typed objections instead of shallow personas." />
                <SignalRibbon icon={ShieldCheck} title="Trust-aware scoring" body="Readiness, clarity, and upside are visible as separate signals." />
                <SignalRibbon icon={Waves} title="Visible motion" body="Every round is legible: pushback, pivot, and score movement." />
              </div>

              {statusMessage ? (
                <div className="rounded-[26px] border border-[#f1d6a0]/14 bg-[#f1d6a0]/7 px-5 py-4">
                  <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#f1d6a0]/56">Live status</p>
                  <p className="mt-2 text-sm leading-7 text-[#f7ebd3]">{statusMessage}</p>
                </div>
              ) : null}

              {error ? (
                <div
                  data-testid="error-message"
                  className="rounded-[26px] border border-red-500/20 bg-red-500/6 px-5 py-5"
                >
                  <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-red-300/60">Run issue</p>
                  <p className="mt-2 text-sm leading-8 text-red-200/88">{error}</p>
                </div>
              ) : null}
            </div>
          </section>

          <DashboardPanel panelNumber={1} title="Idea Intake" tag="INPUT_" visible={panels.panel1} className="rounded-[34px] p-7">
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_260px]">
                <div className="rounded-[28px] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.015))] p-5">
                  <div className="flex items-center justify-between">
                    <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#f1d6a0]/42">Idea brief</p>
                    <span className="rounded-full border border-white/8 px-2.5 py-1 text-[11px] text-white/34">
                      {idea.length} chars
                    </span>
                  </div>
                  <textarea
                    data-testid="idea-input"
                    value={idea}
                    onChange={(e) => setIdea(e.target.value)}
                    placeholder="Describe your B2B idea in one sentence..."
                    className="mt-4 min-h-[152px] w-full resize-none bg-transparent text-[18px] leading-8 text-[#f4efe4] placeholder:text-white/22 focus:outline-none"
                    disabled={status === "running"}
                  />
                </div>

                <div className="rounded-[28px] border border-white/8 bg-white/[0.03] p-5">
                  <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#f1d6a0]/42">Run mode</p>
                  <div className="mt-4 space-y-3">
                    <Link
                      href="/simulate"
                      className={`block rounded-[20px] border px-4 py-3 text-sm transition-colors ${
                        !isDemoMode
                          ? "border-[#f1d6a0]/24 bg-[#f1d6a0]/8 text-[#f8e7c6]"
                          : "border-white/8 bg-[#141a23] text-white/56 hover:text-white/80"
                      }`}
                    >
                      Live run
                    </Link>
                    <Link
                      href="/simulate?demo=1"
                      className={`block rounded-[20px] border px-4 py-3 text-sm transition-colors ${
                        isDemoMode
                          ? "border-[#86b8c7]/26 bg-[#86b8c7]/10 text-[#d2eef5]"
                          : "border-white/8 bg-[#141a23] text-white/56 hover:text-white/80"
                      }`}
                    >
                      Demo mode
                    </Link>
                  </div>
                  <p className="mt-4 text-sm leading-7 text-white/46">
                    {isDemoMode
                      ? "Uses the prebuilt showcase scenario for clean panel progression."
                      : "Uses your live env keys and streams the run back into the workspace."}
                  </p>
                </div>
              </div>

              <div className="rounded-[28px] border border-white/8 bg-white/[0.03] p-5">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#f1d6a0]/42">Suggested prompts</p>
                  <p className="text-xs text-white/34">Use one as a starting wedge, then sharpen from there.</p>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {EXAMPLE_IDEAS.map((example) => (
                    <button
                      key={example}
                      type="button"
                      onClick={() => setIdea(example)}
                      className="rounded-full border border-white/10 bg-[#141a23] px-4 py-2 text-sm text-white/62 transition-colors hover:border-[#f1d6a0]/20 hover:bg-[#f1d6a0]/7 hover:text-[#f8e7c6]"
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
                  {status === "running" && !isDemoMode ? (
                    <button
                      type="button"
                      onClick={handleAbort}
                      className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#141a23] px-4 py-3 text-sm text-white/66 transition-colors hover:border-white/18 hover:text-white"
                    >
                      <Square className="h-4 w-4" />
                      Stop Run
                    </button>
                  ) : null}
                  <button
                    type="submit"
                    data-testid="submit-button"
                    disabled={!idea.trim() || status === "running"}
                    className="inline-flex items-center gap-2 rounded-full bg-[linear-gradient(90deg,#f0d7a8,#dba45f)] px-5 py-3 text-sm font-medium text-[#1a1208] transition-transform hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-35"
                  >
                    {isDemoMode ? <Play className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
                    {status === "running" ? "Simulation running..." : isDemoMode ? "Run Demo" : "Run Simulation"}
                  </button>
                </div>
              </div>
            </form>
          </DashboardPanel>

          <DashboardPanel panelNumber={2} title="Strategy Frame" tag="STRATEGY_AGT" visible={panels.panel2} className="rounded-[34px] p-7">
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

          <DashboardPanel panelNumber={3} title="Market Responses" tag="PERSONA_GRID" visible={panels.panel3} className="rounded-[34px] p-7">
            {personaRounds.length > 0 ? (
              <div className="flex flex-col gap-7">
                {personaRounds.map((round, index) => (
                  <div key={round.roundNumber}>
                    {personaRounds.length > 1 && index > 0 ? <div className="mb-6 border-t border-white/7" /> : null}
                    {personaRounds.length > 1 ? (
                      <div className="metal-label mb-4 inline-flex rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-[0.26em] text-[#f1d6a0]/70">
                        Round {round.roundNumber}
                      </div>
                    ) : null}
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

          <DashboardPanel panelNumber={4} title="Executive Decision" tag="EXEC_SUPV" visible={panels.panel4} className="rounded-[34px] p-7">
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

          <DashboardPanel panelNumber={5} title="Signal Readout" tag="SCORE_OUT" visible={panels.panel5} className="rounded-[34px] p-7">
            {validationScore !== null &&
            adoptionRate !== null &&
            buyerReadinessScore !== null &&
            gtmClarityScore !== null &&
            ventureUpsideSignal !== null &&
            scoreSummary ? (
              <ScoreDisplay
                validationScore={validationScore}
                adoptionRate={adoptionRate}
                buyerReadinessScore={buyerReadinessScore}
                gtmClarityScore={gtmClarityScore}
                ventureUpsideSignal={ventureUpsideSignal}
                scoreSummary={scoreSummary}
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
            <section className="section-frame glass-panel rounded-[30px] p-5">
              <div className="relative z-10 flex items-center justify-between">
                <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#f1d6a0]/42">Run progress</p>
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] text-white/48">
                  {status === "ready" ? "Idle" : status === "running" ? "Active" : status}
                </span>
              </div>
              <div className="relative z-10 mt-5 flex flex-col gap-4">
                {RUN_STEPS.map((step) => {
                  const Icon = step.icon
                  const state = stepState(step.key, panels, status)
                  return (
                    <div key={step.key} className="flex items-start gap-3 rounded-[20px] border border-white/6 bg-white/[0.02] p-3">
                      <div
                        className={`mt-0.5 flex h-10 w-10 items-center justify-center rounded-2xl border ${
                          state === "complete"
                            ? "border-[#86b8c7]/26 bg-[#86b8c7]/10 text-[#d2eef5]"
                            : state === "active"
                            ? "border-[#f1d6a0]/24 bg-[#f1d6a0]/10 text-[#f8e7c6]"
                            : "border-white/8 bg-[#141a23] text-white/38"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className={`${state === "idle" ? "text-white/44" : "text-[#f4efe4]"} text-sm`}>
                          {step.title}
                        </p>
                        <p className="mt-1 text-sm leading-6 text-white/42">{step.detail}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>

            <section className="section-frame glass-panel rounded-[30px] p-5">
              <div className="relative z-10">
                <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#f1d6a0]/42">Operator notes</p>
                <div className="mt-4 space-y-4">
                  <div className="rounded-[22px] border border-white/8 bg-white/[0.03] p-4">
                    <p className="text-sm text-[#f4efe4]">Best demo path</p>
                    <p className="mt-2 text-sm leading-7 text-white/48">
                      Use demo mode when you want reliable progression and a controlled narrative for a pitch or recording.
                    </p>
                  </div>
                  <div className="rounded-[22px] border border-white/8 bg-white/[0.03] p-4">
                    <p className="text-sm text-[#f4efe4]">Best live path</p>
                    <p className="mt-2 text-sm leading-7 text-white/48">
                      Keep inputs B2B and wedge-shaped. The stronger the target segment, the better the buyer realism.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </aside>
      </div>
    </main>
  )
}
