"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { Calendar, Clock, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { getProviderBookings, updateBookingStatus } from "@/app/actions/booking"
import { getCurrentUser } from "@/app/actions/auth"

export default function ProviderDashboard() {
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    async function loadData() {
      const user = await getCurrentUser()

      if (!user) {
        router.push("/sign-in?redirect=/provider/dashboard")
        return
      }

      if (user.role !== "PROVIDER") {
        router.push("/register-provider")
        return
      }

      const { bookings: bookingsData, error } = await getProviderBookings()
      setLoading(false)

      if (error) {
        setError(error)
      } else if (bookingsData) {
        setBookings(bookingsData)
      }
    }

    loadData()
  }, [router])

  async function handleStatusUpdate(bookingId: string, status: "CONFIRMED" | "COMPLETED" | "CANCELLED") {
    setActionLoading(bookingId)

    const result = await updateBookingStatus(bookingId, status)

    if (result.error) {
      setError(result.error)
    } else {
      // Update local state to avoid a full reload
      setBookings(bookings.map((booking) => (booking.id === bookingId ? { ...booking, status } : booking)))
    }

    setActionLoading(null)
  }

  if (loading) {
    return <div className="container py-10 text-center">Loading your dashboard...</div>
  }

  if (error) {
    return <div className="container py-10 text-center text-destructive">{error}</div>
  }

  const pendingBookings = bookings.filter((booking) => booking.status === "PENDING")
  const confirmedBookings = bookings.filter((booking) => booking.status === "CONFIRMED")
  const completedBookings = bookings.filter((booking) => booking.status === "COMPLETED")
  const cancelledBookings = bookings.filter((booking) => booking.status === "CANCELLED")

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Provider Dashboard</h1>

      <Tabs defaultValue="pending">
        <TabsList className="mb-4">
          <TabsTrigger value="pending">Pending ({pendingBookings.length})</TabsTrigger>
          <TabsTrigger value="confirmed">Confirmed ({confirmedBookings.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completedBookings.length})</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled ({cancelledBookings.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          {pendingBookings.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-muted-foreground">You don't have any pending bookings</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {pendingBookings.map((booking) => (
                <Card key={booking.id}>
                  <CardHeader>
                    <CardTitle>{booking.service.title}</CardTitle>
                    <CardDescription>Customer: {booking.user.name}</CardDescription>
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
                      <div className="flex items-center">
                        <User className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>{booking.user.email}</span>
                      </div>
                      {booking.description && (
                        <div className="mt-2">
                          <p className="text-sm text-muted-foreground">{booking.description}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="flex gap-2">
                    <Button
                      className="flex-1"
                      onClick={() => handleStatusUpdate(booking.id, "CONFIRMED")}
                      disabled={actionLoading === booking.id}
                    >
                      {actionLoading === booking.id ? "Updating..." : "Confirm"}
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => handleStatusUpdate(booking.id, "CANCELLED")}
                      disabled={actionLoading === booking.id}
                    >
                      Cancel
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="confirmed">
          {confirmedBookings.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-muted-foreground">You don't have any confirmed bookings</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {confirmedBookings.map((booking) => (
                <Card key={booking.id}>
                  <CardHeader>
                    <CardTitle>{booking.service.title}</CardTitle>
                    <CardDescription>Customer: {booking.user.name}</CardDescription>
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
                      <div className="flex items-center">
                        <User className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>{booking.user.email}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className="w-full"
                      onClick={() => handleStatusUpdate(booking.id, "COMPLETED")}
                      disabled={actionLoading === booking.id}
                    >
                      {actionLoading === booking.id ? "Updating..." : "Mark as Completed"}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed">
          {completedBookings.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-muted-foreground">You don't have any completed bookings</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {completedBookings.map((booking) => (
                <Card key={booking.id}>
                  <CardHeader>
                    <CardTitle>{booking.service.title}</CardTitle>
                    <CardDescription>Customer: {booking.user.name}</CardDescription>
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
                      <div className="mt-2">
                        <Badge variant="outline" className="bg-blue-100 text-blue-800">
                          Completed
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="cancelled">
          {cancelledBookings.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-muted-foreground">You don't have any cancelled bookings</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {cancelledBookings.map((booking) => (
                <Card key={booking.id}>
                  <CardHeader>
                    <CardTitle>{booking.service.title}</CardTitle>
                    <CardDescription>Customer: {booking.user.name}</CardDescription>
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
                      <div className="mt-2">
                        <Badge variant="outline" className="bg-red-100 text-red-800">
                          Cancelled
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
