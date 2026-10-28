import { vi, it, expect, beforeEach } from "vitest"
import { POST } from "@/app/api/waitlist/route"
import { NextRequest } from "next/server"

vi.mock("@/lib/supabase", () => ({
  supabaseClient: {
    from: vi.fn(),
  },
}))

vi.mock("@/lib/resend", () => ({
  resendClient: {
    emails: {
      send: vi.fn().mockResolvedValue({ data: null, error: null }),
    },
  },
}))

import { supabaseClient } from "@/lib/supabase"
import { resendClient } from "@/lib/resend"

beforeEach(() => {
  vi.clearAllMocks()
  // default happy-path: supabase insert succeeds
  vi.mocked(supabaseClient.from).mockReturnValue({
    insert: vi.fn().mockResolvedValue({ error: null }),
  } as any)
  // default: resend send succeeds
  vi.mocked(resendClient.emails.send).mockResolvedValue({ data: null, error: null } as any)
})

it("returns 400 on missing firstName", async () => {
  const req = new NextRequest("http://localhost/api/waitlist", {
    method: "POST",
    body: JSON.stringify({ lastName: "Doe", phone: "0712345678" }),
    headers: { "Content-Type": "application/json" },
  })
  const res = await POST(req)
  expect(res.status).toBe(400)
})

it("returns 200 and calls supabase insert + resend on valid body", async () => {
  const mockInsert = vi.fn().mockResolvedValue({ error: null })
  vi.mocked(supabaseClient.from).mockReturnValue({ insert: mockInsert } as any)

  const req = new NextRequest("http://localhost/api/waitlist", {
    method: "POST",
    body: JSON.stringify({ firstName: "Jane", lastName: "Doe", phone: "0712345678" }),
    headers: { "Content-Type": "application/json" },
  })
  const res = await POST(req)
  expect(res.status).toBe(200)
  expect(mockInsert).toHaveBeenCalledWith(
    expect.objectContaining({ first_name: "Jane", last_name: "Doe", phone: "0712345678" })
  )
  expect(resendClient.emails.send).toHaveBeenCalled()
})

it("returns 500 when Supabase insert returns error", async () => {
  vi.mocked(supabaseClient.from).mockReturnValue({
    insert: vi.fn().mockResolvedValue({ error: { message: "DB error" } }),
  } as any)

  const req = new NextRequest("http://localhost/api/waitlist", {
    method: "POST",
    body: JSON.stringify({ firstName: "Jane", lastName: "Doe", phone: "0712345678" }),
    headers: { "Content-Type": "application/json" },
  })
  const res = await POST(req)
  expect(res.status).toBe(500)
})

it("returns 200 even when Resend returns error (notification failure is non-blocking)", async () => {
  vi.mocked(resendClient.emails.send).mockResolvedValue({ data: null, error: { message: "Resend error" } } as any)

  const req = new NextRequest("http://localhost/api/waitlist", {
    method: "POST",
    body: JSON.stringify({ firstName: "Jane", lastName: "Doe", phone: "0712345678" }),
    headers: { "Content-Type": "application/json" },
  })
  const res = await POST(req)
  expect(res.status).toBe(200)
})
