"use client"

import { cn } from "@/lib/utils"

export interface AgentCardProps {
  label: string
  floatClass: string
  active?: boolean
  dimmed?: boolean
  dotColor?: string
  children?: React.ReactNode
  className?: string
}

export function AgentCard({
  label,
  floatClass,
  active = false,
  dimmed = false,
  dotColor = "#ffffff",
  children,
  className,
}: AgentCardProps) {
  return (
    <div className={cn("flex flex-col items-center gap-2.5", floatClass, className)}>
      <div
        data-testid="agent-card"
        className={cn(
          "relative rounded-2xl p-4 w-44 min-h-[88px]",
          "border transition-all duration-300",
          active
            ? "border-white/15 bg-[#2a2a2a]"
            : "border-white/7 bg-[#1e1e1e]",
          dimmed && "opacity-50"
        )}
      >
        <div className="flex items-center gap-2 mb-3">
          <span
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ backgroundColor: dotColor }}
          />
          {children ? (
            children
          ) : (
            <>
              <div className="h-2 rounded bg-white/10 flex-1" />
              <div className="h-2 rounded bg-white/10 w-2/3" />
            </>
          )}
        </div>
        <div className="space-y-1.5">
          <div className="h-1.5 rounded bg-white/8 w-full" />
          <div className="h-1.5 rounded bg-white/8 w-3/4" />
        </div>
      </div>
      <span
        data-testid="agent-label"
        className="font-mono text-[10px] font-medium leading-none tracking-widest text-white/40 uppercase"
        style={{ textShadow: "0 0 10px rgba(13,17,23,0.95), 0 0 18px rgba(13,17,23,0.95)" }}
      >
        {label}
      </span>
    </div>
  )
}
