import { EventRepositoryDrizzle } from "../resources/EventRepository.js"
import { CreateEvent } from "./CreateEvent.js"

describe("Create Event", () => {
  const createEvent = new CreateEvent(new EventRepositoryDrizzle())

  test("Deve criar um evento com sucesso", async () => {
    const input = {
      name: "FSC Presencial",
      ticketPriceInCents: 1000,
      latitude: -90,
      longitude: -180,
      date: new Date(new Date().setHours(new Date().getHours() + 1)),
      ownerId: crypto.randomUUID(),
    }
    const output = await createEvent.execute(input)
    expect(output.id).toBeDefined()
    expect(output.name).toBe(input.name)
    expect(output.ticketPriceInCents).toBe(input.ticketPriceInCents)
    expect(output.ownerId).toBe(input.ownerId)
  })
  test("Deve lançar um erro se o ownerId não for um UUID", async () => {
    const input = {
      name: "FSC Presencial",
      ticketPriceInCents: 1000,
      latitude: -90,
      longitude: -180,
      date: new Date(new Date().setHours(new Date().getHours() + 1)),
      ownerId: "invalid-uuid",
    }
    const output = createEvent.execute(input)
    await expect(output).rejects.toThrow(new Error("Invalid ownerId"))
  })
  test("Deve lançar um erro se o ticket price in cents for negativo", async () => {
    const input = {
      name: "FSC Presencial",
      ticketPriceInCents: -10,
      latitude: -90,
      longitude: -180,
      date: new Date(new Date().setHours(new Date().getHours() + 1)),
      ownerId: crypto.randomUUID(),
    }
    const output = createEvent.execute(input)
    await expect(output).rejects.toThrow(new Error("Invalid ticket price"))
  })
  test("Deve lançar um erro se a latitude for inválida", async () => {
    const input = {
      name: "FSC Presencial",
      ticketPriceInCents: 2000,
      latitude: -100,
      longitude: -180,
      date: new Date(new Date().setHours(new Date().getHours() + 1)),
      ownerId: crypto.randomUUID(),
    }
    const output = createEvent.execute(input)
    await expect(output).rejects.toThrow(new Error("Invalid latitude"))
  })
  test("Deve lançar um erro se a longitude for inválida", async () => {
    const input = {
      name: "FSC Presencial",
      ticketPriceInCents: 2000,
      latitude: -90,
      longitude: -200,
      date: new Date(new Date().setHours(new Date().getHours() + 1)),
      ownerId: crypto.randomUUID(),
    }
    const output = createEvent.execute(input)
    await expect(output).rejects.toThrow(new Error("Invalid longitude"))
  })

  test("Deve lançar um erro se a data for no passado", async () => {
    const input = {
      name: "FSC Presencial",
      ticketPriceInCents: 2000,
      latitude: -90,
      longitude: -180,
      date: new Date(new Date().setHours(new Date().getHours() - 2)),
      ownerId: crypto.randomUUID(),
    }
    const output = createEvent.execute(input)
    await expect(output).rejects.toThrow(
      new Error("Date must be in the future")
    )
  })
  test("Deve lançar um erro se já existir um evento para a mesma data, latitude e longitude", async () => {
    const date = new Date(new Date().setHours(new Date().getHours() + 2))
    const input = {
      name: "FSC Presencial",
      ticketPriceInCents: 2000,
      latitude: -90.0,
      longitude: -180.0,
      date,
      ownerId: crypto.randomUUID(),
    }
    const output = await createEvent.execute(input)
    expect(output.name).toBe(input.name)
    expect(output.ticketPriceInCents).toBe(input.ticketPriceInCents)
    const output2 = createEvent.execute(input)
    await expect(output2).rejects.toThrow(new Error("Event already exists"))
  })
})
