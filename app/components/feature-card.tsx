import { Calendar, DollarSign, Shield, Star, type LucideIcon } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"

interface FeatureCardProps {
  title: string
  description: string
  icon: "Shield" | "Calendar" | "Star" | "DollarSign"
}

export function FeatureCard({ title, description, icon }: FeatureCardProps) {
  const IconComponent: Record<string, LucideIcon> = {
    Shield,
    Calendar,
    Star,
    DollarSign,
  }

  const Icon = IconComponent[icon]

  return (
    <Card>
      <CardContent className="p-6">
        {Icon && <Icon className="h-12 w-12 text-primary" />}
        <h3 className="mt-4 text-xl font-semibold">{title}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}

