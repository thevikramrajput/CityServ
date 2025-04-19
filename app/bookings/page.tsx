"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { Calendar, Clock } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { getUserBookings } from "@/app/actions/booking"
import { getCurrentUser } from "@/app/actions/auth"

export default function BookingsPage() {
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    async function loadData() {
      const user = await getCurrentUser()

      if (!user) {
        router.push("/sign-in?redirect=/bookings")
        return
      }

      const { bookings: bookingsData, error } = await getUserBookings()
      setLoading(false)

      if (error) {
        setError(error)
      } else if (bookingsData) {
        setBookings(bookingsData)
      }
    }

    loadData()
  }, [router])

  if (loading) {
    return <div className="container py-10 text-center">Loading your bookings...</div>
  }

  if (error) {
    return <div className="container py-10 text-center text-destructive">{error}</div>
  }

  const upcomingBookings = bookings.filter(
    (booking) => new Date(booking.date) >= new Date() && booking.status !== "CANCELLED",
  )

  const pastBookings = bookings.filter(
    (booking) => new Date(booking.date) < new Date() || booking.status === "CANCELLED",
  )

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
            Pending
          </Badge>
        )
      case "CONFIRMED":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800">
            Confirmed
          </Badge>
        )
      case "COMPLETED":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800">
            Completed
          </Badge>
        )
      case "CANCELLED":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800">
            Cancelled
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">My Bookings</h1>

      <Tabs defaultValue="upcoming">
        <TabsList className="mb-4">
          <TabsTrigger value="upcoming">Upcoming ({upcomingBookings.length})</TabsTrigger>
          <TabsTrigger value="past">Past ({pastBookings.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming">
          {upcomingBookings.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-muted-foreground">You don't have any upcoming bookings</p>
              <Button className="mt-4" asChild>
                <a href="/services">Browse Services</a>
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {upcomingBookings.map((booking) => (
                <Card key={booking.id}>
                  <CardHeader>
                    <CardTitle>{booking.service.title}</CardTitle>
                    <CardDescription>Provider: {booking.provider.user.name}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>{format(new Date(booking.date), "PPP")}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>{format(new Date(booking.startTime), "p")}</span>
                      </div>
                      <div className="mt-2">{getStatusBadge(booking.status)}</div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full" asChild>
                      <a href={`/bookings/${booking.id}`}>View Details</a>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="past">
          {pastBookings.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-muted-foreground">You don't have any past bookings</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {pastBookings.map((booking) => (
                <Card key={booking.id}>
                  <CardHeader>
                    <CardTitle>{booking.service.title}</CardTitle>
                    <CardDescription>Provider: {booking.provider.user.name}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>{format(new Date(booking.date), "PPP")}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>{format(new Date(booking.startTime), "p")}</span>
                      </div>
                      <div className="mt-2">{getStatusBadge(booking.status)}</div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full" asChild>
                      <a href={`/bookings/${booking.id}`}>View Details</a>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
