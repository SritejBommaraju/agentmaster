import { render, screen } from "@testing-library/react"
import "@testing-library/jest-dom"
import { StatusBadge } from "@/components/StatusBadge"

describe("StatusBadge", () => {
  it("shows SIMULATION READY_ when status is ready", () => {
    render(<StatusBadge status="ready" />)
    expect(screen.getByTestId("status-badge")).toHaveTextContent("SIMULATION READY_")
  })

  it("shows RUNNING_ when status is running", () => {
    render(<StatusBadge status="running" />)
    expect(screen.getByTestId("status-badge")).toHaveTextContent("RUNNING_")
  })

  it("shows COMPLETE_ when status is complete", () => {
    render(<StatusBadge status="complete" />)
    expect(screen.getByTestId("status-badge")).toHaveTextContent("COMPLETE_")
  })

  it("shows FAILED_ when status is failed", () => {
    render(<StatusBadge status="failed" />)
    expect(screen.getByTestId("status-badge")).toHaveTextContent("FAILED_")
  })

  it("renders a pulse dot only when running", () => {
    const { rerender } = render(<StatusBadge status="ready" />)
    expect(screen.queryByRole("presentation")).not.toBeInTheDocument()

    rerender(<StatusBadge status="running" />)
    // pulse dot is aria-hidden span — check it exists
    const badge = screen.getByTestId("status-badge")
    const dot = badge.querySelector("span.pulse-dot")
    expect(dot).toBeInTheDocument()
  })

  it("sets data-status attribute correctly", () => {
    render(<StatusBadge status="complete" />)
    expect(screen.getByTestId("status-badge")).toHaveAttribute("data-status", "complete")
  })
})
