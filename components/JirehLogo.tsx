import { cn } from "cn"

type JirehLogoProps = {
  variant: "dark" | "light"
  className?: string
}

export default function JirehLogo({ variant, className }: JirehLogoProps) {
  const src =
    variant === "dark"
      ? "/icons/full-logo-splash.svg"
      : "/icons/full-logo.svg"

  return (
    <img
      src={src}
      alt="Jireh Health logo"
      className={cn("h-6 w-auto", className)}
      draggable={false}
    />
  )
}
