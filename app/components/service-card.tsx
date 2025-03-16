import Image from "next/image"
import Link from "next/link"

import { Card, CardContent, CardFooter } from "@/components/ui/card"

interface ServiceCardProps {
  title: string
  description: string
  icon: string
  price: string
}

export function ServiceCard({ title, description, icon, price }: ServiceCardProps) {
  return (
    <Link href={`/services/${title.toLowerCase().replace(/\s+/g, "-")}`}>
      <Card className="transition-all hover:shadow-lg">
        <CardContent className="p-6">
          <Image src={icon || "/placeholder.svg"} alt={title} width={100} height={100} className="mx-auto rounded-lg" />
          <h3 className="mt-4 text-xl font-semibold">{title}</h3>
          <p className="mt-2 text-sm text-muted-foreground">{description}</p>
        </CardContent>
        <CardFooter className="p-6 pt-0">
          <p className="text-sm font-medium text-primary">{price}</p>
        </CardFooter>
      </Card>
    </Link>
  )
}

