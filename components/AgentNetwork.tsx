"use client"

import { AgentCard } from "./AgentCard"

export function AgentNetwork() {
  return (
    <div
      data-testid="agent-network"
      className="relative flex h-[500px] w-full items-center justify-center"
    >
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        aria-hidden="true"
      >
        {/* Strategy -> persona row */}
        <line x1="50%" y1="27%" x2="22%" y2="62%" stroke="rgba(255,255,255,0.12)" strokeWidth="1" strokeDasharray="6 4" />
        <line x1="50%" y1="27%" x2="50%" y2="62%" stroke="rgba(255,255,255,0.12)" strokeWidth="1" strokeDasharray="6 4" />
        <line x1="50%" y1="27%" x2="78%" y2="62%" stroke="rgba(255,255,255,0.12)" strokeWidth="1" strokeDasharray="6 4" />

        {/* Persona row -> supervisor */}
        <line x1="22%" y1="68%" x2="50%" y2="91%" stroke="rgba(255,255,255,0.12)" strokeWidth="1" strokeDasharray="6 4" />
        <line x1="50%" y1="68%" x2="50%" y2="91%" stroke="rgba(255,255,255,0.12)" strokeWidth="1" strokeDasharray="6 4" />
        <line x1="78%" y1="68%" x2="50%" y2="91%" stroke="rgba(255,255,255,0.12)" strokeWidth="1" strokeDasharray="6 4" />

        {/* Supervisor -> output */}
        <line x1="50%" y1="100%" x2="50%" y2="100%" stroke="rgba(255,255,255,0.12)" strokeWidth="1" strokeDasharray="6 4" />
      </svg>

      <div className="absolute left-[50%] top-[7%] -translate-x-1/2">
        <AgentCard label="STRATEGY_AGT" floatClass="float-strategy" dotColor="#ffffff" />
      </div>

      <div className="absolute left-[22%] top-[53%] -translate-x-1/2">
        <AgentCard label="PERSONA_EARLY" floatClass="float-early" dotColor="#a0a0a0" />
      </div>
      <div className="absolute left-[50%] top-[53%] -translate-x-1/2">
        <AgentCard label="PERSONA_GROWTH" floatClass="float-growth" dotColor="#a0a0a0" />
      </div>
      <div className="absolute left-[78%] top-[53%] -translate-x-1/2">
        <AgentCard label="PERSONA_MIDMKT" floatClass="float-midmkt" dotColor="#a0a0a0" />
      </div>

      <div className="absolute left-[50%] top-[91%] -translate-x-1/2">
        <AgentCard label="EXEC_SUPV" floatClass="float-supv" dotColor="#ffffff" />
      </div>
    </div>
  )
}
