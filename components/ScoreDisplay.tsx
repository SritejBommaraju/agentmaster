"use client"

import { useEffect, useState } from "react"

interface ScoreDisplayProps {
  validationScore: number
  adoptionRate: number
  buyerReadinessScore: number
  gtmClarityScore: number
  ventureUpsideSignal: number
  scoreSummary: string
  roundsCompleted: number
  failureReason: string | null
}

type Signal = "proceed" | "weak" | "none"

function getSignal(score: number): Signal {
  if (score >= 0.75) return "proceed"
  if (score >= 0.5) return "weak"
  return "none"
}

const SIGNAL_META: Record<Signal, { label: string; color: string }> = {
  proceed: { label: "PROCEED", color: "text-white" },
  weak: { label: "PROMISING BUT SOFT", color: "text-amber-300/90" },
  none: { label: "NOT READY", color: "text-red-300/80" },
}

function useCountUp(target: number, duration = 1400): number {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const steps = 56
    const increment = target / steps
    let step = 0
    const id = setInterval(() => {
      step += 1
      setCurrent(Math.min(Math.round(increment * step), target))
      if (step >= steps) clearInterval(id)
    }, duration / steps)
    return () => clearInterval(id)
  }, [target, duration])

  return current
}

function MetricCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
      <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-white/28">{label}</p>
      <p className="mt-3 text-2xl font-light text-white">{Math.round(value * 100)}%</p>
    </div>
  )
}

export function ScoreDisplay({
  validationScore,
  adoptionRate,
  buyerReadinessScore,
  gtmClarityScore,
  ventureUpsideSignal,
  scoreSummary,
  roundsCompleted,
  failureReason,
}: ScoreDisplayProps) {
  const pct = Math.round(validationScore * 100)
  const signal = getSignal(validationScore)
  const meta = SIGNAL_META[signal]
  const displayed = useCountUp(pct)

  return (
    <div data-testid="score-display" className="flex flex-col gap-5">
      <div className="flex items-end justify-between gap-4">
        <div className="flex items-baseline gap-2">
          <span data-testid="score-value" className="text-5xl font-light tabular-nums text-white">
            {displayed}
          </span>
          <span className="text-xl font-light text-white/30">%</span>
        </div>
        <span data-testid="signal-label" className={`pb-1 font-mono text-[11px] uppercase tracking-widest ${meta.color}`}>
          {meta.label}
        </span>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <MetricCard label="Buyer readiness" value={buyerReadinessScore} />
        <MetricCard label="GTM clarity" value={gtmClarityScore} />
        <MetricCard label="Venture upside" value={ventureUpsideSignal} />
      </div>

      <div className="flex gap-6">
        <div className="flex flex-col gap-0.5">
          <p className="font-mono text-[10px] uppercase tracking-widest text-white/30">Adoption Rate</p>
          <p className="text-sm text-white/70">{Math.round(adoptionRate * 100)}%</p>
        </div>
        <div className="flex flex-col gap-0.5">
          <p className="font-mono text-[10px] uppercase tracking-widest text-white/30">Rounds</p>
          <p className="text-sm text-white/70">{roundsCompleted} / 3</p>
        </div>
      </div>

      <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-white/28">Why the score moved</p>
        <p className="mt-2 text-sm leading-7 text-white/62">{scoreSummary}</p>
      </div>

      {failureReason ? (
        <div className="rounded-xl border border-red-500/15 bg-red-500/5 px-4 py-3">
          <p className="mb-1.5 font-mono text-[10px] uppercase tracking-widest text-red-400/60">Validation failed</p>
          <p className="text-sm leading-relaxed text-red-300/88">{failureReason}</p>
        </div>
      ) : null}
    </div>
  )
}
