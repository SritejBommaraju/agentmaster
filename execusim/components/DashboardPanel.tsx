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
        "rounded-2xl border border-white/7 bg-[#1e1e1e] p-6 fade-in-up",
        className
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-white text-sm font-medium">{title}</h2>
        <span className="font-mono text-[10px] tracking-widest text-white/30 uppercase">
          {tag}
        </span>
      </div>
      <div className="text-white/60 text-sm">
        {children ?? (
          <div className="space-y-2">
            <div className="h-2 rounded bg-white/10 w-full" />
            <div className="h-2 rounded bg-white/10 w-3/4" />
            <div className="h-2 rounded bg-white/10 w-1/2" />
          </div>
        )}
      </div>
    </div>
  )
}
