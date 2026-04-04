import { PersonaResponse, PivotDecision, Strategy } from "@/lib/types"
import { computeScore } from "@/lib/scoring"

export const DEMO_IDEA = "AI compliance automation tool for fintech"

const demoStrategy: Strategy = {
  icp: "Mid-market fintech compliance and risk teams at Series B+ companies with audit pressure",
  pricing: "$500/month per seat on an annual contract",
  messaging: "Automate audit prep and compliance evidence without adding headcount.",
  hypothesis:
    "Regulated fintech teams will pay to reduce manual control evidence work and shorten audit prep.",
}

const demoRound1: PersonaResponse[] = [
  {
    persona: "stage_early",
    buyer_profile: {
      stage: "stage_early",
      company_size: "10-20 employees",
      role: "Founder",
      decision_authority: "owner",
      budget_tolerance: "tight",
      current_stack: ["Notion", "Slack", "Google Drive"],
      procurement_friction: "Low process but every tool competes with core hiring budget.",
      success_metrics: ["hours saved per week", "investor confidence", "faster audit prep"],
      switching_resistance: "Will switch fast if setup is simple and ROI is visible immediately.",
      trust_requirements: ["basic security clarity", "clear data handling"],
      buying_triggers: ["upcoming diligence", "manual spreadsheet pain"],
      top_risks: ["price too high", "unclear implementation"],
      language_style: "direct",
    },
    evaluation_summary: "Interested in the outcome, but the price and trust posture feel early.",
    interest_score: 6,
    objections: [
      { text: "Starter budget is too thin for this price.", category: "pricing", severity: "high", blocking: true },
      { text: "Need confidence this works without setup overhead.", category: "workflow", severity: "medium", blocking: false },
      { text: "Security posture is still vague for diligence.", category: "trust", severity: "medium", blocking: false },
    ],
    likelihood: 0.44,
    willingness_to_pay: "$149-$249/month with a trial",
    trust_signal: "medium",
    procurement_intensity: "low",
  },
  {
    persona: "stage_growth",
    buyer_profile: {
      stage: "stage_growth",
      company_size: "40-120 employees",
      role: "Head of Compliance Operations",
      decision_authority: "approver",
      budget_tolerance: "managed",
      current_stack: ["Vanta", "Jira", "Slack", "Google Workspace"],
      procurement_friction: "Needs a clear ROI case and integration proof before purchase.",
      success_metrics: ["audit prep hours saved", "control completion rate", "fewer manual reviews"],
      switching_resistance: "Moderate because the current workflow is annoying but familiar.",
      trust_requirements: ["SOC 2 readiness", "audit trail visibility", "role permissions"],
      buying_triggers: ["upcoming audit", "team bandwidth pressure"],
      top_risks: ["weak integration proof", "soft ROI story"],
      language_style: "analytical",
    },
    evaluation_summary: "The concept fits the team, but the pitch still sounds generic and under-validated.",
    interest_score: 5,
    objections: [
      { text: "ROI claim needs harder numbers for finance approval.", category: "roi", severity: "high", blocking: true },
      { text: "Must integrate with Vanta and Jira cleanly.", category: "integration", severity: "high", blocking: true },
      { text: "Need clearer trust evidence for compliance workflows.", category: "trust", severity: "medium", blocking: false },
    ],
    likelihood: 0.39,
    willingness_to_pay: "$400-$700/month after integration proof",
    trust_signal: "medium",
    procurement_intensity: "medium",
  },
  {
    persona: "stage_mid_market",
    buyer_profile: {
      stage: "stage_mid_market",
      company_size: "180-350 employees",
      role: "Director of GRC",
      decision_authority: "committee",
      budget_tolerance: "flexible",
      current_stack: ["Drata", "Jira", "Okta", "Slack"],
      procurement_friction: "Security review, legal review, and reference checks are mandatory.",
      success_metrics: ["audit readiness", "control evidence coverage", "vendor risk reduction"],
      switching_resistance: "High because the current process is painful but politically stable.",
      trust_requirements: ["SOC 2 evidence", "reference customers", "clear onboarding plan"],
      buying_triggers: ["annual control review", "new customer security demands"],
      top_risks: ["vendor risk", "slow rollout", "lack of references"],
      language_style: "procurement",
    },
    evaluation_summary: "The pain is real, but the offer lacks the trust and proof needed to survive procurement.",
    interest_score: 3,
    objections: [
      { text: "Reference customers at our scale are missing.", category: "trust", severity: "high", blocking: true },
      { text: "Security review will stall without stronger evidence.", category: "security", severity: "high", blocking: true },
      { text: "Procurement will ask for enterprise onboarding details.", category: "procurement", severity: "high", blocking: true },
    ],
    likelihood: 0.22,
    willingness_to_pay: "$12k-$20k annual pilot if trusted",
    trust_signal: "low",
    procurement_intensity: "high",
  },
]

const demoPivot: PivotDecision = {
  should_pivot: true,
  pivot_type: "trust",
  pivot_rationale: "Trust is blocking the deal before pricing. Lead with audit readiness, references, and integration proof.",
  updated_strategy: {
    icp: "Growth and mid-market fintech compliance leaders preparing for audits or security reviews",
    pricing: "$299/month growth tier and $15k annual mid-market pilot",
    messaging: "Ship audit-ready compliance evidence fast with integrations your team already uses.",
    hypothesis:
      "Compliance leaders will move if the offer reduces audit prep and clears trust reviews early.",
  },
  primary_failure_mode: "Trust and procurement blockers outweigh workflow appeal.",
  highest_risk_segment: "stage_mid_market",
  confidence_note: "Clear pain exists, but proof and trust posture must improve first.",
}

const demoRound2: PersonaResponse[] = [
  {
    persona: "stage_early",
    buyer_profile: demoRound1[0].buyer_profile,
    evaluation_summary: "The growth tier is more plausible, but the founder still wants a low-friction pilot.",
    interest_score: 7,
    objections: [
      { text: "Would still want a monthly pilot option first.", category: "pricing", severity: "medium", blocking: false },
      { text: "Need quick setup with templates, not services work.", category: "workflow", severity: "medium", blocking: false },
    ],
    likelihood: 0.61,
    willingness_to_pay: "$249-$299/month pilot",
    trust_signal: "medium",
    procurement_intensity: "low",
  },
  {
    persona: "stage_growth",
    buyer_profile: demoRound1[1].buyer_profile,
    evaluation_summary: "The revised positioning is sharper and easier to defend internally.",
    interest_score: 7,
    objections: [
      { text: "Still need integration proof with Vanta and Jira.", category: "integration", severity: "medium", blocking: true },
      { text: "Finance will want one tighter ROI benchmark.", category: "roi", severity: "medium", blocking: false },
    ],
    likelihood: 0.58,
    willingness_to_pay: "$600-$900/month after validation",
    trust_signal: "medium",
    procurement_intensity: "medium",
  },
  {
    persona: "stage_mid_market",
    buyer_profile: demoRound1[2].buyer_profile,
    evaluation_summary: "The trust posture improved enough to start a pilot conversation, but procurement still needs evidence.",
    interest_score: 6,
    objections: [
      { text: "Need two credible references before procurement moves.", category: "trust", severity: "high", blocking: true },
      { text: "Security review package must be ready upfront.", category: "security", severity: "medium", blocking: true },
    ],
    likelihood: 0.49,
    willingness_to_pay: "$15k annual pilot with references",
    trust_signal: "medium",
    procurement_intensity: "high",
  },
]

const demoPivot2: PivotDecision = {
  should_pivot: true,
  pivot_type: "workflow",
  pivot_rationale: "Signal improved, but the market still needs proof-packaged onboarding and reference-driven trust.",
  updated_strategy: {
    icp: "Growth and mid-market fintech compliance teams with an active audit or vendor review in flight",
    pricing: "$299/month growth tier and $15k annual pilot with onboarding bundle",
    messaging: "Launch with a trust pack, prebuilt integrations, and evidence templates for the first audit cycle.",
    hypothesis:
      "Borderline buyers convert when trust materials and implementation proof are part of the offer.",
  },
  primary_failure_mode: "Procurement confidence is improving but not yet resolved.",
  highest_risk_segment: "stage_mid_market",
  confidence_note: "Promising if implementation proof closes the remaining blocker.",
  should_run_round_three: true,
}

const demoRound3: PersonaResponse[] = [
  {
    persona: "stage_early",
    buyer_profile: demoRound1[0].buyer_profile,
    evaluation_summary: "The offer now feels concrete enough to test immediately.",
    interest_score: 7,
    objections: [
      { text: "Still prefers a month-to-month start.", category: "pricing", severity: "low", blocking: false },
    ],
    likelihood: 0.66,
    willingness_to_pay: "$299/month",
    trust_signal: "medium",
    procurement_intensity: "low",
  },
  {
    persona: "stage_growth",
    buyer_profile: demoRound1[1].buyer_profile,
    evaluation_summary: "Integration and onboarding proof make the ROI case easier to support.",
    interest_score: 8,
    objections: [
      { text: "Would want a pilot success benchmark in writing.", category: "roi", severity: "low", blocking: false },
    ],
    likelihood: 0.67,
    willingness_to_pay: "$900/month with onboarding",
    trust_signal: "medium",
    procurement_intensity: "medium",
  },
  {
    persona: "stage_mid_market",
    buyer_profile: demoRound1[2].buyer_profile,
    evaluation_summary: "The trust package and implementation framing reduce the internal risk enough for a pilot.",
    interest_score: 7,
    objections: [
      { text: "Reference diligence still needs to happen.", category: "trust", severity: "medium", blocking: false },
    ],
    likelihood: 0.58,
    willingness_to_pay: "$18k annual pilot",
    trust_signal: "medium",
    procurement_intensity: "high",
  },
]

const demoScore = computeScore(demoRound3, demoRound2)

export interface DemoEvent {
  event: string
  data: unknown
  delay: number
}

export function getDemoEvents(): DemoEvent[] {
  return [
    { event: "start", data: { simulation_id: "demo-sim-0001" }, delay: 400 },
    { event: "strategy", data: { strategy: demoStrategy }, delay: 1400 },
    { event: "round_personas", data: { roundNumber: 1, personas: demoRound1 }, delay: 2200 },
    { event: "supervisor", data: { roundNumber: 1, pivot: demoPivot }, delay: 1200 },
    { event: "round_personas", data: { roundNumber: 2, personas: demoRound2 }, delay: 2200 },
    { event: "supervisor", data: { roundNumber: 2, pivot: demoPivot2 }, delay: 1200 },
    { event: "round_personas", data: { roundNumber: 3, personas: demoRound3 }, delay: 1800 },
    { event: "score", data: { ...demoScore, rounds_completed: 3 }, delay: 900 },
    { event: "done", data: {}, delay: 300 },
  ]
}
