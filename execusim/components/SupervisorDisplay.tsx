"use client"

import { PivotDecision, Strategy } from "@/lib/types"
import { StrategyDisplay } from "@/components/StrategyDisplay"

interface SupervisorRound {
  roundNumber: number
  decision: PivotDecision
}

interface SupervisorDisplayProps {
  rounds: SupervisorRound[]
}

const PIVOT_TYPE_LABEL: Record<string, string> = {
  pricing: "Pricing",
  messaging: "Messaging",
  icp: "ICP",
  both: "Pricing + Messaging",
  none: "None",
}

function RoundDecision({ round }: { round: SupervisorRound }) {
  const { roundNumber, decision } = round
  const pivoted = decision.should_pivot

  return (
    <div
      data-testid={`supervisor-round-${roundNumber}`}
      className="flex flex-col gap-3"
    >
      <div className="flex items-center gap-2">
        <span
          className={`w-1.5 h-1.5 rounded-full shrink-0 ${pivoted ? "bg-amber-400" : "bg-white/40"}`}
          aria-hidden="true"
        />
        <span className="font-mono text-[10px] tracking-widest text-white/30 uppercase">
          After Round {roundNumber}
        </span>
        <span
          className={`ml-auto font-mono text-[10px] tracking-widest uppercase ${
            pivoted ? "text-amber-400/80" : "text-white/30"
          }`}
        >
          {pivoted ? `Pivot → ${PIVOT_TYPE_LABEL[decision.pivot_type]}` : "No Pivot"}
        </span>
      </div>

      <p className="text-white/65 text-sm leading-relaxed">{decision.pivot_rationale}</p>

      {pivoted && (
        <div className="mt-1 rounded-xl border border-white/7 bg-[#141414] p-4">
          <p className="font-mono text-[10px] tracking-widest text-white/30 uppercase mb-3">
            Updated Strategy
          </p>
          <StrategyDisplay strategy={decision.updated_strategy} />
        </div>
      )}
    </div>
  )
}

export function SupervisorDisplay({ rounds }: SupervisorDisplayProps) {
  return (
    <div data-testid="supervisor-display" className="flex flex-col gap-5">
      {rounds.map((round, i) => (
        <div key={round.roundNumber}>
          {i > 0 && <div className="border-t border-white/7 -mt-1 mb-5" />}
          <RoundDecision round={round} />
        </div>
      ))}
    </div>
  )
}
