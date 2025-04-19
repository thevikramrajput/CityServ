"use server"

import { z } from "zod"
import { revalidatePath } from "next/cache"
import { sql, toCamelCaseArray } from "@/lib/db"
import { getCurrentUser } from "./auth"

const bookingSchema = z.object({
  providerId: z.string().min(1, "Provider is required"),
  serviceId: z.string().min(1, "Service is required"),
  date: z.string().min(1, "Date is required"),
  startTime: z.string().min(1, "Start time is required"),
  description: z.string().optional(),
})

export async function createBooking(formData: FormData) {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    return {
      error: {
        _form: ["You must be logged in to book a service"],
      },
    }
  }

  const validatedFields = bookingSchema.safeParse({
    providerId: formData.get("providerId"),
    serviceId: formData.get("serviceId"),
    date: formData.get("date"),
    startTime: formData.get("startTime"),
    description: formData.get("description"),
  })

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { providerId, serviceId, date, startTime, description } = validatedFields.data

  try {
    // Get service details for pricing
    const services = await sql`
      SELECT * FROM services
      WHERE id = ${serviceId}
    `

    if (services.length === 0) {
      return {
        error: {
          _form: ["Service not found"],
        },
      }
    }

    const service = services[0]

    // Parse date and time
    const bookingDate = new Date(date)
    const [hours, minutes] = startTime.split(":").map(Number)

    // Calculate end time (1 hour later)
    const endHours = hours + 1
    const endTime = `${endHours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`

    // Create booking
    const result = await sql`
      INSERT INTO bookings (
        user_id, provider_id, service_id, 
        booking_date, start_time, end_time, 
        total_price, description, status
      )
      VALUES (
        ${currentUser.id}, ${providerId}, ${serviceId}, 
        ${bookingDate.toISOString().split("T")[0]}, ${startTime}, ${endTime}, 
        ${service.base_price}, ${description || null}, 'PENDING'
      )
      RETURNING id
    `

    revalidatePath("/bookings")
    return { success: true, bookingId: result[0].id }
  } catch (error) {
    console.error("Booking creation error:", error)
    return {
      error: {
        _form: ["An error occurred while creating your booking. Please try again."],
      },
    }
  }
}

export async function getUserBookings() {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    return { error: "Unauthorized" }
  }

  try {
    const bookings = await sql`
      SELECT 
        b.*,
        s.title as service_title, s.description as service_description, s.icon as service_icon,
        u.name as provider_name, u.image_url as provider_image
      FROM bookings b
      JOIN services s ON b.service_id = s.id
      JOIN providers p ON b.provider_id = p.id
      JOIN users u ON p.user_id = u.id
      WHERE b.user_id = ${currentUser.id}
      ORDER BY b.booking_date DESC, b.start_time DESC
    `

    return { bookings: toCamelCaseArray(bookings) }
  } catch (error) {
    console.error("Get user bookings error:", error)
    return { error: "Failed to fetch bookings" }
  }
}

export async function getProviderBookings() {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    return { error: "Unauthorized" }
  }

  try {
    const providers = await sql`
      SELECT id FROM providers WHERE user_id = ${currentUser.id}
    `

    if (providers.length === 0) {
      return { error: "Provider not found" }
    }

    const providerId = providers[0].id

    const bookings = await sql`
      SELECT 
        b.*,
        s.title as service_title, s.description as service_description,
        u.name as customer_name, u.email as customer_email, u.image_url as customer_image
      FROM bookings b
      JOIN services s ON b.service_id = s.id
      JOIN users u ON b.user_id = u.id
      WHERE b.provider_id = ${providerId}
      ORDER BY b.booking_date DESC, b.start_time DESC
    `

    return { bookings: toCamelCaseArray(bookings) }
  } catch (error) {
    console.error("Get provider bookings error:", error)
    return { error: "Failed to fetch bookings" }
  }
}

export async function updateBookingStatus(bookingId: string, status: "CONFIRMED" | "COMPLETED" | "CANCELLED") {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    return { error: "Unauthorized" }
  }

  try {
    const providers = await sql`
      SELECT id FROM providers WHERE user_id = ${currentUser.id}
    `

    if (providers.length === 0) {
      return { error: "Provider not found" }
    }

    const providerId = providers[0].id

    const bookings = await sql`
      SELECT * FROM bookings WHERE id = ${bookingId}
    `

    if (bookings.length === 0) {
      return { error: "Booking not found" }
    }

    const booking = bookings[0]

    if (booking.provider_id !== providerId) {
      return { error: "Unauthorized" }
    }

    await sql`
      UPDATE bookings
      SET status = ${status}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${bookingId}
    `

    revalidatePath("/bookings")
    return { success: true }
  } catch (error) {
    console.error("Update booking status error:", error)
    return { error: "Failed to update booking status" }
  }
}
