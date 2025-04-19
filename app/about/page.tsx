import Image from "next/image"
import { FounderCard } from "@/app/components/founder-card"

export default function AboutPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold mb-8 text-center">About Skill Hub</h1>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
        <p className="text-lg mb-4">
          At Skill Hub, our mission is to connect skilled professionals with customers in need of quality home services.
          We strive to make the process of finding and booking trusted service providers as seamless and efficient as
          possible.
        </p>
        <Image src="/about-image.jpg" alt="Skill Hub team" width={800} height={400} className="rounded-lg shadow-md" />
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
        <p className="text-lg mb-4">
          Founded in 2025, Skill Hub was born out of the frustration of finding reliable home service providers. Our
          founders experienced firsthand the challenges of coordinating various home services and decided to create a
          solution that would benefit both service providers and customers alike.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Our Leadership</h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <FounderCard
            name="Vikram Madhad"
            role="Founder & CEO"
            image="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Vikram.jpg-VqtqgwXDfzIJuZfNF5BcA8nt7CJZli.jpeg"
            bio="Vikram has over 15 years of experience in the service industry."
          />
          <FounderCard
            name="Pratham Choudhary"
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
    </div>
  )
}
