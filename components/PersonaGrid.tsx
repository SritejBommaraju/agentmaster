"use client"

import { PersonaResponse, PersonaStage } from "@/lib/types"

interface PersonaGridProps {
  personas: PersonaResponse[]
}

const STAGE_META: Record<PersonaStage, { label: string; tag: string }> = {
  stage_early: { label: "Early Stage", tag: "1–20 people" },
  stage_growth: { label: "Growth Stage", tag: "20–150 people" },
  stage_mid_market: { label: "Mid-Market", tag: "150–500 people" },
}

function InterestBar({ score }: { score: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1 rounded-full bg-white/10 overflow-hidden">
        <div
          className="h-full rounded-full bg-white/60"
          style={{ width: `${(score / 10) * 100}%` }}
        />
      </div>
      <span className="font-mono text-[11px] text-white/40">{score}/10</span>
    </div>
  )
}

function PersonaCard({ persona }: { persona: PersonaResponse }) {
  const meta = STAGE_META[persona.persona]
  const likelihoodPct = Math.round(persona.likelihood * 100)

  return (
    <div
      data-testid={`persona-card-${persona.persona}`}
      className="flex flex-col gap-3 rounded-xl border border-white/7 bg-[#141414] p-4"
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-white/90 text-sm font-medium">{meta.label}</p>
          <p className="font-mono text-[10px] tracking-widest text-white/30 uppercase mt-0.5">
            {meta.tag}
          </p>
        </div>
        <span className="font-mono text-[11px] text-white/50 shrink-0 pt-0.5">
          {likelihoodPct}% likely
        </span>
      </div>

      <InterestBar score={persona.interest_score} />

      <div className="flex flex-col gap-0.5">
        <p className="font-mono text-[10px] tracking-widest text-white/30 uppercase">WTP</p>
        <p className="text-white/70 text-sm">{persona.willingness_to_pay}</p>
      </div>

      <div className="flex flex-col gap-1.5">
        <p className="font-mono text-[10px] tracking-widest text-white/30 uppercase">Objections</p>
        <ul className="flex flex-col gap-1">
          {persona.objections.map((obj, i) => (
            <li key={i} className="flex gap-2 text-sm text-white/55 leading-snug">
              <span className="text-white/20 shrink-0 select-none">—</span>
              {obj}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export function PersonaGrid({ personas }: PersonaGridProps) {
  return (
    <div data-testid="persona-grid" className="flex flex-col gap-3">
      {personas.map((p) => (
        <PersonaCard key={p.persona} persona={p} />
      ))}
    </div>
  )
}
