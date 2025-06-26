"use client"

import type React from "react"

import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { Building2, Home } from "lucide-react"
import Link from "next/link"

// Sample cart items - in a real app, these would come from your cart state/context
const cartItems = [
  {
    id: "1",
    name: "Basic Sunday/ 18 May",
    price: 65.0,
    quantity: 1,
  },
  {
    id: "2",
    name: "Basic Sunday/ 18 May",
    price: 65.0,
    quantity: 1,
  },
]

// Sample delivery areas - in a real app, these would come from your API
const deliveryAreas = ["Gulshan", "Banani", "Baridhara", "Bashundhara", "Uttara", "Dhanmondi", "Mohammadpur", "Mirpur"]

export default function CheckoutForm() {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    area: "",
    address: "",
    deliveryLocation: "",
  })
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("online")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const setDeliveryLocation = (location: string) => {
    setFormData((prev) => ({
      ...prev,
      deliveryLocation: location,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!termsAccepted) {
      toast({
        title: "Terms and Conditions",
        description: "Please accept the terms and conditions to proceed.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // In a real app, this would be an API call to your backend
      // await fetch('/api/orders', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ formData, cartItems })
      // });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Order Placed",
        description: "Your order has been successfully placed!",
      })

      // In a real app, you would redirect to a success page or clear the cart
      console.log("Order placed:", { formData, cartItems })
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem placing your order. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Calculate subtotal
  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0)

  // Calculate delivery fee (10% of item price)
  const deliveryFeePerItem = cartItems.map((item) => ({
    id: item.id,
    fee: Number.parseFloat((item.price * 0.1).toFixed(2)),
  }))

  // Calculate total delivery fee
  const totalDeliveryFee = deliveryFeePerItem.reduce((total, item) => total + item.fee, 0)

  // Calculate total
  const total = subtotal + totalDeliveryFee

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Delivery Information */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <h2 className="text-xl font-bold mb-6">Delivery Information</h2>

        <div className="space-y-4">
          <div>
            <label htmlFor="fullName" className="block text-gray-700 font-medium mb-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              placeholder="Enter your first and last name"
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div>
            <label htmlFor="phoneNumber" className="block text-gray-700 font-medium mb-1">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
              placeholder="Enter your phone number"
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-gray-700 font-medium mb-1">
              E-mail <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your e-mail"
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div>
            <label htmlFor="area" className="block text-gray-700 font-medium mb-1">
              Area <span className="text-red-500">*</span>
            </label>
            <select
              id="area"
              name="area"
              value={formData.area}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary appearance-none"
            >
              <option value="">Select one</option>
              {deliveryAreas.map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="address" className="block text-gray-700 font-medium mb-1">
              Address <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              placeholder="For example: House#124, Street#123, 3 Road, Banasree, Dhaka"
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-3">
              Select a label for effective delivery <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setDeliveryLocation("Office")}
                className={`flex items-center justify-center gap-2 py-3 px-4 border ${
                  formData.deliveryLocation === "Office"
                    ? "border-primary text-primary"
                    : "border-gray-300 text-gray-700"
                } rounded-md hover:border-primary hover:text-primary transition-colors`}
              >
                <Building2 size={18} />
                <span>Office</span>
              </button>
              <button
                type="button"
                onClick={() => setDeliveryLocation("Home")}
                className={`flex items-center justify-center gap-2 py-3 px-4 ${
                  formData.deliveryLocation === "Home"
                    ? "bg-primary text-white"
                    : "bg-white border border-gray-300 text-gray-700"
                } rounded-md hover:bg-primary hover:text-white transition-colors`}
              >
                <Home size={18} />
                <span>Home</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Order Summary */}
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h2 className="text-xl font-bold mb-6">Product</h2>

          <div className="space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="flex justify-between py-2 border-b">
                <span>
                  {item.name} * {item.quantity}
                </span>
                <span className="font-medium">{item.price.toFixed(2)}/-</span>
              </div>
            ))}

            <div className="flex justify-between py-2 border-b">
              <span className="font-medium">Subtotal</span>
              <span className="font-medium">{subtotal.toFixed(2)}/-</span>
            </div>

            {deliveryFeePerItem.map((fee, index) => (
              <div key={fee.id} className="flex justify-between py-2 border-b">
                <span>Delivery Fee (Basic Meal - 1 Meal)</span>
                <span>{fee.fee.toFixed(2)}/-</span>
              </div>
            ))}

            <div className="flex justify-between py-2 font-bold">
              <span>Total</span>
              <span>{total.toFixed(2)}/-</span>
            </div>
          </div>
        </div>

        <div className="bg-[#d4a017] p-6 rounded-lg">
          <div className="mb-4">
            <label className="flex items-center gap-2 text-white">
              <input
                type="radio"
                name="paymentMethod"
                value="online"
                checked={paymentMethod === "online"}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-4 h-4 accent-primary"
              />
              <span className="font-medium">Online Payment</span>
            </label>
            <p className="text-white mt-2 ml-6">
              Vikas, Cash, Rocket, Credit/Debit Card through Internet Banking or Mobile Banking. pay securely
            </p>
          </div>

          <div className="mb-6">
            <label className="flex items-start gap-2 text-white">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={() => setTermsAccepted(!termsAccepted)}
                className="w-4 h-4 mt-1 accent-primary"
              />
              <span>
                I have read and agreed to the{" "}
                <Link href="/terms" className="underline font-medium">
                  Terms & conditions
                </Link>
                , and{" "}
                <Link href="/privacy" className="underline font-medium">
                  Privacy policy
                </Link>{" "}
                of DhakaBite.
              </span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !formData.deliveryLocation}
            className="w-full bg-primary text-white py-4 rounded-md hover:bg-primary/90 transition-colors disabled:opacity-70"
          >
            {isSubmitting ? "Processing..." : "Place Order"}
          </button>
        </div>
      </div>
    </form>
  )
}
