"use client"

import { useState } from "react"
import { Calendar, Clock, MapPin } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock data for bookings
const upcomingBookings = [
  {
    id: 1,
    service: "Plumbing",
    provider: "John Smith",
    date: "2023-06-15",
    time: "14:00",
    address: "123 Main St, Anytown, USA",
  },
  {
    id: 2,
    service: "Electrical Work",
    provider: "Jane Doe",
    date: "2023-06-18",
    time: "10:00",
    address: "456 Elm St, Anytown, USA",
  },
]

const pastBookings = [
  {
    id: 3,
    service: "Home Cleaning",
    provider: "Alice Johnson",
    date: "2023-06-01",
    time: "09:00",
    address: "789 Oak St, Anytown, USA",
  },
]

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("upcoming")

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">My Dashboard</h1>
      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList>
          <TabsTrigger value="upcoming" onClick={() => setActiveTab("upcoming")}>
            Upcoming Bookings
          </TabsTrigger>
          <TabsTrigger value="past" onClick={() => setActiveTab("past")}>
            Past Bookings
          </TabsTrigger>
        </TabsList>
        <TabsContent value="upcoming">
          {upcomingBookings.map((booking) => (
            <BookingCard key={booking.id} booking={booking} isPast={false} />
          ))}
        </TabsContent>
        <TabsContent value="past">
          {pastBookings.map((booking) => (
            <BookingCard key={booking.id} booking={booking} isPast={true} />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}

function BookingCard({ booking, isPast }) {
  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>{booking.service}</CardTitle>
        <CardDescription>Provider: {booking.provider}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center mb-2">
          <Calendar className="mr-2 h-4 w-4" />
          <span>{booking.date}</span>
        </div>
        <div className="flex items-center mb-2">
          <Clock className="mr-2 h-4 w-4" />
          <span>{booking.time}</span>
        </div>
        <div className="flex items-center">
          <MapPin className="mr-2 h-4 w-4" />
          <span>{booking.address}</span>
        </div>
      </CardContent>
      <CardFooter>
        {!isPast && (
          <Button variant="outline" className="mr-2">
            Reschedule
          </Button>
        )}
        <Button variant={isPast ? "outline" : "destructive"}>{isPast ? "Book Again" : "Cancel"}</Button>
      </CardFooter>
    </Card>
  )
}

