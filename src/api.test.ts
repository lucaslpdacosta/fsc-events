import axios from "axios"

axios.defaults.validateStatus = function () {
  return true
}

describe("POST /events", () => {
  test("Deve criar um evento com sucesso", async () => {
    const input = {
      name: "FSC Presencial",
      ticketPriceInCents: 1000,
      latitude: -90.0,
      longitude: -180,
      date: new Date().setHours(new Date().getHours() + 1),
      ownerId: crypto.randomUUID(),
    }
    const response = await axios.post("http://localhost:3000/events", input)
    expect(response.status).toBe(201)
    expect(response.data.name).toBe(input.name)
    expect(response.data.ticketPriceInCents).toBe(input.ticketPriceInCents)
    expect(response.data.ownerId).toBe(input.ownerId)
  })
  test("Deve retornar 400 se createEvent lançar uma exceção", async () => {
    const input = {
      name: "FSC Presencial",
      ticketPriceInCents: 1000,
      latitude: -90,
      longitude: -180,
      date: new Date().setHours(new Date().getHours() + 1),
      ownerId: "invalid-uuid",
    }
    const response = await axios.post("http://localhost:3000/events", input)
    expect(response.status).toBe(400)
  })
})
