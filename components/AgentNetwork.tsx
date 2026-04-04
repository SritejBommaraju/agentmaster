"use client"

import { AgentCard } from "./AgentCard"

export function AgentNetwork() {
  return (
    <div
      data-testid="agent-network"
      className="relative w-full h-[500px] flex items-center justify-center"
    >
      {/* SVG dashed connection lines */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        aria-hidden="true"
      >
        {/* Strategy → Early */}
        <line x1="50%" y1="22%" x2="22%" y2="48%" stroke="rgba(255,255,255,0.12)" strokeWidth="1" strokeDasharray="6 4" />
        {/* Strategy → Growth */}
        <line x1="50%" y1="22%" x2="50%" y2="48%" stroke="rgba(255,255,255,0.12)" strokeWidth="1" strokeDasharray="6 4" />
        {/* Strategy → Mid-Market */}
        <line x1="50%" y1="22%" x2="78%" y2="48%" stroke="rgba(255,255,255,0.12)" strokeWidth="1" strokeDasharray="6 4" />
        {/* Early → Supervisor */}
        <line x1="22%" y1="62%" x2="50%" y2="76%" stroke="rgba(255,255,255,0.12)" strokeWidth="1" strokeDasharray="6 4" />
        {/* Growth → Supervisor */}
        <line x1="50%" y1="62%" x2="50%" y2="76%" stroke="rgba(255,255,255,0.12)" strokeWidth="1" strokeDasharray="6 4" />
        {/* Mid-Market → Supervisor */}
        <line x1="78%" y1="62%" x2="50%" y2="76%" stroke="rgba(255,255,255,0.12)" strokeWidth="1" strokeDasharray="6 4" />
        {/* Supervisor → Score */}
        <line x1="50%" y1="88%" x2="50%" y2="95%" stroke="rgba(255,255,255,0.12)" strokeWidth="1" strokeDasharray="6 4" />
      </svg>

      {/* Strategy — top center */}
      <div className="absolute top-[4%] left-1/2 -translate-x-1/2">
        <AgentCard label="STRATEGY_AGT" floatClass="float-strategy" dotColor="#ffffff" />
      </div>

      {/* Persona row */}
      <div className="absolute top-[38%] left-[8%]">
        <AgentCard label="PERSONA_EARLY" floatClass="float-early" dotColor="#a0a0a0" />
      </div>
      <div className="absolute top-[38%] left-1/2 -translate-x-1/2">
        <AgentCard label="PERSONA_GROWTH" floatClass="float-growth" dotColor="#a0a0a0" />
      </div>
      <div className="absolute top-[38%] right-[8%]">
        <AgentCard label="PERSONA_MIDMKT" floatClass="float-midmkt" dotColor="#a0a0a0" />
      </div>

      {/* Supervisor */}
      <div className="absolute top-[68%] left-1/2 -translate-x-1/2">
        <AgentCard label="EXEC_SUPV" floatClass="float-supv" dotColor="#ffffff" />
      </div>
    </div>
  )
}
