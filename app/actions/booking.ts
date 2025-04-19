"use server"

import { z } from "zod"
import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
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
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
    })

    if (!service) {
      return {
        error: {
          _form: ["Service not found"],
        },
      }
    }

    // Parse date and time
    const bookingDate = new Date(date)
    const [hours, minutes] = startTime.split(":").map(Number)
    const startDateTime = new Date(bookingDate)
    startDateTime.setHours(hours, minutes)

    // Default booking duration to 1 hour
    const endDateTime = new Date(startDateTime)
    endDateTime.setHours(endDateTime.getHours() + 1)

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        userId: currentUser.id,
        providerId,
        serviceId,
        date: bookingDate,
        startTime: startDateTime,
        endTime: endDateTime,
        totalPrice: service.basePrice,
        description: description || undefined,
      },
    })

    revalidatePath("/bookings")
    return { success: true, bookingId: booking.id }
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
    const bookings = await prisma.booking.findMany({
      where: { userId: currentUser.id },
      include: {
        service: true,
        provider: {
          include: {
            user: {
              select: {
                name: true,
                image: true,
              },
            },
          },
        },
      },
      orderBy: { date: "desc" },
    })

    return { bookings }
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
    const provider = await prisma.provider.findUnique({
      where: { userId: currentUser.id },
    })

    if (!provider) {
      return { error: "Provider not found" }
    }

    const bookings = await prisma.booking.findMany({
      where: { providerId: provider.id },
      include: {
        service: true,
        user: {
          select: {
            name: true,
            email: true,
            image: true,
          },
        },
      },
      orderBy: { date: "desc" },
    })

    return { bookings }
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
    const provider = await prisma.provider.findUnique({
      where: { userId: currentUser.id },
    })

    if (!provider) {
      return { error: "Provider not found" }
    }

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
    })

    if (!booking) {
      return { error: "Booking not found" }
    }

    if (booking.providerId !== provider.id) {
      return { error: "Unauthorized" }
    }

    await prisma.booking.update({
      where: { id: bookingId },
      data: { status },
    })

    revalidatePath("/bookings")
    return { success: true }
  } catch (error) {
    console.error("Update booking status error:", error)
    return { error: "Failed to update booking status" }
  }
}
