"use client"

import { PersonaResponse, PersonaStage, StructuredObjection } from "@/lib/types"

interface PersonaGridProps {
  personas: PersonaResponse[]
}

const STAGE_META: Record<PersonaStage, { label: string; tag: string }> = {
  stage_early: { label: "Early Stage", tag: "1-20 people" },
  stage_growth: { label: "Growth Stage", tag: "20-150 people" },
  stage_mid_market: { label: "Mid-Market", tag: "150-500 people" },
}

const SEVERITY_STYLES: Record<StructuredObjection["severity"], string> = {
  low: "border-white/10 bg-white/[0.03] text-white/62",
  medium: "border-amber-400/20 bg-amber-400/8 text-amber-200/88",
  high: "border-red-400/20 bg-red-400/8 text-red-200/88",
}

function InterestBar({ score }: { score: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/10">
        <div className="h-full rounded-full bg-white/60" style={{ width: `${(score / 10) * 100}%` }} />
      </div>
      <span className="font-mono text-[11px] text-white/40">{score}/10</span>
    </div>
  )
}

function ObjectionChip({ objection }: { objection: StructuredObjection }) {
  return (
    <div className={`rounded-2xl border px-3 py-2 text-sm leading-6 ${SEVERITY_STYLES[objection.severity]}`}>
      <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em]">
        <span>{objection.category}</span>
        <span>{objection.severity}</span>
        <span>{objection.blocking ? "blocker" : "signal"}</span>
      </div>
      <p className="mt-1 font-sans normal-case tracking-normal">{objection.text}</p>
    </div>
  )
}

function PersonaCard({ persona }: { persona: PersonaResponse }) {
  const meta = STAGE_META[persona.persona]
  const likelihoodPct = Math.round(persona.likelihood * 100)

  return (
    <div data-testid={`persona-card-${persona.persona}`} className="rounded-[22px] border border-white/7 bg-[#141414] p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-white/90">{meta.label}</p>
          <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.24em] text-white/30">{meta.tag}</p>
        </div>
        <div className="text-right">
          <p className="font-mono text-[11px] text-white/48">{likelihoodPct}% likely</p>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.22em] text-white/28">
            {persona.buyer_profile.role}
          </p>
        </div>
      </div>

      <div className="mt-4">
        <InterestBar score={persona.interest_score} />
      </div>

      <p className="mt-4 text-sm leading-7 text-white/66">{persona.evaluation_summary}</p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-white/28">Buyer profile</p>
          <p className="mt-2 text-sm text-white/70">
            {persona.buyer_profile.role} | {persona.buyer_profile.company_size}
          </p>
          <p className="mt-1 text-sm text-white/48">
            Authority: {persona.buyer_profile.decision_authority} | Budget: {persona.buyer_profile.budget_tolerance}
          </p>
          <p className="mt-3 text-sm text-white/48">
            Stack: {persona.buyer_profile.current_stack.join(", ")}
          </p>
        </div>
        <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-white/28">Constraints</p>
          <p className="mt-2 text-sm text-white/48">{persona.buyer_profile.procurement_friction}</p>
          <p className="mt-3 text-sm text-white/48">WTP: {persona.willingness_to_pay}</p>
          <p className="mt-1 text-sm text-white/48">
            Trust: {persona.trust_signal} | Procurement: {persona.procurement_intensity}
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-white/28">Objections</p>
        {persona.objections.map((objection, index) => (
          <ObjectionChip key={`${persona.persona}-${index}`} objection={objection} />
        ))}
      </div>
    </div>
  )
}

export function PersonaGrid({ personas }: PersonaGridProps) {
  return (
    <div data-testid="persona-grid" className="flex flex-col gap-4">
      {personas.map((persona) => (
        <PersonaCard key={persona.persona} persona={persona} />
      ))}
    </div>
  )
}
