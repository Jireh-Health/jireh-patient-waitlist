"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { PhoneIcon } from "lucide-react"
import { patientWaitlistSchema, type PatientWaitlistData } from "@/lib/validations"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import JirehLogo from "@/components/JirehLogo"

export default function WaitlistForm() {
  const router = useRouter()
  const [consent, setConsent] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<PatientWaitlistData>({
    resolver: zodResolver(patientWaitlistSchema),
    mode: "onChange",
  })

  const onSubmit = async (data: PatientWaitlistData) => {
    setErrorMessage(null)
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (res.ok) {
        router.push("/waitlist/success")
      } else {
        const body = await res.json().catch(() => ({}))
        setErrorMessage(body?.error ?? "Something went wrong. Please try again.")
      }
    } catch {
      setErrorMessage("Something went wrong. Please try again.")
    }
  }

  return (
    <div className="min-h-screen bg-muted flex items-center justify-center p-4">
      <div className="bg-card rounded-lg shadow-sm p-6 flex flex-col gap-6 max-w-sm w-full">
        <div className="flex flex-col gap-4">
          <div className="flex justify-center">
            <JirehLogo variant="light" />
          </div>
          <img src="/icons/create-account.png" className="w-[70px] mx-auto" alt="" aria-hidden="true" />
          <h1 className="text-xl font-semibold text-center">Be first in line.</h1>
          <p className="text-sm text-muted-foreground text-center">
          Join the waitlist and be the first to know when Jireh Health relaunches.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="firstName">First name</Label>
            <input
              id="firstName"
              type="text"
              placeholder="Jane"
              className="h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base outline-none placeholder:text-muted-foreground focus-visible:border-ring md:text-sm"
              {...register("firstName")}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="lastName">Last name</Label>
            <input
              id="lastName"
              type="text"
              placeholder="Doe"
              className="h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base outline-none placeholder:text-muted-foreground focus-visible:border-ring md:text-sm"
              {...register("lastName")}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="phone">Phone number</Label>
            <div className="relative flex items-center">
              <PhoneIcon className="absolute left-2.5 size-4 text-muted-foreground pointer-events-none" />
              <input
                id="phone"
                type="tel"
                placeholder="0712 345 678"
                className="h-8 w-full min-w-0 rounded-lg border border-input bg-transparent pl-8 pr-2.5 py-1 text-base outline-none placeholder:text-muted-foreground focus-visible:border-ring md:text-sm"
                {...register("phone")}
              />
            </div>
            {errors.phone && (
              <p className="text-sm text-destructive">{errors.phone.message}</p>
            )}
          </div>

          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              id="consent"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-0.5 shrink-0"
            />
            <label htmlFor="consent" className="text-sm leading-snug cursor-pointer">
              I agree to be contacted by SMS when Jireh Health launches and only for that purpose.
            </label>
          </div>

          {errorMessage && (
            <p className="text-sm text-destructive">{errorMessage}</p>
          )}

          <Button
            type="submit"
            disabled={!consent || isSubmitting}
            className="w-full"
          >
            Submit
          </Button>
        </form>
      </div>
    </div>
  )
}
