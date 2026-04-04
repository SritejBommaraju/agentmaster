import { ObjectionCategory, PersonaStage, Strategy } from "@/lib/types"

export interface EvidencePack {
  domain: string
  keywords: string[]
  buyer_language_examples: string[]
  common_objections: Array<{ category: ObjectionCategory; text: string }>
  expected_roi_language: string[]
  procurement_expectations: string[]
  typical_budgets: Partial<Record<PersonaStage, string>>
  required_integrations: string[]
  trust_expectations: string[]
  adoption_blockers: string[]
}

const EVIDENCE_PACKS: EvidencePack[] = [
  {
    domain: "fintech",
    keywords: ["fintech", "compliance", "regtech", "audit", "soc 2", "aml", "risk"],
    buyer_language_examples: [
      "Show me the control coverage before I bring in legal.",
      "I need a clean ROI story for compliance headcount and audit prep.",
    ],
    common_objections: [
      { category: "trust", text: "Security posture is unclear for regulated workflows." },
      { category: "integration", text: "Must plug into our compliance and ticketing stack." },
      { category: "procurement", text: "Legal review and vendor onboarding will slow this down." },
    ],
    expected_roi_language: ["audit prep hours saved", "control evidence coverage", "manual review reduction"],
    procurement_expectations: ["security review", "legal review", "reference customers", "annual terms"],
    typical_budgets: {
      stage_early: "$150-$300/month trial budget",
      stage_growth: "$400-$1200/month if ROI is proven",
      stage_mid_market: "$10k-$35k annual pilot budget",
    },
    required_integrations: ["Vanta", "Drata", "Jira", "Slack"],
    trust_expectations: ["SOC 2 readiness", "audit trail visibility", "clear data handling"],
    adoption_blockers: ["unclear compliance ownership", "security review delay", "missing references"],
  },
  {
    domain: "legal",
    keywords: ["legal", "contract", "law firm", "e-discovery", "matter management"],
    buyer_language_examples: [
      "If this creates review risk, it will not survive partner scrutiny.",
      "I need workflow fit before I care about AI novelty.",
    ],
    common_objections: [
      { category: "workflow", text: "Attorneys will not adopt if review flow feels unfamiliar." },
      { category: "trust", text: "Accuracy risk creates reputational exposure." },
      { category: "pricing", text: "Seat pricing must map to firm economics." },
    ],
    expected_roi_language: ["hours recovered", "faster review cycle", "reduced write-offs"],
    procurement_expectations: ["pilot matter", "partner sponsor", "data residency review"],
    typical_budgets: {
      stage_early: "$100-$250/month for a small practice",
      stage_growth: "$500-$1500/month with matter volume fit",
      stage_mid_market: "$15k-$40k annual departmental spend",
    },
    required_integrations: ["iManage", "NetDocuments", "Microsoft 365"],
    trust_expectations: ["privilege-safe handling", "accuracy review", "clear audit logs"],
    adoption_blockers: ["billable habit inertia", "ethics concerns", "document workflow disruption"],
  },
  {
    domain: "hr",
    keywords: ["hr", "people", "recruiting", "talent", "benefits", "onboarding"],
    buyer_language_examples: [
      "This only matters if it saves recruiter time without hurting candidate experience.",
      "I need adoption across hiring managers, not just HR.",
    ],
    common_objections: [
      { category: "workflow", text: "Needs to fit our current hiring and onboarding process." },
      { category: "integration", text: "ATS and HRIS integration is mandatory." },
      { category: "change_management", text: "Managers will resist another system." },
    ],
    expected_roi_language: ["time-to-hire", "admin hours saved", "manager adoption"],
    procurement_expectations: ["HRIS review", "security review", "department budget approval"],
    typical_budgets: {
      stage_early: "$100-$250/month",
      stage_growth: "$300-$900/month",
      stage_mid_market: "$12k-$25k annual team budget",
    },
    required_integrations: ["Greenhouse", "Lever", "BambooHR", "Workday"],
    trust_expectations: ["candidate data controls", "role permissions", "reporting accuracy"],
    adoption_blockers: ["manager change fatigue", "duplicate data entry", "unclear ownership"],
  },
  {
    domain: "sales",
    keywords: ["sales", "revenue", "pipeline", "crm", "outbound", "enablement"],
    buyer_language_examples: [
      "If reps do not use it in the first week, the rollout dies.",
      "Show me pipeline impact, not generic productivity claims.",
    ],
    common_objections: [
      { category: "roi", text: "Value claims need a pipeline or conversion metric." },
      { category: "integration", text: "It must sync cleanly with CRM and call tooling." },
      { category: "change_management", text: "Rep behavior is hard to shift mid-quarter." },
    ],
    expected_roi_language: ["pipeline created", "conversion lift", "rep ramp time"],
    procurement_expectations: ["revops approval", "CRM admin review", "quick pilot"],
    typical_budgets: {
      stage_early: "$100-$300/month",
      stage_growth: "$500-$1500/month",
      stage_mid_market: "$20k-$50k annual enablement budget",
    },
    required_integrations: ["Salesforce", "HubSpot", "Gong", "Outreach"],
    trust_expectations: ["CRM accuracy", "usage visibility", "team adoption proof"],
    adoption_blockers: ["rep resistance", "workflow duplication", "weak attribution"],
  },
  {
    domain: "compliance",
    keywords: ["compliance", "governance", "policy", "risk", "controls"],
    buyer_language_examples: [
      "I need an evidence trail, not another dashboard.",
      "Control owners need a process they will actually maintain.",
    ],
    common_objections: [
      { category: "trust", text: "Need credible control evidence and auditability." },
      { category: "workflow", text: "Control maintenance cannot create extra admin burden." },
      { category: "procurement", text: "Vendor review is unavoidable in this category." },
    ],
    expected_roi_language: ["control coverage", "audit prep reduction", "policy maintenance time"],
    procurement_expectations: ["security review", "control mapping review", "reference checks"],
    typical_budgets: {
      stage_early: "$150-$350/month",
      stage_growth: "$500-$1400/month",
      stage_mid_market: "$15k-$45k annual budget",
    },
    required_integrations: ["Okta", "Jira", "Google Workspace", "Slack"],
    trust_expectations: ["audit logs", "role-based access", "evidence retention"],
    adoption_blockers: ["unclear control ownership", "manual evidence collection", "slow procurement"],
  },
  {
    domain: "design_ops",
    keywords: ["design", "ux", "figma", "creative", "asset", "brand"],
    buyer_language_examples: [
      "If it interrupts the design flow, nobody will keep using it.",
      "Show me where it reduces revision churn.",
    ],
    common_objections: [
      { category: "workflow", text: "The tool has to fit live design collaboration." },
      { category: "integration", text: "Deep Figma and project tooling integration is expected." },
      { category: "pricing", text: "Budget competes with existing creative subscriptions." },
    ],
    expected_roi_language: ["revision cycles reduced", "handoff speed", "asset reuse"],
    procurement_expectations: ["team lead approval", "lightweight pilot", "annual software review"],
    typical_budgets: {
      stage_early: "$50-$150/month",
      stage_growth: "$250-$700/month",
      stage_mid_market: "$8k-$18k annual ops budget",
    },
    required_integrations: ["Figma", "Linear", "Jira", "Slack"],
    trust_expectations: ["version control", "permission clarity", "brand consistency"],
    adoption_blockers: ["creative workflow disruption", "tool sprawl", "weak collaboration fit"],
  },
]

const DEFAULT_PACK = EVIDENCE_PACKS[3]

export function selectEvidencePack(idea: string, strategy: Strategy): EvidencePack {
  const haystack = `${idea} ${strategy.icp} ${strategy.messaging} ${strategy.hypothesis}`.toLowerCase()

  const scored = EVIDENCE_PACKS
    .map((pack) => ({
      pack,
      score: pack.keywords.reduce((sum, keyword) => sum + (haystack.includes(keyword) ? 1 : 0), 0),
    }))
    .sort((a, b) => b.score - a.score)

  return scored[0]?.score ? scored[0].pack : DEFAULT_PACK
}

