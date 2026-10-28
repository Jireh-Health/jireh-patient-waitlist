import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { setupServer } from "msw/node"
import { http, HttpResponse, delay } from "msw"
import WaitlistForm from "@/components/WaitlistForm"

const server = setupServer(
  http.post("/api/waitlist", () => HttpResponse.json({ ok: true }, { status: 200 }))
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

it("submit button is disabled when consent is unchecked", async () => {
  render(<WaitlistForm />)
  await userEvent.type(screen.getByLabelText(/first name/i), "Jane")
  await userEvent.type(screen.getByLabelText(/last name/i), "Doe")
  await userEvent.type(screen.getByLabelText(/phone/i), "0712345678")
  expect(screen.getByRole("button", { name: /submit/i })).toBeDisabled()
})

it("submit button is enabled when all fields filled and consent checked", async () => {
  render(<WaitlistForm />)
  await userEvent.type(screen.getByLabelText(/first name/i), "Jane")
  await userEvent.type(screen.getByLabelText(/last name/i), "Doe")
  await userEvent.type(screen.getByLabelText(/phone/i), "0712345678")
  await userEvent.click(screen.getByRole("checkbox"))
  expect(screen.getByRole("button", { name: /submit/i })).toBeEnabled()
})

it("submit button is disabled while request is pending", async () => {
  server.use(
    http.post("/api/waitlist", async () => {
      await delay(200)
      return HttpResponse.json({ ok: true }, { status: 200 })
    })
  )
  render(<WaitlistForm />)
  await userEvent.type(screen.getByLabelText(/first name/i), "Jane")
  await userEvent.type(screen.getByLabelText(/last name/i), "Doe")
  await userEvent.type(screen.getByLabelText(/phone/i), "0712345678")
  await userEvent.click(screen.getByRole("checkbox"))
  await userEvent.click(screen.getByRole("button", { name: /submit/i }))
  expect(screen.getByRole("button", { name: /submit/i })).toBeDisabled()
})
