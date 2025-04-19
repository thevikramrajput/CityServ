import { PrismaClient } from "@prisma/client"
import { hashPassword } from "../lib/auth"

const prisma = new PrismaClient()

async function main() {
  // Create services
  const services = [
    {
      title: "Plumbing",
      description: "Expert plumbers for all your needs",
      icon: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/plumbing.jpg-fbmWNNPvjCdqRVEIAZdPT6TIKI431h.jpeg",
      basePrice: 50,
    },
    {
      title: "Electrical Work",
      description: "Skilled electricians at your service",
      icon: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/electrician.jpg-caTme9qGVZRGWxx6Be0imyo33tdono.jpeg",
      basePrice: 60,
    },
    {
      title: "Carpentry",
      description: "Professional carpentry services",
      icon: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/carpenter.jpg-IHpy2PdVgg6y9IZa4IuW3JM74Pl8Mz.jpeg",
      basePrice: 55,
    },
    {
      title: "Home Cleaning",
      description: "Thorough home cleaning services",
      icon: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/home-cleaning.jpg-mawiyjD0KUVqRh90gCiTi4xGuRdLC1.jpeg",
      basePrice: 40,
    },
    {
      title: "Landscaping",
      description: "Transform your outdoor spaces",
      icon: "/landscaping-icon.jpg",
      basePrice: 45,
    },
    {
      title: "Painting",
      description: "Professional interior and exterior painting",
      icon: "/painting-icon.jpg",
      basePrice: 40,
    },
    {
      title: "HVAC Services",
      description: "Heating, ventilation, and air conditioning experts",
      icon: "/hvac-icon.jpg",
      basePrice: 70,
    },
    {
      title: "Pest Control",
      description: "Effective pest management solutions",
      icon: "/pest-control-icon.jpg",
      basePrice: 80,
    },
  ]

  for (const service of services) {
    await prisma.service.create({
      data: service,
    })
  }

  // Create admin user
  const adminPassword = await hashPassword("admin123")
  await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@cityserv.com",
      password: adminPassword,
      role: "ADMIN",
    },
  })

  // Create demo providers
  const providerPassword = await hashPassword("provider123")

  // Get service IDs
  const plumbingService = await prisma.service.findFirst({
    where: { title: "Plumbing" },
  })

  const electricalService = await prisma.service.findFirst({
    where: { title: "Electrical Work" },
  })

  const carpentryService = await prisma.service.findFirst({
    where: { title: "Carpentry" },
  })

  // Create plumber
  const plumber = await prisma.user.create({
    data: {
      name: "John Smith",
      email: "plumber@cityserv.com",
      password: providerPassword,
      role: "PROVIDER",
    },
  })

  await prisma.provider.create({
    data: {
      userId: plumber.id,
      serviceTypeId: plumbingService!.id,
      phone: "1234567890",
      experience: 5,
      isVerified: true,
    },
  })

  // Create electrician
  const electrician = await prisma.user.create({
    data: {
      name: "Sarah Johnson",
      email: "electrician@cityserv.com",
      password: providerPassword,
      role: "PROVIDER",
    },
  })

  await prisma.provider.create({
    data: {
      userId: electrician.id,
      serviceTypeId: electricalService!.id,
      phone: "0987654321",
      experience: 8,
      isVerified: true,
    },
  })

  // Create carpenter
  const carpenter = await prisma.user.create({
    data: {
      name: "Mike Wilson",
      email: "carpenter@cityserv.com",
      password: providerPassword,
      role: "PROVIDER",
    },
  })

  await prisma.provider.create({
    data: {
      userId: carpenter.id,
      serviceTypeId: carpentryService!.id,
      phone: "5556667777",
      experience: 12,
      isVerified: true,
    },
  })

  // Create demo customer
  const customerPassword = await hashPassword("customer123")
  await prisma.user.create({
    data: {
      name: "Customer Demo",
      email: "customer@cityserv.com",
      password: customerPassword,
      role: "CUSTOMER",
    },
  })

  console.log("Database seeded successfully!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
