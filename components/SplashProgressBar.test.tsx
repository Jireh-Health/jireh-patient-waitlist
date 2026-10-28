import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect, vi } from "vitest"
import SplashProgressBar from "./SplashProgressBar"

describe("SplashProgressBar", () => {
  it("renders the correct number of dots", () => {
    const { container } = render(
      <SplashProgressBar currentStep={0} totalSteps={4} />
    )
    expect(container.querySelectorAll("div.h-2\\.5")).toHaveLength(4)
  })

  it("renders clickable buttons when onStepClick is provided", () => {
    render(
      <SplashProgressBar
        currentStep={0}
        totalSteps={4}
        onStepClick={vi.fn()}
      />
    )
    expect(screen.getAllByRole("button")).toHaveLength(4)
  })

  it("calls onStepClick with correct index when a dot is clicked", async () => {
    const user = userEvent.setup()
    const onStepClick = vi.fn()
    render(
      <SplashProgressBar
        currentStep={0}
        totalSteps={4}
        onStepClick={onStepClick}
      />
    )
    await user.click(screen.getByLabelText("Go to screen 3"))
    expect(onStepClick).toHaveBeenCalledWith(2)
  })

  it("marks current step with aria-current", () => {
    render(
      <SplashProgressBar
        currentStep={2}
        totalSteps={4}
        onStepClick={vi.fn()}
      />
    )
    const buttons = screen.getAllByRole("button")
    expect(buttons[2]).toHaveAttribute("aria-current", "step")
    expect(buttons[0]).not.toHaveAttribute("aria-current")
  })

  it("applies activeColor to current dot and inactiveColor to others", () => {
    const { container } = render(
      <SplashProgressBar
        currentStep={1}
        totalSteps={3}
        activeColor="bg-primary"
        inactiveColor="bg-primary/25"
        onStepClick={vi.fn()}
      />
    )
    const spans = container.querySelectorAll("span")
    expect(spans[1]).toHaveClass("bg-primary")
    expect(spans[0]).toHaveClass("bg-primary/25")
    expect(spans[2]).toHaveClass("bg-primary/25")
  })

  it("uses default totalSteps of 5 when not provided", () => {
    const { container } = render(
      <SplashProgressBar currentStep={0} />
    )
    // No buttons (no onStepClick), just divs
    expect(container.querySelectorAll("div.h-2\\.5")).toHaveLength(5)
  })
})
