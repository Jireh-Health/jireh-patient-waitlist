import { NextRequest, NextResponse } from "next/server"
import { validatePatientForm } from "@/lib/validations"
import { supabaseClient } from "@/lib/supabase"
import { resendClient } from "@/lib/resend"

export async function POST(req: NextRequest): Promise<Response> {
  const body = await req.json()

  const validation = validatePatientForm(body)
  if (!validation.ok) {
    return NextResponse.json({ error: validation.error }, { status: 400 })
  }

  const { firstName, lastName, phone } = validation.data

  const { error: dbError } = await supabaseClient
    .from("patient_waitlist")
    .insert({
      first_name: firstName,
      last_name: lastName,
      phone,
      consented_at: new Date().toISOString(),
    })

  if (dbError) {
    console.error("Supabase insert error:", JSON.stringify(dbError))
    return NextResponse.json({ error: "Failed to save to waitlist" }, { status: 500 })
  }

  const { error: emailError } = await resendClient.emails.send({
    from: process.env.RESEND_FROM_EMAIL ?? "Jireh Health <onboarding@resend.dev>",
    to: process.env.NOTIFICATION_EMAIL!,
    subject: "New patient waitlist sign-up",
    text: `Name: ${firstName} ${lastName}\nPhone: ${phone}`,
  })

  if (emailError) {
    // Notification failure is non-blocking: log but still return success
    console.error("Resend notification error:", emailError)
  }

  return NextResponse.json({ success: true }, { status: 200 })
}
