"use client"

import { cn } from "@/lib/utils"

export interface DashboardPanelProps {
  panelNumber: number
  title: string
  tag: string
  visible: boolean
  children?: React.ReactNode
  className?: string
}

export function DashboardPanel({
  panelNumber,
  title,
  tag,
  visible,
  children,
  className,
}: DashboardPanelProps) {
  if (!visible) return null

  return (
    <div
      data-testid={`panel-${panelNumber}`}
      className={cn(
        "section-frame glass-panel fade-in-up rounded-[32px] p-6 sm:p-7",
        className
      )}
    >
      <div className="relative z-10 mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.34em] text-[#f1d6a0]/52">Panel {panelNumber}</p>
          <h2 className="mt-2 text-[1.55rem] leading-none text-[#f4efe4]">{title}</h2>
        </div>
        <span className="metal-label rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-[0.26em] text-[#f1d6a0]/74">
          {tag}
        </span>
      </div>
      <div className="relative z-10 text-sm text-white/60">
        {children ?? (
          <div className="space-y-2">
            <div className="h-2 w-full rounded bg-white/10" />
            <div className="h-2 w-3/4 rounded bg-white/10" />
            <div className="h-2 w-1/2 rounded bg-white/10" />
          </div>
        )}
      </div>
    </div>
  )
}
