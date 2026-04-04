"use client"

import { useEffect, useState } from "react"

interface ScoreDisplayProps {
  validationScore: number   // 0–1
  adoptionRate: number      // 0–1
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
  weak:    { label: "WEAK SIGNAL", color: "text-amber-400/90" },
  none:    { label: "NO SIGNAL", color: "text-red-400/80" },
}

function useCountUp(target: number, duration = 1400): number {
  const [current, setCurrent] = useState(0)
  useEffect(() => {
    const steps = 56
    const increment = target / steps
    let step = 0
    const id = setInterval(() => {
      step++
      setCurrent(Math.min(Math.round(increment * step), target))
      if (step >= steps) clearInterval(id)
    }, duration / steps)
    return () => clearInterval(id)
  }, [target, duration])
  return current
}

export function ScoreDisplay({
  validationScore,
  adoptionRate,
  roundsCompleted,
  failureReason,
}: ScoreDisplayProps) {
  const pct = Math.round(validationScore * 100)
  const adoptionPct = Math.round(adoptionRate * 100)
  const signal = getSignal(validationScore)
  const meta = SIGNAL_META[signal]
  const displayed = useCountUp(pct)

  return (
    <div data-testid="score-display" className="flex flex-col gap-5">
      {/* Score + signal */}
      <div className="flex items-end justify-between gap-4">
        <div className="flex items-baseline gap-2">
          <span
            data-testid="score-value"
            className="text-5xl font-light text-white tabular-nums"
          >
            {displayed}
          </span>
          <span className="text-white/30 text-xl font-light">%</span>
        </div>
        <span
          data-testid="signal-label"
          className={`font-mono text-[11px] tracking-widest uppercase pb-1 ${meta.color}`}
        >
          {meta.label}
        </span>
      </div>

      {/* Stats row */}
      <div className="flex gap-6">
        <div className="flex flex-col gap-0.5">
          <p className="font-mono text-[10px] tracking-widest text-white/30 uppercase">Adoption Rate</p>
          <p className="text-white/70 text-sm">{adoptionPct}%</p>
        </div>
        <div className="flex flex-col gap-0.5">
          <p className="font-mono text-[10px] tracking-widest text-white/30 uppercase">Rounds</p>
          <p className="text-white/70 text-sm">{roundsCompleted} / 3</p>
        </div>
      </div>

      {/* Failure path */}
      {failureReason && (
        <div className="rounded-xl border border-red-500/15 bg-red-500/5 px-4 py-3">
          <p className="font-mono text-[10px] tracking-widest text-red-400/60 uppercase mb-1.5">
            Validation Failed
          </p>
          <p className="text-red-400/80 text-sm leading-relaxed">{failureReason}</p>
        </div>
      )}
    </div>
  )
}
