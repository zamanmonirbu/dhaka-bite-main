"use client"

import type React from "react"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { Building2, Home, Minus, Plus } from "lucide-react"
import Link from "next/link"

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
}

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
  const [cartItems, setCartItems] = useState<CartItem[]>([
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
  ])

  const deliveryAreas = ["Gulshan", "Banani", "Baridhara", "Bashundhara", "Uttara", "Dhanmondi", "Mohammadpur", "Mirpur"]

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

  const updateQuantity = (id: string, change: number) => {
    setCartItems(prev => 
      prev.map(item => 
        item.id === id 
          ? { ...item, quantity: Math.max(1, item.quantity + change) } 
          : item
      )
    )
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
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Order Placed",
        description: "Your order has been successfully placed!",
      })

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
    name: item.name,
    fee: Number.parseFloat((item.price * 0.1 * item.quantity).toFixed(2)),
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
          {/* ... (keep all the delivery information fields the same) ... */}
        </div>
      </div>

      {/* Order Summary */}
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h2 className="text-xl font-bold mb-6">Product</h2>

          <div className="space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="flex flex-col py-2 border-b">
                <div className="flex justify-between mb-2">
                  <span>{item.name}</span>
                  <span className="font-medium">{item.price.toFixed(2)}/-</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center border border-gray-300 rounded-md w-full max-w-[120px]">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, -1)}
                      className="px-3 py-1 text-gray-600 hover:bg-gray-100 flex items-center justify-center"
                      aria-label="Decrease quantity"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="px-3 py-1 border-x border-gray-300 text-center flex-1">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, 1)}
                      className="px-3 py-1 text-gray-600 hover:bg-gray-100 flex items-center justify-center"
                      aria-label="Increase quantity"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <span className="font-medium">{(item.price * item.quantity).toFixed(2)}/-</span>
                </div>
              </div>
            ))}

            <div className="flex justify-between py-2 border-b">
              <span className="font-medium">Subtotal</span>
              <span className="font-medium">{subtotal.toFixed(2)}/-</span>
            </div>

            {deliveryFeePerItem.map((fee) => (
              <div key={fee.id} className="flex justify-between py-2 border-b">
                <span>Delivery Fee ({fee.name.split('/')[0]})</span>
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
