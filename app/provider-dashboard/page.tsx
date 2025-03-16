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
    client: "Alice Johnson",
    date: "2023-06-15",
    time: "14:00",
    address: "123 Main St, Anytown, USA",
  },
  {
    id: 2,
    service: "Plumbing",
    client: "Bob Williams",
    date: "2023-06-18",
    time: "10:00",
    address: "456 Elm St, Anytown, USA",
  },
]

const completedBookings = [
  {
    id: 3,
    service: "Plumbing",
    client: "Charlie Brown",
    date: "2023-06-01",
    time: "09:00",
    address: "789 Oak St, Anytown, USA",
  },
]

export default function ProviderDashboard() {
  const [activeTab, setActiveTab] = useState("upcoming")

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Provider Dashboard</h1>
      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList>
          <TabsTrigger value="upcoming" onClick={() => setActiveTab("upcoming")}>
            Upcoming Jobs
          </TabsTrigger>
          <TabsTrigger value="completed" onClick={() => setActiveTab("completed")}>
            Completed Jobs
          </TabsTrigger>
        </TabsList>
        <TabsContent value="upcoming">
          {upcomingBookings.map((booking) => (
            <BookingCard key={booking.id} booking={booking} isCompleted={false} />
          ))}
        </TabsContent>
        <TabsContent value="completed">
          {completedBookings.map((booking) => (
            <BookingCard key={booking.id} booking={booking} isCompleted={true} />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}

function BookingCard({ booking, isCompleted }) {
  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>{booking.service}</CardTitle>
        <CardDescription>Client: {booking.client}</CardDescription>
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
        {!isCompleted && (
          <>
            <Button variant="outline" className="mr-2">
              Contact Client
            </Button>
            <Button>Mark as Completed</Button>
          </>
        )}
        {isCompleted && <Button variant="outline">View Details</Button>}
      </CardFooter>
    </Card>
  )
}

