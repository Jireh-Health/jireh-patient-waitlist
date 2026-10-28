import { validatePatientForm } from "@/lib/validations"

it("rejects missing firstName", () => {
  const result = validatePatientForm({ lastName: "Doe", phone: "0712345678" })
  expect(result.ok).toBe(false)
  expect((result as any).status).toBe(400)
})

it("rejects missing lastName", () => {
  const result = validatePatientForm({ firstName: "Jane", phone: "0712345678" })
  expect(result.ok).toBe(false)
})

it("rejects missing phone", () => {
  const result = validatePatientForm({ firstName: "Jane", lastName: "Doe" })
  expect(result.ok).toBe(false)
})

it("rejects phone with fewer than 9 digits", () => {
  const result = validatePatientForm({ firstName: "Jane", lastName: "Doe", phone: "071234" })
  expect(result.ok).toBe(false)
})

it("accepts valid input", () => {
  const result = validatePatientForm({ firstName: "Jane", lastName: "Doe", phone: "0712345678" })
  expect(result.ok).toBe(true)
  if (result.ok) {
    expect(result.data.firstName).toBe("Jane")
    expect(result.data.lastName).toBe("Doe")
    expect(result.data.phone).toBe("0712345678")
  }
})

it("accepts +254 international format", () => {
  const result = validatePatientForm({ firstName: "Jane", lastName: "Doe", phone: "+254712345678" })
  expect(result.ok).toBe(true)
})
