import { render, screen } from "@testing-library/react"
import "@testing-library/jest-dom"
import { DashboardPanel } from "@/components/DashboardPanel"

describe("DashboardPanel", () => {
  it("renders when visible is true", () => {
    render(
      <DashboardPanel panelNumber={1} title="Your Idea" tag="INPUT_" visible={true} />
    )
    expect(screen.getByTestId("panel-1")).toBeInTheDocument()
  })

  it("does not render when visible is false", () => {
    render(
      <DashboardPanel panelNumber={2} title="Strategy" tag="STRATEGY_AGT" visible={false} />
    )
    expect(screen.queryByTestId("panel-2")).not.toBeInTheDocument()
  })

  it("displays the title", () => {
    render(
      <DashboardPanel panelNumber={3} title="Market Responses" tag="PERSONA_GRID" visible={true} />
    )
    expect(screen.getByText("Market Responses")).toBeInTheDocument()
  })

  it("displays the tag", () => {
    render(
      <DashboardPanel panelNumber={4} title="Executive Decision" tag="EXEC_SUPV" visible={true} />
    )
    expect(screen.getByText("EXEC_SUPV")).toBeInTheDocument()
  })

  it("renders children when provided", () => {
    render(
      <DashboardPanel panelNumber={5} title="Score" tag="SCORE_OUT" visible={true}>
        <span data-testid="score-content">72%</span>
      </DashboardPanel>
    )
    expect(screen.getByTestId("score-content")).toBeInTheDocument()
  })

  it("renders skeleton placeholder when no children", () => {
    render(
      <DashboardPanel panelNumber={2} title="Strategy" tag="STRATEGY_AGT" visible={true} />
    )
    // Skeleton divs are present when no children passed
    const panel = screen.getByTestId("panel-2")
    expect(panel.querySelectorAll(".bg-white\\/10").length).toBeGreaterThan(0)
  })
})
