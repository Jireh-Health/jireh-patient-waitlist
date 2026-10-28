import { render, screen, fireEvent } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect, vi } from "vitest"
import SplashCarousel from "./SplashCarousel"

// next/navigation is mocked via vitest.config.ts alias
import * as navigation from "next/navigation"

describe("SplashCarousel", () => {
  it("renders the Jireh logo", () => {
    render(<SplashCarousel />)
    expect(screen.getByRole("img", { name: /jireh health logo/i })).toBeInTheDocument()
  })

  it("shows the first screen title on mount", () => {
    render(<SplashCarousel />)
    expect(screen.getByText(/Earn 5% cashback/)).toBeInTheDocument()
  })

  it("shows 'Join Waitlist' CTA button", () => {
    render(<SplashCarousel />)
    expect(screen.getByRole("button", { name: /join waitlist/i })).toBeInTheDocument()
  })

  it("previous arrow is invisible on first screen", () => {
    render(<SplashCarousel />)
    const prevBtn = screen.getByRole("button", { name: /previous screen/i })
    expect(prevBtn).toHaveClass("invisible")
  })

  it("next arrow is visible on first screen", () => {
    render(<SplashCarousel />)
    const nextBtn = screen.getByRole("button", { name: /next screen/i })
    expect(nextBtn).not.toHaveClass("invisible")
  })

  it("advances to the next screen when next arrow is clicked", async () => {
    const user = userEvent.setup()
    render(<SplashCarousel />)
    await user.click(screen.getByRole("button", { name: /next screen/i }))
    expect(screen.getByText(/Share your benefits/)).toBeInTheDocument()
  })

  it("goes back to previous screen when prev arrow is clicked", async () => {
    const user = userEvent.setup()
    render(<SplashCarousel />)
    await user.click(screen.getByRole("button", { name: /next screen/i }))
    await user.click(screen.getByRole("button", { name: /previous screen/i }))
    expect(screen.getByText(/Earn 5% cashback/)).toBeInTheDocument()
  })

  it("next arrow is invisible on last screen", async () => {
    const user = userEvent.setup()
    render(<SplashCarousel />)
    // Navigate to last screen (index 3)
    for (let i = 0; i < 3; i++) {
      await user.click(screen.getByRole("button", { name: /next screen/i }))
    }
    const nextBtn = screen.getByRole("button", { name: /next screen/i })
    expect(nextBtn).toHaveClass("invisible")
  })

  it("displays all 4 screens in sequence", async () => {
    const user = userEvent.setup()
    render(<SplashCarousel />)

    expect(screen.getByText(/Earn 5% cashback/)).toBeInTheDocument()

    await user.click(screen.getByRole("button", { name: /next screen/i }))
    expect(screen.getByText(/Share your benefits/)).toBeInTheDocument()

    await user.click(screen.getByRole("button", { name: /next screen/i }))
    expect(screen.getByText(/Discover discounts/)).toBeInTheDocument()

    await user.click(screen.getByRole("button", { name: /next screen/i }))
    expect(screen.getByText(/Join Jireh Plus/)).toBeInTheDocument()
  })

  it("navigates to /waitlist when CTA is clicked", async () => {
    // Inject a shared push mock so we can assert on it
    const pushMock = vi.fn()
    const routerSpy = vi.spyOn(navigation, "useRouter").mockReturnValue({ push: pushMock } as unknown as ReturnType<typeof navigation.useRouter>)

    const user = userEvent.setup()
    render(<SplashCarousel />)
    await user.click(screen.getByRole("button", { name: /join waitlist/i }))
    expect(pushMock).toHaveBeenCalledWith("/waitlist")

    routerSpy.mockRestore()
  })

  it("renders progress dots matching screen count", () => {
    render(<SplashCarousel />)
    // 4 progress dot buttons
    const dotButtons = screen.getAllByRole("button", { name: /go to screen/i })
    expect(dotButtons).toHaveLength(4)
  })

  it("handles swipe left to advance screen", () => {
    render(<SplashCarousel />)
    const body = screen.getByText(/Earn 5% cashback/).closest("div[class*='flex-1']")!

    fireEvent.touchStart(body, { targetTouches: [{ clientX: 300 }] })
    fireEvent.touchMove(body, { targetTouches: [{ clientX: 200 }] })
    fireEvent.touchEnd(body)

    expect(screen.getByText(/Share your benefits/)).toBeInTheDocument()
  })

  it("handles swipe right to go back (no-op on first screen)", () => {
    render(<SplashCarousel />)
    const body = screen.getByText(/Earn 5% cashback/).closest("div[class*='flex-1']")!

    fireEvent.touchStart(body, { targetTouches: [{ clientX: 200 }] })
    fireEvent.touchMove(body, { targetTouches: [{ clientX: 300 }] })
    fireEvent.touchEnd(body)

    // Still on first screen
    expect(screen.getByText(/Earn 5% cashback/)).toBeInTheDocument()
  })
})
