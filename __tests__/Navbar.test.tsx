import { render, screen } from "@testing-library/react"
import "@testing-library/jest-dom"
import { Navbar } from "@/components/Navbar"

describe("Navbar", () => {
  it("renders the brand name", () => {
    render(<Navbar />)
    expect(screen.getByTestId("navbar")).toHaveTextContent("ExecuSim")
  })

  it("renders How It Works nav link", () => {
    render(<Navbar />)
    expect(screen.getByText("How It Works")).toBeInTheDocument()
  })

  it("renders Personas nav link", () => {
    render(<Navbar />)
    expect(screen.getByText("Personas")).toBeInTheDocument()
  })

  it("renders About nav link", () => {
    render(<Navbar />)
    expect(screen.getByText("About")).toBeInTheDocument()
  })
})
