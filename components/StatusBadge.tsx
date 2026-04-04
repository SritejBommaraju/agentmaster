"use client"

import { cn } from "@/lib/utils"

export type SimulationStatus = "ready" | "running" | "complete" | "failed"

interface StatusBadgeProps {
  status: SimulationStatus
}

const LABELS: Record<SimulationStatus, string> = {
  ready: "SIMULATION READY_",
  running: "RUNNING_",
  complete: "COMPLETE_",
  failed: "FAILED_",
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <div
      data-testid="status-badge"
      data-status={status}
      className={cn(
        "inline-flex items-center gap-2 px-3 py-1.5 rounded-full",
        "border border-white/10 bg-[#1e1e1e]",
        "font-mono text-[11px] font-medium tracking-widest text-white/70 uppercase"
      )}
    >
      {status === "running" && (
        <span className="w-1.5 h-1.5 rounded-full bg-white pulse-dot" aria-hidden="true" />
      )}
      <span>{LABELS[status]}</span>
    </div>
  )
}
