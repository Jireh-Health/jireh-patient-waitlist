import { z } from "zod"

export const patientWaitlistSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  phone: z
    .string()
    .refine(
      (val) => val.replace(/\D/g, "").length >= 9,
      "Phone must have at least 9 digits"
    ),
})

export type PatientWaitlistData = z.infer<typeof patientWaitlistSchema>

export function validatePatientForm(
  body: unknown
):
  | { ok: true; data: PatientWaitlistData }
  | { ok: false; error: string; status: 400 } {
  const result = patientWaitlistSchema.safeParse(body)
  if (!result.success) {
    return {
      ok: false,
      error: result.error.issues[0].message,
      status: 400 as const,
    }
  }
  return { ok: true, data: result.data }
}
