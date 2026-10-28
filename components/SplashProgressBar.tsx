export type SplashProgressBarProps = {
  currentStep: number
  activeColor?: string
  inactiveColor?: string
  totalSteps?: number
  /** When set, each dot becomes a clickable button that reports its index. */
  onStepClick?: (step: number) => void
}

export default function SplashProgressBar({
  currentStep,
  activeColor = "bg-primary",
  inactiveColor = "bg-primary/25",
  totalSteps = 5,
  onStepClick,
}: SplashProgressBarProps) {
  return (
    <div className="flex items-center gap-2 justify-center">
      {Array.from({ length: totalSteps }).map((_, index) => {
        const dotClass = `h-2.5 w-2.5 rounded-full transition-all duration-300 ${
          index === currentStep ? activeColor : inactiveColor
        }`
        if (onStepClick == null) {
          return <div key={index} className={dotClass} />
        }
        return (
          <button
            key={index}
            type="button"
            onClick={() => onStepClick(index)}
            aria-label={`Go to screen ${index + 1}`}
            aria-current={index === currentStep ? "step" : undefined}
            className="flex p-1 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span className={`block ${dotClass}`} />
          </button>
        )
      })}
    </div>
  )
}
