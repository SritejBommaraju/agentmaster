import Link from "next/link"
import {
  ArrowRight,
  ArrowUpRight,
  BadgeDollarSign,
  Building2,
  CircleOff,
  Radar,
  ShieldCheck,
  TrendingUp,
  Users,
} from "lucide-react"
import { Navbar } from "@/components/Navbar"
import { StatusBadge } from "@/components/StatusBadge"
import { AgentNetwork } from "@/components/AgentNetwork"

const steps = [
  {
    eyebrow: "01",
    title: "Shape the idea",
    body: "A strategy agent turns one sentence into ICP, pricing, messaging, and the core hypothesis you are really testing.",
    icon: Radar,
  },
  {
    eyebrow: "02",
    title: "Pressure-test the market",
    body: "Three stage-based buyers react in different ways: founder-speed, operator-ROI, and mid-market procurement reality.",
    icon: Users,
  },
  {
    eyebrow: "03",
    title: "Decide what changes",
    body: "The executive supervisor identifies whether the weakness is pricing, messaging, or the target segment itself.",
    icon: TrendingUp,
  },
]

const personas = [
  {
    label: "Early-stage",
    range: "1-20 employees",
    title: "Founder-led buyer",
    body: "Moves fast, hates setup friction, and feels every monthly bill.",
    bullets: ["Needs value today", "Wants low-risk pricing", "Will not tolerate complex onboarding"],
  },
  {
    label: "Growth-stage",
    range: "20-150 employees",
    title: "Operational owner",
    body: "Has budget, but needs ROI, integrations, and team adoption to justify the spend.",
    bullets: ["Needs ROI language", "Asks about stack fit", "Cares whether the team will actually use it"],
  },
  {
    label: "Mid-market",
    range: "150-500 employees",
    title: "Procurement-aware leader",
    body: "Represents the hardest real B2B buying motion: security, legal, implementation, and stakeholder sign-off.",
    bullets: ["Security is table stakes", "Proof matters more than hype", "Implementation promises get tested hard"],
  },
]

const productEdges = [
  {
    title: "Not a chatbot wrapper",
    body: "The product has a visible simulation loop. Buyers object, the supervisor pivots, and the score changes for a reason.",
    icon: CircleOff,
  },
  {
    title: "Weighted toward hard buyers",
    body: "Mid-market feedback matters more than an easy founder yes because that is where real B2B friction shows up.",
    icon: ShieldCheck,
  },
  {
    title: "Built for pre-sales clarity",
    body: "The point is to tell you what to test next before you spend time on outreach, demos, or product work.",
    icon: Building2,
  },
]

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#111111]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.08),transparent_34%),radial-gradient(circle_at_85%_18%,rgba(255,255,255,0.05),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.02),transparent_30%)]" />
      <Navbar />

      <section
        id="top"
        className="relative mx-auto flex min-h-screen w-full max-w-7xl items-center px-6 pb-20 pt-28 lg:px-12"
      >
        <div className="grid w-full gap-14 lg:grid-cols-[minmax(0,460px)_1fr] lg:items-center">
          <div className="z-10 flex flex-col gap-7">
            <StatusBadge status="ready" />

            <div className="space-y-5">
              <h1 className="text-[48px] font-normal leading-[0.98] tracking-[-0.04em] text-white sm:text-[64px] lg:text-[82px]">
                <span className="block">Simulate.</span>
                <span className="block text-white/45">Pivot. Validate.</span>
              </h1>

              <p className="max-w-md text-[17px] leading-8 text-white/58 sm:text-[18px]">
                Simulate a market of AI buyers, let an AI executive revise the pitch, and
                get a sharper signal before you spend time building or selling the wrong
                thing.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <Link href="/simulate" className="flex items-center gap-3 group">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white transition-colors group-hover:bg-white/90">
                  <ArrowUpRight className="h-5 w-5 text-black" />
                </div>
                <span className="text-[15px] font-medium text-white">Run Simulation</span>
              </Link>

              <Link
                href="/simulate?demo=1"
                className="rounded-full border border-white/10 bg-white/[0.03] px-5 py-3 text-sm text-white/72 transition-colors hover:border-white/20 hover:text-white"
              >
                Launch Demo Mode
              </Link>
            </div>

            <div className="grid gap-3 pt-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-white/28">Loop</p>
                <p className="mt-3 text-sm leading-6 text-white/72">Idea to weighted validation score in one visible run.</p>
              </div>
              <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-white/28">Buyers</p>
                <p className="mt-3 text-sm leading-6 text-white/72">Stage-based decision-makers, not generic personas.</p>
              </div>
              <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-white/28">Outcome</p>
                <p className="mt-3 text-sm leading-6 text-white/72">Clearer next experiment: refine, proceed, or pivot.</p>
              </div>
            </div>
          </div>

          <div className="relative min-h-[420px] lg:min-h-[540px]">
            <AgentNetwork />
          </div>
        </div>
      </section>

      <section id="how-it-works" className="relative scroll-mt-28">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-12">
          <div className="mb-10 flex max-w-2xl flex-col gap-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-white/28">How It Works</p>
            <h2 className="text-3xl font-normal tracking-[-0.03em] text-white sm:text-4xl">
              A visible market loop, not a hidden prompt chain.
            </h2>
            <p className="text-base leading-8 text-white/58">
              Each panel exists to support a decision. The system makes its reasoning legible
              by showing the pitch, the pushback, the pivot, and the score delta.
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            {steps.map(({ eyebrow, title, body, icon: Icon }) => (
              <article
                key={title}
                className="group rounded-[28px] border border-white/8 bg-[#171717] p-6 transition-colors hover:border-white/14 hover:bg-[#1b1b1b]"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-white/28">
                    {eyebrow}
                  </span>
                  <div className="rounded-full border border-white/8 bg-white/[0.03] p-2 text-white/70">
                    <Icon className="h-4 w-4" />
                  </div>
                </div>
                <h3 className="mt-12 text-xl text-white">{title}</h3>
                <p className="mt-4 text-sm leading-7 text-white/58">{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="personas" className="relative scroll-mt-28 border-y border-white/6 bg-white/[0.02]">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-12">
          <div className="mb-10 flex max-w-2xl flex-col gap-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-white/28">Personas</p>
            <h2 className="text-3xl font-normal tracking-[-0.03em] text-white sm:text-4xl">
              Three buyer stages. Three different ways to kill a weak idea.
            </h2>
            <p className="text-base leading-8 text-white/58">
              The simulation is grounded in buying context. Easy buyers expose surface-level
              problems. Hard buyers expose whether the offer survives real procurement.
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            {personas.map((persona) => (
              <article key={persona.label} className="rounded-[28px] border border-white/8 bg-[#161616] p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-white/28">
                      {persona.label}
                    </p>
                    <p className="mt-2 text-sm text-white/42">{persona.range}</p>
                  </div>
                  <div className="rounded-full border border-white/8 bg-white/[0.03] p-2 text-white/70">
                    <BadgeDollarSign className="h-4 w-4" />
                  </div>
                </div>
                <h3 className="mt-10 text-xl text-white">{persona.title}</h3>
                <p className="mt-4 text-sm leading-7 text-white/58">{persona.body}</p>
                <div className="mt-6 space-y-3">
                  {persona.bullets.map((bullet) => (
                    <div key={bullet} className="flex items-start gap-3 text-sm text-white/68">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-white/60" />
                      <span>{bullet}</span>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="relative scroll-mt-28">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-12">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
            <div className="rounded-[32px] border border-white/8 bg-[#161616] p-7 sm:p-8">
              <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-white/28">About</p>
              <h2 className="mt-5 max-w-xl text-3xl font-normal tracking-[-0.03em] text-white sm:text-4xl">
                ExecuSim is for deciding what deserves real customer discovery.
              </h2>
              <p className="mt-5 max-w-xl text-base leading-8 text-white/58">
                It does not replace interviews. It compresses the first pass of strategy work so
                you know which objection is most likely to block a sale, which segment is reacting,
                and whether the current pitch deserves real-world testing.
              </p>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {productEdges.map(({ title, body, icon: Icon }) => (
                  <div key={title} className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                    <Icon className="h-4 w-4 text-white/74" />
                    <h3 className="mt-4 text-sm text-white">{title}</h3>
                    <p className="mt-3 text-sm leading-6 text-white/56">{body}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[32px] border border-white/8 bg-[#131313] p-7 sm:p-8">
              <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-white/28">Suggested Demo</p>
              <div className="mt-6 space-y-6">
                <div>
                  <p className="text-sm text-white/42">Best live path</p>
                  <p className="mt-2 text-xl text-white">AI compliance automation for fintech</p>
                </div>

                <div className="grid gap-3">
                  <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                    <p className="text-sm text-white">Why it works</p>
                    <p className="mt-2 text-sm leading-6 text-white/58">
                      Security, procurement, and proof are instantly understandable, so the
                      mid-market pivot is easy for an audience to follow.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                    <p className="text-sm text-white">What to show</p>
                    <p className="mt-2 text-sm leading-6 text-white/58">
                      Spend the most time on Round 1 objections, then on the supervisor rationale,
                      then on the score delta after the pivot.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <Link
                    href="/simulate?demo=1"
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 text-sm text-white/76 transition-colors hover:border-white/18 hover:text-white"
                  >
                    Open Demo
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/simulate"
                    className="inline-flex items-center gap-2 text-sm text-white/52 transition-colors hover:text-white/78"
                  >
                    Try the live flow
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
