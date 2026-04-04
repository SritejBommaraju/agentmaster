"use client"

import { PivotDecision } from "@/lib/types"
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
  trust: "Trust",
  workflow: "Workflow",
  both: "Pricing + Messaging",
  none: "None",
}

function DetailCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-3">
      <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-white/28">{label}</p>
      <p className="mt-2 text-sm leading-6 text-white/66">{value}</p>
    </div>
  )
}

function RoundDecision({ round }: { round: SupervisorRound }) {
  const { roundNumber, decision } = round
  const pivoted = decision.should_pivot

  return (
    <div data-testid={`supervisor-round-${roundNumber}`} className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${pivoted ? "bg-amber-400" : "bg-white/40"}`} aria-hidden="true" />
        <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-white/30">After Round {roundNumber}</span>
        <span className={`ml-auto font-mono text-[10px] uppercase tracking-[0.24em] ${pivoted ? "text-amber-300/90" : "text-white/30"}`}>
          {pivoted ? `Pivot -> ${PIVOT_TYPE_LABEL[decision.pivot_type]}` : "No Pivot"}
        </span>
      </div>

      <p className="text-sm leading-7 text-white/68">{decision.pivot_rationale}</p>

      <div className="grid gap-3 sm:grid-cols-3">
        <DetailCard label="Failure mode" value={decision.primary_failure_mode} />
        <DetailCard label="Highest-risk segment" value={decision.highest_risk_segment} />
        <DetailCard label="Confidence note" value={decision.confidence_note} />
      </div>

      {pivoted && (
        <div className="rounded-[22px] border border-white/7 bg-[#141414] p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-white/30">Updated strategy</p>
            {decision.should_run_round_three ? (
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-amber-300/80">Round 3 eligible</span>
            ) : null}
          </div>
          <div className="mt-3">
            <StrategyDisplay strategy={decision.updated_strategy} />
          </div>
        </div>
      )}
    </div>
  )
}

export function SupervisorDisplay({ rounds }: SupervisorDisplayProps) {
  return (
    <div data-testid="supervisor-display" className="flex flex-col gap-5">
      {rounds.map((round, index) => (
        <div key={round.roundNumber}>
          {index > 0 ? <div className="-mt-1 mb-5 border-t border-white/7" /> : null}
          <RoundDecision round={round} />
        </div>
      ))}
    </div>
  )
}
