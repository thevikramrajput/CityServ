"use server"

import { z } from "zod"
import { revalidatePath } from "next/cache"

import { sql } from "@/lib/db"
import { getCurrentUser } from "./auth"

const providerSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  serviceId: z.string().min(1, "Please select a service type"),
  experience: z.coerce.number().min(0, "Experience must be a positive number"),
})

export async function registerProvider(formData: FormData) {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    return {
      error: {
        _form: ["You must be logged in to register as a provider"],
      },
    }
  }

  const validatedFields = providerSchema.safeParse({
    fullName: formData.get("fullName"),
    phone: formData.get("phone"),
    serviceId: formData.get("serviceId"),
    experience: formData.get("experience"),
  })

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { fullName, phone, serviceId, experience } = validatedFields.data

  try {
    // Check if user is already a provider
    const existingProvider = await sql`
      SELECT * FROM providers WHERE user_id = ${currentUser.id}
    `

    if (existingProvider.length > 0) {
      return {
        error: {
          _form: ["You are already registered as a provider"],
        },
      }
    }

    // Update user name if different
    if (currentUser.name !== fullName) {
      await sql`
        UPDATE users
        SET name = ${fullName}
        WHERE id = ${currentUser.id}
      `
    }

    // Create provider
    await sql`
      INSERT INTO providers (user_id, phone, service_id, experience)
      VALUES (${currentUser.id}, ${phone}, ${serviceId}, ${experience})
    `

    // Update user role
    await sql`
      UPDATE users
      SET role = 'PROVIDER'
      WHERE id = ${currentUser.id}
    `

    revalidatePath("/register-provider")
    return { success: true }
  } catch (error) {
    console.error("Provider registration error:", error)
    return {
      error: {
        _form: ["An error occurred during registration. Please try again."],
      },
    }
  }
}
