"use client"

import type React from "react"

import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Minus, Plus } from "lucide-react"
import Image from "next/image"

interface MealOption {
  id: string
  name: string
  price: number
  image: string
  description: string
}

const mealOptions: MealOption[] = [
  {
    id: "meal-1",
    name: "Bengali Fish Curry",
    price: 180,
    image: "/bengali-fish-dish.jpg",
    description: "Traditional Bengali fish curry with rice and vegetables",
  },
  {
    id: "meal-2",
    name: "Chicken Biryani",
    price: 220,
    image: "/food-plate.jpg",
    description: "Aromatic chicken biryani with raita and salad",
  },
  {
    id: "meal-3",
    name: "Beef Curry",
    price: 250,
    image: "/beef-curry.png",
    description: "Spicy beef curry with naan bread and rice",
  },
  {
    id: "meal-4",
    name: "Vegetable Platter",
    price: 150,
    image: "/bengali-food-vada.jpg",
    description: "Assorted vegetable dishes with rice and lentils",
  },
]

const timeSlots = [
  "11:00 AM - 12:00 PM",
  "12:00 PM - 1:00 PM",
  "1:00 PM - 2:00 PM",
  "6:00 PM - 7:00 PM",
  "7:00 PM - 8:00 PM",
  "8:00 PM - 9:00 PM",
]

export default function PrebookingForm() {
  const { toast } = useToast()
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [timeSlot, setTimeSlot] = useState<string>("")
  const [quantities, setQuantities] = useState<Record<string, number>>({})
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    specialInstructions: "",
  })

  const handleQuantityChange = (mealId: string, change: number) => {
    setQuantities((prev) => {
      const currentQuantity = prev[mealId] || 0
      const newQuantity = Math.max(0, currentQuantity + change)
      return { ...prev, [mealId]: newQuantity }
    })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!date) {
      toast({ title: "Error", description: "Please select a delivery date" })
      return
    }

    if (!timeSlot) {
      toast({ title: "Error", description: "Please select a delivery time" })
      return
    }

    const selectedMeals = Object.entries(quantities).filter(([_, qty]) => qty > 0)
    if (selectedMeals.length === 0) {
      toast({ title: "Error", description: "Please select at least one meal" })
      return
    }

    if (!formData.name || !formData.phone || !formData.address) {
      toast({ title: "Error", description: "Please fill in all required fields" })
      return
    }

    // Success
    toast({
      title: "Prebooking Submitted!",
      description: `Your order has been scheduled for ${date.toLocaleDateString()} at ${timeSlot}`,
    })

    // Reset form
    setDate(undefined)
    setTimeSlot("")
    setQuantities({})
    setFormData({
      name: "",
      phone: "",
      email: "",
      address: "",
      specialInstructions: "",
    })
  }

  const totalAmount = Object.entries(quantities).reduce((total, [mealId, quantity]) => {
    const meal = mealOptions.find((m) => m.id === mealId)
    return total + (meal?.price || 0) * quantity
  }, 0)

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column - Date, Time, Meals */}
              <div>
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>Select Delivery Date</CardTitle>
                    <CardDescription>Choose when you want your meals delivered</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      disabled={(date) => {
                        const today = new Date()
                        today.setHours(0, 0, 0, 0)
                        return date < today || date > new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)
                      }}
                      className="rounded-md border"
                    />
                  </CardContent>
                </Card>

                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>Select Delivery Time</CardTitle>
                    <CardDescription>Choose a convenient delivery time slot</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Select value={timeSlot} onValueChange={setTimeSlot}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select time slot" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map((slot) => (
                          <SelectItem key={slot} value={slot}>
                            {slot}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Contact Details */}
              <div>
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>Contact Details</CardTitle>
                    <CardDescription>Please provide your contact information</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Your full name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="Your phone number"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Your email address"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Delivery Address *</Label>
                      <Textarea
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="Your delivery address"
                        required
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Meal Selection */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Select Meals</CardTitle>
                <CardDescription>Choose the meals you want to pre-order</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mealOptions.map((meal) => (
                    <div key={meal.id} className="flex border rounded-lg overflow-hidden">
                      <div className="relative w-24 h-24">
                        <Image src={meal.image || "/placeholder.svg"} alt={meal.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1 p-3">
                        <h4 className="font-semibold">{meal.name}</h4>
                        <p className="text-sm text-gray-500">{meal.description}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="font-semibold">৳{meal.price}</span>
                          <div className="flex items-center gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleQuantityChange(meal.id, -1)}
                              disabled={!quantities[meal.id]}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-8 text-center">{quantities[meal.id] || 0}</span>
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleQuantityChange(meal.id, 1)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Special Instructions */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Special Instructions</CardTitle>
                <CardDescription>Any special requests or dietary requirements?</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  id="specialInstructions"
                  name="specialInstructions"
                  value={formData.specialInstructions}
                  onChange={handleInputChange}
                  placeholder="Add any special instructions here..."
                  className="min-h-[100px]"
                />
              </CardContent>
            </Card>

            {/* Order Summary */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(quantities)
                    .filter(([_, qty]) => qty > 0)
                    .map(([mealId, quantity]) => {
                      const meal = mealOptions.find((m) => m.id === mealId)
                      if (!meal) return null
                      return (
                        <div key={mealId} className="flex justify-between">
                          <span>
                            {quantity} x {meal.name}
                          </span>
                          <span>৳{meal.price * quantity}</span>
                        </div>
                      )
                    })}
                  <div className="border-t pt-2 mt-2 font-bold flex justify-between">
                    <span>Total Amount:</span>
                    <span>৳{totalAmount}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="flex justify-center">
              <Button type="submit" className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg">
                Submit Prebooking
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}
