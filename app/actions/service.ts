"use server"

import { revalidatePath } from "next/cache"
import { sql, toCamelCase, toCamelCaseArray } from "@/lib/db"
import { getCurrentUser } from "./auth"

export async function getServices() {
  try {
    const services = await sql`
      SELECT * FROM services
      ORDER BY title ASC
    `

    return { services: toCamelCaseArray(services) }
  } catch (error) {
    console.error("Get services error:", error)
    return { error: "Failed to fetch services" }
  }
}

export async function getServiceById(id: string) {
  try {
    const services = await sql`
      SELECT * FROM services
      WHERE id = ${id}
    `

    if (services.length === 0) {
      return { error: "Service not found" }
    }

    const service = toCamelCase(services[0])

    // Get providers for this service
    const providers = await sql`
      SELECT p.*, u.name, u.email, u.image_url
      FROM providers p
      JOIN users u ON p.user_id = u.id
      WHERE p.service_id = ${id}
      AND p.is_verified = true
    `

    return {
      service: {
        ...service,
        providers: toCamelCaseArray(providers),
      },
    }
  } catch (error) {
    console.error("Get service error:", error)
    return { error: "Failed to fetch service" }
  }
}

export async function createService(formData: FormData) {
  const currentUser = await getCurrentUser()

  if (!currentUser || currentUser.role !== "ADMIN") {
    return { error: "Unauthorized" }
  }

  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const icon = formData.get("icon") as string
  const basePrice = Number.parseFloat(formData.get("basePrice") as string)

  if (!title || !description || !icon || isNaN(basePrice)) {
    return { error: "Invalid input" }
  }

  try {
    const result = await sql`
      INSERT INTO services (title, description, icon, base_price)
      VALUES (${title}, ${description}, ${icon}, ${basePrice})
      RETURNING *
    `

    revalidatePath("/services")
    return { success: true, service: toCamelCase(result[0]) }
  } catch (error) {
    console.error("Create service error:", error)
    return { error: "Failed to create service" }
  }
}
