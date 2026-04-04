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
      className="glass-panel fixed left-1/2 top-5 z-50 flex w-[min(95vw,980px)] -translate-x-1/2 items-center justify-between rounded-full px-4 py-3 sm:px-6"
    >
      <Link href={isSimulate ? "/" : "#top"} className="flex items-center gap-3 text-sm text-[#f4efe4]">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#f1d6a0]/22 bg-white/[0.04] text-[11px] font-medium">
          E
        </span>
        <span className="font-medium">ExecuSim</span>
      </Link>

      <div className="hidden items-center gap-7 text-[14px] text-white/50 sm:flex">
        {isSimulate
          ? (
            <>
              <Link href="/" className="transition-colors hover:text-[#f4efe4]">Home</Link>
              <Link href="/simulate?demo=1" className="transition-colors hover:text-[#f4efe4]">Demo Mode</Link>
              <Link href="/simulate" className="transition-colors hover:text-[#f4efe4]">Live Run</Link>
            </>
          )
          : landingLinks.map((link) => (
            <Link key={link.href} href={link.href} className="transition-colors hover:text-[#f4efe4]">
              {link.label}
            </Link>
          ))}
      </div>

      <Link
        href={isSimulate ? "/simulate?demo=1" : "/simulate"}
        className="rounded-full border border-[#f1d6a0]/20 bg-[#f1d6a0]/8 px-4 py-2 text-xs uppercase tracking-[0.26em] text-[#f8e7c6] transition-colors hover:border-[#f1d6a0]/35 hover:bg-[#f1d6a0]/14"
      >
        {isSimulate ? "Run Demo" : "Open App"}
      </Link>
    </nav>
  )
}
