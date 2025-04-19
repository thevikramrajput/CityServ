import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"

interface FounderCardProps {
  name: string
  role: string
  image: string
  bio: string
}

export function FounderCard({ name, role, image, bio }: FounderCardProps) {
  return (
    <Card>
      <CardContent className="p-6 text-center">
        <Image src={image || "/placeholder.svg"} alt={name} width={150} height={150} className="mx-auto rounded-full" />
        <h3 className="mt-4 text-xl font-semibold">{name}</h3>
        <p className="text-sm text-muted-foreground">{role}</p>
        <p className="mt-2 text-sm">{bio}</p>
      </CardContent>
    </Card>
  )
}
