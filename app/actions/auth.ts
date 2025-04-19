"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { z } from "zod"

import { prisma } from "@/lib/prisma"
import { hashPassword, verifyPassword } from "@/lib/auth"

// Schema for sign up validation
const signUpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

// Schema for sign in validation
const signInSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
})

export async function signUp(formData: FormData) {
  const validatedFields = signUpSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  })

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { name, email, password } = validatedFields.data

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return {
        error: {
          email: ["User with this email already exists"],
        },
      }
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    })

    // Set session cookie
    cookies().set("userId", user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    })

    return { success: true, userId: user.id }
  } catch (error) {
    console.error("Sign up error:", error)
    return {
      error: {
        _form: ["An error occurred during sign up. Please try again."],
      },
    }
  }
}

export async function signIn(formData: FormData) {
  const validatedFields = signInSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  })

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { email, password } = validatedFields.data

  try {
    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return {
        error: {
          _form: ["Invalid email or password"],
        },
      }
    }

    // Verify password
    const isValid = await verifyPassword(password, user.password)

    if (!isValid) {
      return {
        error: {
          _form: ["Invalid email or password"],
        },
      }
    }

    // Set session cookie
    cookies().set("userId", user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    })

    return { success: true, userId: user.id }
  } catch (error) {
    console.error("Sign in error:", error)
    return {
      error: {
        _form: ["An error occurred during sign in. Please try again."],
      },
    }
  }
}

export async function signOut() {
  cookies().delete("userId")
  redirect("/")
}

export async function getCurrentUser() {
  const userId = cookies().get("userId")?.value

  if (!userId) {
    return null
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
      },
    })

    return user
  } catch (error) {
    console.error("Get current user error:", error)
    return null
  }
}
