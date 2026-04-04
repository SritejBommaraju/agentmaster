import { Strategy, PersonaResponse, PivotDecision } from "@/lib/types"
import { computeScore } from "@/lib/scoring"

export const DEMO_IDEA = "AI compliance automation tool for fintech"

// ─── Round 1 ─────────────────────────────────────────────────────────────────

const demoStrategy: Strategy = {
  icp: "Mid-market fintech ops and compliance teams at Series B+ companies (150–400 employees) with dedicated RegOps roles",
  pricing: "$500/month per seat, annual contract required",
  messaging: "Automate your compliance workflow — reduce audit prep time by 60%",
  hypothesis:
    "Fintech companies are spending 15+ hours per week on manual compliance tasks and will pay a premium to automate them",
}

const demoRound1: PersonaResponse[] = [
  {
    persona: "stage_early",
    interest_score: 6,
    objections: [
      "$500/month is too steep for our team right now — we'd need a starter tier or free trial",
      "Are you SOC 2 compliant? Our investors will ask before we sign anything",
      "We need it to work out of the box — no lengthy implementation",
    ],
    likelihood: 0.45,
    willingness_to_pay: "$99–$199/month with a free trial",
  },
  {
    persona: "stage_growth",
    interest_score: 5,
    objections: [
      "The ROI story isn't tight enough — I need a number I can take to my CFO",
      "How does this integrate with our existing compliance stack? We use Vanta and Drata",
      "What does implementation actually look like — how long until we see value?",
    ],
    likelihood: 0.38,
    willingness_to_pay: "$300–$400/month once integration is confirmed",
  },
  {
    persona: "stage_mid_market",
    interest_score: 3,
    objections: [
      "We can't start a conversation without SOC 2 Type II — legal will block it immediately",
      "Who are your reference customers at our scale? We need to talk to someone like us",
      "Our procurement process takes 90 days minimum — do you support enterprise contracts?",
      "Implementation risk is high — show me your onboarding track record",
    ],
    likelihood: 0.2,
    willingness_to_pay: "$800–$1,200/month if compliance certifications and references are in place",
  },
]

// ─── Pivot ────────────────────────────────────────────────────────────────────

const demoPivot: PivotDecision = {
  should_pivot: true,
  pivot_type: "messaging",
  pivot_rationale:
    "Mid-market is the stated ICP but the pitch doesn't address their actual buying criteria — SOC 2 certification and reference customers. The messaging focuses on efficiency when procurement needs proof of security readiness first. Pivot: lead with compliance certification status, restructure pricing to add a growth tier at $299/month, and anchor messaging in audit-readiness.",
  updated_strategy: {
    icp: "Mid-market fintech compliance directors (150–400 employees) preparing for SOC 2 certification or operating in a regulated environment with manual audit workflows",
    pricing: "$299/month growth tier (20–100 employees) | $600/month enterprise tier (100+ employees), annual contract",
    messaging:
      "SOC 2 ready from day one — automate compliance reporting and cut audit prep from weeks to hours",
    hypothesis:
      "Fintech companies in the 150–400 employee range are actively pursuing SOC 2 Type II and will pay a premium for a tool that ships audit-ready documentation out of the box",
  },
}

// ─── Round 2 ─────────────────────────────────────────────────────────────────

const demoRound2: PersonaResponse[] = [
  {
    persona: "stage_early",
    interest_score: 7,
    objections: [
      "The $299 growth tier is much more approachable — we could pilot it",
      "Still need to confirm SOC 2 certification before we sign",
    ],
    likelihood: 0.6,
    willingness_to_pay: "$299/month on a monthly contract first",
  },
  {
    persona: "stage_growth",
    interest_score: 6,
    objections: [
      "Leading with SOC 2 readiness is more compelling for our compliance team",
      "Need to validate the integration with our existing Vanta setup before committing",
    ],
    likelihood: 0.55,
    willingness_to_pay: "$400–$600/month once integration is confirmed",
  },
  {
    persona: "stage_mid_market",
    interest_score: 6,
    objections: [
      "The SOC 2 angle opens the door — now we can start an internal conversation",
      "Still need two reference customers at our scale before procurement will move",
    ],
    likelihood: 0.5,
    willingness_to_pay: "$800/month with a 90-day pilot option",
  },
]

// Supervisor concludes no pivot needed — signals improved enough to score
const demoPivot2: PivotDecision = {
  should_pivot: false,
  pivot_type: "none",
  pivot_rationale:
    "Round 2 shows meaningful improvement across all segments after the messaging pivot. Mid-market likelihood more than doubled. Signal is sufficient to compute a validation score.",
  updated_strategy: demoPivot.updated_strategy,
}

// ─── Score ────────────────────────────────────────────────────────────────────

// Pre-computed from computeScore(demoRound2) so the demo doesn't need to call the server
// Round2: early 0.60, growth 0.55, mid 0.50
// Weights: early 1.0, growth 1.2, mid 1.5 → total 3.7
// Weighted likelihood = (0.60 + 0.66 + 0.75) / 3.7 = 2.01 / 3.7 = 0.5432
// All >= 0.5 → adoption_rate = 1.0
// Score = 0.5432 × 0.6 + 1.0 × 0.4 = 0.7259 → 72%
const demoScore = computeScore(demoRound2)

// ─── Event sequence ───────────────────────────────────────────────────────────

export interface DemoEvent {
  event: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any
  /** Delay in ms BEFORE emitting this event */
  delay: number
}

export function getDemoEvents(): DemoEvent[] {
  return [
    { event: "start",         data: { simulation_id: "demo-sim-0001" },                                         delay: 400  },
    { event: "strategy",      data: { strategy: demoStrategy },                                                  delay: 2000 },
    { event: "round_personas",data: { roundNumber: 1, personas: demoRound1 },                                   delay: 3500 },
    { event: "supervisor",    data: { roundNumber: 1, pivot: demoPivot },                                        delay: 2000 },
    { event: "round_personas",data: { roundNumber: 2, personas: demoRound2 },                                   delay: 3500 },
    { event: "supervisor",    data: { roundNumber: 2, pivot: demoPivot2 },                                       delay: 2000 },
    { event: "score",         data: { ...demoScore, rounds_completed: 2 },                                      delay: 1200 },
    { event: "done",          data: {},                                                                           delay: 300  },
  ]
}
