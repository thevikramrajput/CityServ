import { Search } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ServiceCard } from "@/app/components/service-card"
import { FeatureCard } from "@/app/components/feature-card"
import { FounderCard } from "@/app/components/founder-card"
import { NavBar } from "@/app/components/nav-bar"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <NavBar />

      <main className="flex-1">
        <section className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary-foreground opacity-90" />
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/hero-background.jpg')" }}
          />
          <div className="container relative py-24 text-center">
            <h1 className="text-4xl font-bold tracking-tighter text-white sm:text-5xl md:text-6xl">
              Book Skilled Professionals in Your City
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-white/90">
              Find and book trusted local service providers for all your home and personal needs
            </p>
            <div className="mx-auto mt-8 flex max-w-md items-center space-x-2 px-4">
              <Input className="h-12 bg-white" placeholder="Search for plumbers, electricians, etc..." />
              <Button size="lg" className="h-12">
                <Search className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </section>

        <section className="container py-12">
          <h2 className="text-3xl font-bold tracking-tight">Popular Services</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <ServiceCard
              title="Plumbing"
              description="Expert plumbers for all your needs"
              icon="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/plumbing.jpg-fbmWNNPvjCdqRVEIAZdPT6TIKI431h.jpeg"
              price="Starting at $50/hour"
            />
            <ServiceCard
              title="Electrical Work"
              description="Skilled electricians at your service"
              icon="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/electrician.jpg-caTme9qGVZRGWxx6Be0imyo33tdono.jpeg"
              price="Starting at $60/hour"
            />
            <ServiceCard
              title="Carpentry"
              description="Professional carpentry services"
              icon="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/carpenter.jpg-IHpy2PdVgg6y9IZa4IuW3JM74Pl8Mz.jpeg"
              price="Starting at $55/hour"
            />
            <ServiceCard
              title="Home Cleaning"
              description="Thorough home cleaning services"
              icon="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/home-cleaning.jpg-mawiyjD0KUVqRh90gCiTi4xGuRdLC1.jpeg"
              price="Starting at $40/hour"
            />
          </div>
        </section>

        <section className="container py-12 bg-muted/50">
          <h2 className="text-3xl font-bold tracking-tight text-center">Why Choose Skill Hub?</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              title="Verified Professionals"
              description="All service providers are background-checked and skill-verified"
              icon="Shield"
            />
            <FeatureCard
              title="Instant Booking"
              description="Book services instantly with real-time availability"
              icon="Calendar"
            />
            <FeatureCard title="Fair Pricing" description="Transparent pricing with no hidden fees" icon="DollarSign" />
          </div>
        </section>

        <section className="container py-12">
          <Card>
            <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold">Are You a Skilled Professional?</h3>
                <p className="mt-2 text-muted-foreground">Join Skill Hub and connect with customers in your area</p>
              </div>
              <Button size="lg" className="mt-4 md:mt-0">
                <Link href="/register-provider">Register as a Provider</Link>
              </Button>
            </CardContent>
          </Card>
        </section>

        <section className="container py-12">
          <h2 className="text-3xl font-bold tracking-tight text-center mb-8">Our Leadership</h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <FounderCard
              name="Vikram Madhad"
              role="Founder & CEO"
              image="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Vikram.jpg-VqtqgwXDfzIJuZfNF5BcA8nt7CJZli.jpeg"
              bio="Vikram has over 15 years of experience in the service industry."
            />
            <FounderCard
              name="Pratham"
              role="Co-Founder & COO"
              image="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pratham-GwT5LWOxrz7IKYCjhbF4UYfKD7qxrW.png"
              bio="Pratham brings 10 years of operations expertise to Skill Hub."
            />
            <FounderCard
              name="Kartik Patel"
              role="Co-Founder & CTO"
              image="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/kartik-Qegtb7o4SEzxHp8rHyakartq1eFbCR.png"
              bio="Kartik is a tech veteran with multiple successful startups."
            />
            <FounderCard
              name="Piyush Sharma"
              role="Co-Founder & CMO"
              image="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/piyush-uM1xnWrTmmOZk2yAqJwVeLajkqyG4W.png"
              bio="Piyush leads our marketing strategy with innovative approaches."
            />
          </div>
        </section>
      </main>

      <footer className="border-t">
        <div className="container py-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <h3 className="text-lg font-semibold">Company</h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link href="/about" className="text-sm text-muted-foreground hover:text-primary">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="text-sm text-muted-foreground hover:text-primary">
                    Careers
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Services</h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link href="/services" className="text-sm text-muted-foreground hover:text-primary">
                    All Services
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="text-sm text-muted-foreground hover:text-primary">
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold">For Providers</h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link href="/register-provider" className="text-sm text-muted-foreground hover:text-primary">
                    Become a Provider
                  </Link>
                </li>
                <li>
                  <Link href="/provider-faq" className="text-sm text-muted-foreground hover:text-primary">
                    Provider FAQ
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Legal</h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t pt-8 text-center">
            <p className="text-sm text-muted-foreground">© 2024 Skill Hub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
