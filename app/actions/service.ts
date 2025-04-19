"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "./auth"

export async function getServices() {
  try {
    const services = await prisma.service.findMany({
      orderBy: { title: "asc" },
    })
    return { services }
  } catch (error) {
    console.error("Get services error:", error)
    return { error: "Failed to fetch services" }
  }
}

export async function getServiceById(id: string) {
  try {
    const service = await prisma.service.findUnique({
      where: { id },
      include: {
        providers: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
          where: {
            isVerified: true,
          },
        },
      },
    })

    if (!service) {
      return { error: "Service not found" }
    }

    return { service }
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
    const service = await prisma.service.create({
      data: {
        title,
        description,
        icon,
        basePrice,
      },
    })

    revalidatePath("/services")
    return { success: true, service }
  } catch (error) {
    console.error("Create service error:", error)
    return { error: "Failed to create service" }
  }
}
