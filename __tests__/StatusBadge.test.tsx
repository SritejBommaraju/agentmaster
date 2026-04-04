import { render, screen } from "@testing-library/react"
import "@testing-library/jest-dom"
import { StatusBadge } from "@/components/StatusBadge"

describe("StatusBadge", () => {
  it("shows System Ready when status is ready", () => {
    render(<StatusBadge status="ready" />)
    expect(screen.getByTestId("status-badge")).toHaveTextContent("System Ready")
  })

  it("shows Simulation Live when status is running", () => {
    render(<StatusBadge status="running" />)
    expect(screen.getByTestId("status-badge")).toHaveTextContent("Simulation Live")
  })

  it("shows Signal Captured when status is complete", () => {
    render(<StatusBadge status="complete" />)
    expect(screen.getByTestId("status-badge")).toHaveTextContent("Signal Captured")
  })

  it("shows Needs Attention when status is failed", () => {
    render(<StatusBadge status="failed" />)
    expect(screen.getByTestId("status-badge")).toHaveTextContent("Needs Attention")
  })

  it("renders a pulse dot only when running", () => {
    const { rerender } = render(<StatusBadge status="running" />)
    expect(screen.getByTestId("status-badge").querySelector(".pulse-dot")).toBeInTheDocument()

    rerender(<StatusBadge status="ready" />)
    expect(screen.getByTestId("status-badge").querySelector(".pulse-dot")).not.toBeInTheDocument()
  })
})
