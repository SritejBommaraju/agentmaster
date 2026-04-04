"use client"

import { cn } from "@/lib/utils"

export type SimulationStatus = "ready" | "running" | "complete" | "failed"

interface StatusBadgeProps {
  status: SimulationStatus
}

const LABELS: Record<SimulationStatus, string> = {
  ready: "System Ready",
  running: "Simulation Live",
  complete: "Signal Captured",
  failed: "Needs Attention",
}

const STYLES: Record<SimulationStatus, string> = {
  ready: "border-white/12 bg-white/[0.04] text-white/74",
  running: "border-[#f1d6a0]/30 bg-[#f1d6a0]/10 text-[#f8e7c6]",
  complete: "border-[#86b8c7]/28 bg-[#86b8c7]/10 text-[#d2eef5]",
  failed: "border-red-400/20 bg-red-400/8 text-red-200/88",
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <div
      data-testid="status-badge"
      data-status={status}
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-4 py-2",
        "font-mono text-[11px] font-medium uppercase tracking-[0.28em]",
        STYLES[status]
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          status === "running" ? "bg-[#f2d39a] pulse-dot" : status === "complete" ? "bg-[#86b8c7]" : status === "failed" ? "bg-red-300" : "bg-white/50"
        )}
        aria-hidden="true"
      />
      <span>{LABELS[status]}</span>
    </div>
  )
}
