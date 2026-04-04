"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const landingLinks = [
  { href: "#how-it-works", label: "How It Works" },
  { href: "#personas", label: "Personas" },
  { href: "#about", label: "About" },
]

export function Navbar() {
  const pathname = usePathname()
  const isSimulate = pathname === "/simulate"

  return (
    <nav
      data-testid="navbar"
      className="fixed left-1/2 top-6 z-50 flex w-[min(94vw,820px)] -translate-x-1/2 items-center justify-between rounded-full border border-white/7 bg-[#161616]/90 px-4 py-3 backdrop-blur-md sm:px-6"
    >
      <Link href={isSimulate ? "/" : "#top"} className="flex items-center gap-2 text-sm font-medium text-white">
        <span className="inline-block h-2 w-2 rounded-full bg-white" />
        ExecuSim
      </Link>

      <div className="hidden items-center gap-6 text-[14px] text-white/50 sm:flex">
        {isSimulate ? (
          <>
            <Link href="/" className="transition-colors hover:text-white/80">
              Home
            </Link>
            <Link href="/simulate?demo=1" className="transition-colors hover:text-white/80">
              Demo Mode
            </Link>
            <Link href="/simulate" className="transition-colors hover:text-white/80">
              Live Run
            </Link>
          </>
        ) : (
          landingLinks.map((link) => (
            <Link key={link.href} href={link.href} className="transition-colors hover:text-white/80">
              {link.label}
            </Link>
          ))
        )}
      </div>

      <Link
        href={isSimulate ? "/simulate?demo=1" : "/simulate"}
        className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-xs uppercase tracking-[0.2em] text-white/72 transition-colors hover:border-white/20 hover:text-white"
      >
        {isSimulate ? "Run Demo" : "Open App"}
      </Link>
    </nav>
  )
}
