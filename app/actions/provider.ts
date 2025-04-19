"use server"

import { z } from "zod"
import { revalidatePath } from "next/cache"

import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "./auth"

const providerSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  serviceType: z.string().min(1, "Please select a service type"),
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
    serviceType: formData.get("serviceType"),
    experience: formData.get("experience"),
  })

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { fullName, phone, serviceType, experience } = validatedFields.data

  try {
    // Check if user is already a provider
    const existingProvider = await prisma.provider.findUnique({
      where: { userId: currentUser.id },
    })

    if (existingProvider) {
      return {
        error: {
          _form: ["You are already registered as a provider"],
        },
      }
    }

    // Update user name if different
    if (currentUser.name !== fullName) {
      await prisma.user.update({
        where: { id: currentUser.id },
        data: { name: fullName },
      })
    }

    // Create provider
    await prisma.provider.create({
      data: {
        userId: currentUser.id,
        phone,
        serviceTypeId: serviceType,
        experience,
      },
    })

    // Update user role
    await prisma.user.update({
      where: { id: currentUser.id },
      data: { role: "PROVIDER" },
    })

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
