import express from "express"
import { CreateEvent } from "./application/CreateEvent.js"
import { EventRepositoryDrizzle } from "./resources/EventRepository.js"

const app = express()

app.use(express.json())

app.post("/events", async (req, res) => {
  const { name, ticketPriceInCents, latitude, longitude, date, ownerId } =
    req.body
  try {
    const eventRepositoryDrizzle = new EventRepositoryDrizzle()
    const createEvent = new CreateEvent(eventRepositoryDrizzle)
    const event = await createEvent.execute({
      date: new Date(date),
      name,
      ticketPriceInCents,
      latitude,
      longitude,
      ownerId,
    })
    return res.status(201).json(event)
  } catch (error: any) {
    console.error(error)
    return res.status(400).json({ message: error.message })
  }
})

app.listen(3000, () => {
  console.log("Server is running on port 3000")
})
