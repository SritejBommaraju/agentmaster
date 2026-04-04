import { render, screen } from "@testing-library/react"
import "@testing-library/jest-dom"
import { StrategyDisplay } from "@/components/StrategyDisplay"
import { Strategy } from "@/lib/types"

const mockStrategy: Strategy = {
  icp: "Mid-market fintech compliance teams (150–500 employees)",
  pricing: "$500/mo per seat",
  messaging: "Automate audit trails without adding headcount",
  hypothesis: "Teams will pay to reduce manual compliance work by 80%",
}

describe("StrategyDisplay", () => {
  it("renders the strategy container", () => {
    render(<StrategyDisplay strategy={mockStrategy} />)
    expect(screen.getByTestId("strategy-display")).toBeInTheDocument()
  })

  it("displays the ICP", () => {
    render(<StrategyDisplay strategy={mockStrategy} />)
    expect(screen.getByTestId("strategy-icp")).toHaveTextContent(mockStrategy.icp)
  })

  it("displays the pricing", () => {
    render(<StrategyDisplay strategy={mockStrategy} />)
    expect(screen.getByTestId("strategy-pricing")).toHaveTextContent(mockStrategy.pricing)
  })

  it("displays the messaging", () => {
    render(<StrategyDisplay strategy={mockStrategy} />)
    expect(screen.getByTestId("strategy-messaging")).toHaveTextContent(mockStrategy.messaging)
  })

  it("displays the hypothesis", () => {
    render(<StrategyDisplay strategy={mockStrategy} />)
    expect(screen.getByTestId("strategy-hypothesis")).toHaveTextContent(mockStrategy.hypothesis)
  })

  it("renders all 4 field labels", () => {
    render(<StrategyDisplay strategy={mockStrategy} />)
    expect(screen.getByText("ICP")).toBeInTheDocument()
    expect(screen.getByText("Pricing")).toBeInTheDocument()
    expect(screen.getByText("Messaging")).toBeInTheDocument()
    expect(screen.getByText("Hypothesis")).toBeInTheDocument()
  })
})
