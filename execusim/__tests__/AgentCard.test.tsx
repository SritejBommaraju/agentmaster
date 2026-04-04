import { render, screen } from "@testing-library/react"
import "@testing-library/jest-dom"
import { AgentCard } from "@/components/AgentCard"

describe("AgentCard", () => {
  it("renders the label", () => {
    render(<AgentCard label="STRATEGY_AGT" floatClass="float-strategy" />)
    expect(screen.getByTestId("agent-label")).toHaveTextContent("STRATEGY_AGT")
  })

  it("renders the card container", () => {
    render(<AgentCard label="EXEC_SUPV" floatClass="float-supv" />)
    expect(screen.getByTestId("agent-card")).toBeInTheDocument()
  })

  it("applies dimmed class when dimmed prop is true", () => {
    render(<AgentCard label="PERSONA_EARLY" floatClass="float-early" dimmed />)
    expect(screen.getByTestId("agent-card")).toHaveClass("opacity-50")
  })

  it("does not apply dimmed class by default", () => {
    render(<AgentCard label="PERSONA_EARLY" floatClass="float-early" />)
    expect(screen.getByTestId("agent-card")).not.toHaveClass("opacity-50")
  })

  it("applies active border when active prop is true", () => {
    render(<AgentCard label="STRATEGY_AGT" floatClass="float-strategy" active />)
    expect(screen.getByTestId("agent-card")).toHaveClass("border-white/15")
  })

  it("renders custom children inside the card", () => {
    render(
      <AgentCard label="SCORE_OUT" floatClass="float-score">
        <span data-testid="custom-child">Score: 72%</span>
      </AgentCard>
    )
    expect(screen.getByTestId("custom-child")).toBeInTheDocument()
  })
})
