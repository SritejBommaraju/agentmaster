import { render, screen } from "@testing-library/react"
import "@testing-library/jest-dom"
import { AgentNetwork } from "@/components/AgentNetwork"

describe("AgentNetwork", () => {
  it("renders the network container", () => {
    render(<AgentNetwork />)
    expect(screen.getByTestId("agent-network")).toBeInTheDocument()
  })

  it("renders all 6 agent cards", () => {
    render(<AgentNetwork />)
    expect(screen.getAllByTestId("agent-card")).toHaveLength(5)
  })

  it("renders STRATEGY_AGT label", () => {
    render(<AgentNetwork />)
    expect(screen.getByText("STRATEGY_AGT")).toBeInTheDocument()
  })

  it("renders PERSONA_EARLY label", () => {
    render(<AgentNetwork />)
    expect(screen.getByText("PERSONA_EARLY")).toBeInTheDocument()
  })

  it("renders PERSONA_GROWTH label", () => {
    render(<AgentNetwork />)
    expect(screen.getByText("PERSONA_GROWTH")).toBeInTheDocument()
  })

  it("renders PERSONA_MIDMKT label", () => {
    render(<AgentNetwork />)
    expect(screen.getByText("PERSONA_MIDMKT")).toBeInTheDocument()
  })

  it("renders EXEC_SUPV label", () => {
    render(<AgentNetwork />)
    expect(screen.getByText("EXEC_SUPV")).toBeInTheDocument()
  })
})
