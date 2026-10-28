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
    const { container } = render(<JirehLogo variant="dark" className="extra-class" />)
    expect(container.querySelector("svg")).toHaveClass("extra-class")
  })

  it("dark variant has white fill paths", () => {
    const { container } = render(<JirehLogo variant="dark" />)
    const paths = container.querySelectorAll("path")
    const fills = Array.from(paths).map((p) => p.getAttribute("fill"))
    expect(fills).toContain("white")
    expect(fills).toContain("#E79AFF")
  })

  it("light variant has #B325FF fill paths", () => {
    const { container } = render(<JirehLogo variant="light" />)
    const paths = container.querySelectorAll("path")
    const fills = Array.from(paths).map((p) => p.getAttribute("fill"))
    expect(fills).toContain("#B325FF")
    expect(fills).toContain("#DFACFF")
  })
})
