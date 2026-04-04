"use client"

import { Strategy } from "@/lib/types"

interface StrategyDisplayProps {
  strategy: Strategy
}

const FIELDS: { key: keyof Strategy; label: string }[] = [
  { key: "icp", label: "ICP" },
  { key: "pricing", label: "Pricing" },
  { key: "messaging", label: "Messaging" },
  { key: "hypothesis", label: "Hypothesis" },
]

export function StrategyDisplay({ strategy }: StrategyDisplayProps) {
  return (
    <dl
      data-testid="strategy-display"
      className="flex flex-col gap-3"
    >
      {FIELDS.map(({ key, label }) => (
        <div key={key} className="flex flex-col gap-0.5">
          <dt className="font-mono text-[10px] tracking-widest text-white/30 uppercase">
            {label}
          </dt>
          <dd
            data-testid={`strategy-${key}`}
            className="text-white/80 text-sm leading-relaxed"
          >
            {strategy[key]}
          </dd>
        </div>
      ))}
    </dl>
  )
}
