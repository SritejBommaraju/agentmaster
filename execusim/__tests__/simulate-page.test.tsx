import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import "@testing-library/jest-dom"
import SimulatePage from "@/app/simulate/page"

const mockStrategy = {
  icp: "Mid-market fintech compliance teams",
  pricing: "$500/mo per seat",
  messaging: "Automate audit trails without headcount",
  hypothesis: "Teams will pay to reduce compliance work by 80%",
}

function mockFetchSuccess() {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ simulation_id: "sim-123", strategy: mockStrategy }),
  }) as jest.Mock
}

function mockFetchFailure(message = "Simulation failed") {
  global.fetch = jest.fn().mockResolvedValue({
    ok: false,
    json: async () => ({ error: message }),
  }) as jest.Mock
}

describe("SimulatePage", () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })

  it("renders Panel 1 (idea input) on mount", () => {
    render(<SimulatePage />)
    expect(screen.getByTestId("panel-1")).toBeInTheDocument()
  })

  it("does not render panels 2-5 on initial load", () => {
    render(<SimulatePage />)
    expect(screen.queryByTestId("panel-2")).not.toBeInTheDocument()
    expect(screen.queryByTestId("panel-3")).not.toBeInTheDocument()
    expect(screen.queryByTestId("panel-4")).not.toBeInTheDocument()
    expect(screen.queryByTestId("panel-5")).not.toBeInTheDocument()
  })

  it("renders the idea textarea", () => {
    render(<SimulatePage />)
    expect(screen.getByTestId("idea-input")).toBeInTheDocument()
  })

  it("submit button is disabled when input is empty", () => {
    render(<SimulatePage />)
    expect(screen.getByTestId("submit-button")).toBeDisabled()
  })

  it("submit button enables when idea is typed", () => {
    render(<SimulatePage />)
    fireEvent.change(screen.getByTestId("idea-input"), {
      target: { value: "AI compliance tool for fintech" },
    })
    expect(screen.getByTestId("submit-button")).not.toBeDisabled()
  })

  it("shows status badge as ready initially", () => {
    render(<SimulatePage />)
    expect(screen.getByTestId("status-badge")).toHaveAttribute("data-status", "ready")
  })

  it("status changes to running and panel 2 appears immediately after submit", async () => {
    mockFetchSuccess()
    render(<SimulatePage />)
    fireEvent.change(screen.getByTestId("idea-input"), {
      target: { value: "AI compliance tool for fintech" },
    })
    fireEvent.click(screen.getByTestId("submit-button"))

    // Panel 2 and running status are set synchronously before fetch resolves
    expect(screen.getByTestId("status-badge")).toHaveAttribute("data-status", "running")
    expect(screen.getByTestId("panel-2")).toBeInTheDocument()
  })

  it("disables input while simulation is running", async () => {
    // Use a never-resolving fetch so we can test the in-progress state
    global.fetch = jest.fn().mockReturnValue(new Promise(() => {})) as jest.Mock

    render(<SimulatePage />)
    fireEvent.change(screen.getByTestId("idea-input"), {
      target: { value: "AI compliance tool for fintech" },
    })
    fireEvent.click(screen.getByTestId("submit-button"))

    expect(screen.getByTestId("idea-input")).toBeDisabled()
  })

  it("shows strategy in panel 2 after successful API response", async () => {
    mockFetchSuccess()
    render(<SimulatePage />)
    fireEvent.change(screen.getByTestId("idea-input"), {
      target: { value: "AI compliance tool for fintech" },
    })
    fireEvent.click(screen.getByTestId("submit-button"))

    await waitFor(() => {
      expect(screen.getByTestId("strategy-display")).toBeInTheDocument()
    })
    expect(screen.getByTestId("strategy-icp")).toHaveTextContent(mockStrategy.icp)
  })

  it("shows error message when API call fails", async () => {
    mockFetchFailure("Strategy agent failed")
    render(<SimulatePage />)
    fireEvent.change(screen.getByTestId("idea-input"), {
      target: { value: "Bad idea" },
    })
    fireEvent.click(screen.getByTestId("submit-button"))

    await waitFor(() => {
      expect(screen.getByTestId("error-message")).toHaveTextContent("Strategy agent failed")
    })
  })

  it("sets status to failed when API call fails", async () => {
    mockFetchFailure()
    render(<SimulatePage />)
    fireEvent.change(screen.getByTestId("idea-input"), {
      target: { value: "Bad idea" },
    })
    fireEvent.click(screen.getByTestId("submit-button"))

    await waitFor(() => {
      expect(screen.getByTestId("status-badge")).toHaveAttribute("data-status", "failed")
    })
  })
})
