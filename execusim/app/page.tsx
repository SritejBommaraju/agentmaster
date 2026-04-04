import { Navbar } from "@/components/Navbar"
import { StatusBadge } from "@/components/StatusBadge"
import { AgentNetwork } from "@/components/AgentNetwork"
import { ArrowUpRight } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <main className="relative min-h-screen bg-[#111111] overflow-hidden">
      <Navbar />

      {/* Hero */}
      <section className="min-h-screen flex items-center px-8 lg:px-16 pt-24">
        {/* Left — copy */}
        <div className="flex flex-col gap-6 max-w-md z-10">
          <StatusBadge status="ready" />

          <h1 className="text-[64px] leading-[1.05] font-normal tracking-tight">
            <span className="text-white">Simulate.</span>
            <br />
            <span className="text-white/50">Pivot. Validate.</span>
          </h1>

          <p className="text-[18px] text-white/50 leading-relaxed max-w-sm">
            Simulate a market of AI buyers. Let an AI executive iterate until your idea shows traction — or tells you to move on.
          </p>

          <Link
            href="/simulate"
            className="flex items-center gap-3 w-fit group"
          >
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center
                            group-hover:bg-white/90 transition-colors">
              <ArrowUpRight className="w-5 h-5 text-black" />
            </div>
            <span className="text-white font-medium text-[15px]">Run Simulation</span>
          </Link>
        </div>

        {/* Right — agent network */}
        <div className="flex-1 hidden lg:block">
          <AgentNetwork />
        </div>
      </section>
    </main>
  )
}
