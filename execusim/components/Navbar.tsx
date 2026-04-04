"use client"

export function Navbar() {
  return (
    <nav
      data-testid="navbar"
      className="fixed top-6 left-1/2 -translate-x-1/2 z-50
                 flex items-center gap-8 px-6 py-3
                 rounded-full border border-white/7 bg-[#1a1a1a]/90
                 backdrop-blur-sm"
    >
      <span className="flex items-center gap-2 text-sm font-medium text-white">
        <span className="w-2 h-2 rounded-full bg-white inline-block" />
        ExecuSim
      </span>
      <div className="flex items-center gap-6 text-[14px] text-white/50">
        <a href="#how-it-works" className="hover:text-white/80 transition-colors">How It Works</a>
        <a href="#personas" className="hover:text-white/80 transition-colors">Personas</a>
        <a href="#about" className="hover:text-white/80 transition-colors">About</a>
      </div>
    </nav>
  )
}
