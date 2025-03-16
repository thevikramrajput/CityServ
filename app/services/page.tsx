import { ServiceCard } from "@/app/components/service-card"

const services = [
  {
    title: "Plumbing",
    description: "Expert plumbers for all your needs",
    icon: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/plumbing.jpg-fbmWNNPvjCdqRVEIAZdPT6TIKI431h.jpeg",
    price: "Starting at $50/hour",
  },
  {
    title: "Electrical Work",
    description: "Skilled electricians at your service",
    icon: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/electrician.jpg-caTme9qGVZRGWxx6Be0imyo33tdono.jpeg",
    price: "Starting at $60/hour",
  },
  {
    title: "Carpentry",
    description: "Professional carpentry services",
    icon: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/carpenter.jpg-IHpy2PdVgg6y9IZa4IuW3JM74Pl8Mz.jpeg",
    price: "Starting at $55/hour",
  },
  {
    title: "Home Cleaning",
    description: "Thorough home cleaning services",
    icon: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/home-cleaning.jpg-mawiyjD0KUVqRh90gCiTi4xGuRdLC1.jpeg",
    price: "Starting at $40/hour",
  },
  {
    title: "Landscaping",
    description: "Transform your outdoor spaces",
    icon: "/landscaping-icon.jpg",
    price: "Starting at $45/hour",
  },
  {
    title: "Painting",
    description: "Professional interior and exterior painting",
    icon: "/painting-icon.jpg",
    price: "Starting at $40/hour",
  },
  {
    title: "HVAC Services",
    description: "Heating, ventilation, and air conditioning experts",
    icon: "/hvac-icon.jpg",
    price: "Starting at $70/hour",
  },
  {
    title: "Pest Control",
    description: "Effective pest management solutions",
    icon: "/pest-control-icon.jpg",
    price: "Starting at $80/visit",
  },
]

export default function ServicesPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold mb-8 text-center">Our Services</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {services.map((service, index) => (
          <ServiceCard key={index} {...service} />
        ))}
      </div>
    </div>
  )
}

