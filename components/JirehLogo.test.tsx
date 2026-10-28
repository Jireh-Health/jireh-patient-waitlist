import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import JirehLogo from "./JirehLogo"

describe("JirehLogo", () => {
  it("renders dark variant with accessible label", () => {
    render(<JirehLogo variant="dark" />)
    expect(screen.getByRole("img", { name: /jireh health logo/i })).toBeInTheDocument()
  })

  it("renders light variant with accessible label", () => {
    render(<JirehLogo variant="light" />)
    expect(screen.getByRole("img", { name: /jireh health logo/i })).toBeInTheDocument()
  })

  it("applies additional className", () => {
    render(<JirehLogo variant="dark" className="extra-class" />)
    expect(screen.getByRole("img", { name: /jireh health logo/i })).toHaveClass("extra-class")
  })

  it("dark variant uses the splash logo", () => {
    render(<JirehLogo variant="dark" />)
    const img = screen.getByRole("img", { name: /jireh health logo/i })
    expect(img).toHaveAttribute("src", "/icons/full-logo-splash.svg")
  })

  it("light variant uses the full logo", () => {
    render(<JirehLogo variant="light" />)
    const img = screen.getByRole("img", { name: /jireh health logo/i })
    expect(img).toHaveAttribute("src", "/icons/full-logo.svg")
  })
})
