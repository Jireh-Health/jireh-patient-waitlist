"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react"
import { cn } from "cn"
import { Button } from "@/components/ui/button"
import JirehLogo from "@/components/JirehLogo"
import SplashProgressBar from "@/components/SplashProgressBar"

type Screen = {
  key: string
  title: React.ReactNode
  image: string
  imageAlt: string
}

const screens: Screen[] = [
  {
    key: "cashback",
    title: (
      <>
        Earn 5% cashback
        <br /> at partner hospitals.
      </>
    ),
    image: "/images/figma-oval-cashback.png",
    imageAlt: "Man smiling while checking his phone",
  },
  {
    key: "sharing",
    title: (
      <>
        Share your benefits
        <br /> with family and friends.
      </>
    ),
    image: "/images/figma-oval-sharing.png",
    imageAlt: "Family hugging and laughing together",
  },
  {
    key: "discounts",
    title: (
      <>
        Discover discounts
        <br /> at partner facilities.
      </>
    ),
    image: "/images/figma-oval-discounts.png",
    imageAlt: "Doctor and patient shaking hands at a partner clinic",
  },
  {
    key: "loans",
    title: (
      <>
        Join Jireh Plus and get
        <br /> 0% interest medical loans.
      </>
    ),
    image: "/images/figma-oval-loans.png",
    imageAlt: "Two friends reacting to good news on a phone",
  },
]

const MIN_SWIPE_DISTANCE = 50

export default function SplashCarousel() {
  const [currentScreen, setCurrentScreen] = useState(0)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)

  const router = useRouter()
  const activeScreen = screens[currentScreen]
  const isFirst = currentScreen === 0
  const isLast = currentScreen === screens.length - 1

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e: React.TouchEvent) =>
    setTouchEnd(e.targetTouches[0].clientX)

  const onTouchEnd = () => {
    if (touchStart == null || touchEnd == null) return
    const distance = touchStart - touchEnd
    if (distance > MIN_SWIPE_DISTANCE && !isLast) handleNext()
    if (distance < -MIN_SWIPE_DISTANCE && !isFirst) handlePrev()
  }

  const handleNext = () => {
    if (!isLast) setCurrentScreen((prev) => prev + 1)
  }

  const handlePrev = () => {
    if (!isFirst) setCurrentScreen((prev) => prev - 1)
  }

  return (
    <div className="min-h-screen bg-muted sm:flex sm:items-center sm:justify-center sm:p-8">
    <div className="flex flex-col h-screen sm:h-[85vh] sm:max-h-[780px] sm:w-full sm:max-w-sm sm:rounded-3xl sm:overflow-hidden sm:shadow-2xl bg-neutral-900 text-white">
      {/* Header */}
      <header className="flex items-center justify-center p-3 shrink-0">
        <JirehLogo variant="dark" />
      </header>

      {/* Body */}
      <div className="relative flex flex-col flex-1 min-h-0">
        <img
          src="/images/wavy-bg.png"
          alt=""
          aria-hidden
          className="pointer-events-none absolute inset-0 h-full w-full object-cover select-none"
          draggable={false}
        />
        <div
          className="relative z-10 flex flex-1 flex-col items-center justify-between gap-6 px-4 pt-4 pb-6"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <div
            key={activeScreen.key}
            role="img"
            aria-label={activeScreen.imageAlt}
            className="flex-1 min-h-0 w-full bg-contain bg-center bg-no-repeat animate-in fade-in duration-150"
            style={{ backgroundImage: `url(${activeScreen.image})` }}
          />

          <div className="flex flex-col items-center gap-4 w-full">
            <h1 className="text-center text-white">{activeScreen.title}</h1>
            <SplashProgressBar
              currentStep={currentScreen}
              totalSteps={screens.length}
              activeColor="bg-primary"
              inactiveColor="bg-primary/25"
              onStepClick={setCurrentScreen}
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex flex-col gap-3 bg-transparent px-4 pt-2 pb-4 shrink-0">
        <div className="flex items-center gap-2">
          <Button
            onClick={handlePrev}
            variant="ghost"
            size="icon"
            aria-label="Previous screen"
            className={cn(
              "shrink-0 text-white hover:bg-white/10 hover:text-white",
              isFirst && "invisible"
            )}
          >
            <ArrowLeftIcon className="w-6 h-6" />
          </Button>

          <Button
            onClick={() => router.push("/waitlist")}
            className="flex-1"
          >
            Join Waitlist
          </Button>

          <Button
            onClick={handleNext}
            variant="ghost"
            size="icon"
            aria-label="Next screen"
            className={cn(
              "shrink-0 text-white hover:bg-white/10 hover:text-white",
              isLast && "invisible"
            )}
          >
            <ArrowRightIcon className="w-6 h-6" />
          </Button>
        </div>
      </div>
    </div>
    </div>
  )
}
