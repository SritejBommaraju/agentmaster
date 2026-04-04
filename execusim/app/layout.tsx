import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "ExecuSim — AI Market Simulation Executive",
  description: "Simulate a market of AI buyers. Let an AI executive iterate until your idea shows traction.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full antialiased">{children}</body>
    </html>
  )
}
