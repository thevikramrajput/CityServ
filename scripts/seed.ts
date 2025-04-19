import { sql } from "../lib/db"
import { hashPassword } from "../lib/auth"

async function seed() {
  console.log("🌱 Seeding database...")

  try {
    // Create services
    console.log("Creating services...")
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
      await sql`
        INSERT INTO services (title, description, icon, base_price)
        VALUES (${service.title}, ${service.description}, ${service.icon}, ${service.basePrice})
        ON CONFLICT (title) DO NOTHING
      `
    }

    // Create admin user
    console.log("Creating admin user...")
    const adminPassword = await hashPassword("admin123")
    await sql`
      INSERT INTO users (name, email, password, role)
      VALUES ('Admin User', 'admin@cityserv.com', ${adminPassword}, 'ADMIN')
      ON CONFLICT (email) DO NOTHING
    `

    // Create demo providers
    console.log("Creating demo providers...")
    const providerPassword = await hashPassword("provider123")

    // Get service IDs
    const plumbingService = await sql`SELECT id FROM services WHERE title = 'Plumbing'`
    const electricalService = await sql`SELECT id FROM services WHERE title = 'Electrical Work'`
    const carpentryService = await sql`SELECT id FROM services WHERE title = 'Carpentry'`

    if (plumbingService.length > 0) {
      // Create plumber
      const plumberResult = await sql`
        INSERT INTO users (name, email, password, role)
        VALUES ('John Smith', 'plumber@cityserv.com', ${providerPassword}, 'PROVIDER')
        ON CONFLICT (email) DO NOTHING
        RETURNING id
      `

      if (plumberResult.length > 0) {
        await sql`
          INSERT INTO providers (user_id, service_id, phone, experience, is_verified)
          VALUES (${plumberResult[0].id}, ${plumbingService[0].id}, '1234567890', 5, true)
          ON CONFLICT (user_id) DO NOTHING
        `
      }
    }

    if (electricalService.length > 0) {
      // Create electrician
      const electricianResult = await sql`
        INSERT INTO users (name, email, password, role)
        VALUES ('Sarah Johnson', 'electrician@cityserv.com', ${providerPassword}, 'PROVIDER')
        ON CONFLICT (email) DO NOTHING
        RETURNING id
      `

      if (electricianResult.length > 0) {
        await sql`
          INSERT INTO providers (user_id, service_id, phone, experience, is_verified)
          VALUES (${electricianResult[0].id}, ${electricalService[0].id}, '0987654321', 8, true)
          ON CONFLICT (user_id) DO NOTHING
        `
      }
    }

    if (carpentryService.length > 0) {
      // Create carpenter
      const carpenterResult = await sql`
        INSERT INTO users (name, email, password, role)
        VALUES ('Mike Wilson', 'carpenter@cityserv.com', ${providerPassword}, 'PROVIDER')
        ON CONFLICT (email) DO NOTHING
        RETURNING id
      `

      if (carpenterResult.length > 0) {
        await sql`
          INSERT INTO providers (user_id, service_id, phone, experience, is_verified)
          VALUES (${carpenterResult[0].id}, ${carpentryService[0].id}, '5556667777', 12, true)
          ON CONFLICT (user_id) DO NOTHING
        `
      }
    }

    // Create demo customer
    console.log("Creating demo customer...")
    const customerPassword = await hashPassword("customer123")
    await sql`
      INSERT INTO users (name, email, password, role)
      VALUES ('Customer Demo', 'customer@cityserv.com', ${customerPassword}, 'CUSTOMER')
      ON CONFLICT (email) DO NOTHING
    `

    console.log("✅ Seeding completed successfully!")
  } catch (error) {
    console.error("❌ Seeding failed:", error)
  }
}

seed()
