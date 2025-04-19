"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { getServiceById } from "@/app/actions/service"
import { createBooking } from "@/app/actions/booking"
import { getCurrentUser } from "@/app/actions/auth"

const formSchema = z.object({
  providerId: z.string({
    required_error: "Please select a provider",
  }),
  date: z.date({
    required_error: "Please select a date",
  }),
  time: z.string({
    required_error: "Please select a time",
  }),
  description: z.string().optional(),
})

export default function ServicePage({ params }: { params: { id: string } }) {
  const [service, setService] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    async function loadData() {
      const userData = await getCurrentUser()
      setUser(userData)

      const { service: serviceData, error } = await getServiceById(params.id)
      setLoading(false)

      if (error) {
        setError(error)
      } else if (serviceData) {
        setService(serviceData)
      }
    }

    loadData()
  }, [params.id])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      providerId: "",
      date: undefined,
      time: "",
      description: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) {
      router.push(`/sign-in?redirect=/services/${params.id}`)
      return
    }

    setIsSubmitting(true)
    setError(null)

    const formData = new FormData()
    formData.append("providerId", values.providerId)
    formData.append("serviceId", params.id)
    formData.append("date", values.date.toISOString())
    formData.append("startTime", values.time)
    if (values.description) {
      formData.append("description", values.description)
    }

    const result = await createBooking(formData)

    if (result.error) {
      setError(result.error._form?.[0] || "An error occurred during booking")
      setIsSubmitting(false)
    } else if (result.success) {
      router.push(`/bookings/${result.bookingId}`)
    }
  }

  if (loading) {
    return <div className="container py-10 text-center">Loading service details...</div>
  }

  if (error) {
    return <div className="container py-10 text-center text-destructive">{error}</div>
  }

  if (!service) {
    return <div className="container py-10 text-center">Service not found</div>
  }

  const availableTimes = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"]

  return (
    <div className="container mx-auto py-10">
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <Image
            src={service.icon || "/placeholder.svg"}
            alt={service.title}
            width={500}
            height={300}
            className="rounded-lg object-cover w-full"
          />
          <h1 className="text-3xl font-bold mt-6">{service.title}</h1>
          <p className="text-muted-foreground mt-2">{service.description}</p>
          <p className="text-xl font-semibold mt-4">Starting at ${service.basePrice}/hour</p>
        </div>

        <div>
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Book this Service</h2>

              {!user && (
                <div className="mb-4">
                  <p className="mb-2">Please sign in to book this service</p>
                  <Button asChild>
                    <a href={`/sign-in?redirect=/services/${params.id}`}>Sign In</a>
                  </Button>
                </div>
              )}

              {user && (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {error && <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">{error}</div>}

                    <FormField
                      control={form.control}
                      name="providerId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Select Provider</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a provider" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {service.providers.map((provider: any) => (
                                <SelectItem key={provider.id} value={provider.id}>
                                  {provider.user.name} ({provider.experience} years experience)
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground",
                                  )}
                                >
                                  {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                  date < new Date() || date > new Date(new Date().setMonth(new Date().getMonth() + 3))
                                }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="time"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Time</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a time" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {availableTimes.map((time) => (
                                <SelectItem key={time} value={time}>
                                  {time}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description (Optional)</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Describe your service needs" className="resize-none" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? "Booking..." : "Book Now"}
                    </Button>
                  </form>
                </Form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
