"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Minus, Plus, Trash, MapPin } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/useAuth"
import { useGetDeliveryAreasQuery } from "@/store/api/deliveryApi"
import { useCart } from "@/hooks/useCart"
import { useCreateOrderMutation } from "@/rest/store/api/orderApi"
import { useRouter } from "next/navigation"

interface DeliveryArea {
  _id: string
  areaName: string
  latitude: number
  longitude: number
}

export default function CheckoutForm() {
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const { items, removeFromCart, updateQuantity, clearCart } = useCart()
  const { data } = useGetDeliveryAreasQuery()
  const [createOrder, { isLoading, isError }] = useCreateOrderMutation()


  const deliveryAreas: DeliveryArea[] = data?.data || []

  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    area: "",
    address: "",
    deliveryLocation: "",
  })

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedArea, setSelectedArea] = useState<DeliveryArea | null>(null)
  const [isGettingLocation, setIsGettingLocation] = useState(false)

  // Check if user is authenticated
  const isAuthenticated = !!user

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        fullName: user.name || "",
        phoneNumber: user.phone || "",
        email: user.email || "",
        area: user.area?.areaName || "",
        address: user.address || "",
        deliveryLocation: user.deliveryLocation || "",
      }))

      if (user.area) {
        const userArea: DeliveryArea = {
          _id: user.area._id,
          areaName: user.area.areaName,
          latitude: user.area.latitude,
          longitude: user.area.longitude,
        }
        setSelectedArea(userArea)
      }
    }
  }, [user])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (!isAuthenticated) return

    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleAreaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!isAuthenticated) return

    const areaName = e.target.value
    const area = deliveryAreas.find((a) => a.areaName === areaName) || null
    setSelectedArea(area)

    setFormData((prev) => ({
      ...prev,
      area: areaName,
      deliveryLocation: area ? `${area.latitude},${area.longitude}` : "",
    }))

    if (fieldErrors.area) {
      setFieldErrors((prev) => ({ ...prev, area: "" }))
    }
  }

  const getCurrentLocation = () => {
    if (!isAuthenticated) return

    if (!navigator.geolocation) {
      toast({
        title: "Geolocation not supported",
        description: "Your browser doesn't support geolocation",
        variant: "destructive",
      })
      return
    }

    setIsGettingLocation(true)

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        setFormData((prev) => ({
          ...prev,
          deliveryLocation: `${latitude},${longitude}`,
        }))
        setIsGettingLocation(false)
        toast({
          title: "Location captured",
          description: "Your current location has been set for delivery",
        })
        if (fieldErrors.deliveryLocation) {
          setFieldErrors((prev) => ({ ...prev, deliveryLocation: "" }))
        }
      },
      (error) => {
        setIsGettingLocation(false)
        toast({
          title: "Location error",
          description: error.message,
          variant: "destructive",
        })
      },
    )
  }

  const handleQuantityUpdate = (itemId: string, newQuantity: number) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please login to modify your cart.",
        variant: "destructive",
      })
      return
    }
    updateQuantity(itemId, newQuantity)
  }

  const handleRemoveFromCart = (itemId: string) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please login to modify your cart.",
        variant: "destructive",
      })
      return
    }
    removeFromCart(itemId)
  }

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const deliveryFees = items.map((item) => ({
    id: item.id,
    name: item.name,
    fee: Number.parseFloat((item.price * 0.1 * item.quantity).toFixed(2)),
  }))
  const totalDeliveryFee = deliveryFees.reduce((sum, f) => sum + f.fee, 0)
  const total = subtotal + totalDeliveryFee

  const validateForm = () => {
    const errors: Record<string, string> = {}
    let isValid = true

    if (!formData.fullName.trim()) {
      errors.fullName = "Full name is required"
      isValid = false
    }

    if (!formData.phoneNumber.trim()) {
      errors.phoneNumber = "Phone number is required"
      isValid = false
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required"
      isValid = false
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      errors.email = "Please enter a valid email"
      isValid = false
    }

    if (!formData.area) {
      errors.area = "Please select an area"
      isValid = false
    }

    if (!formData.address.trim()) {
      errors.address = "Address is required"
      isValid = false
    }

    if (!formData.deliveryLocation) {
      errors.deliveryLocation = "Please set your delivery location"
      isValid = false
    }

    setFieldErrors(errors)
    return isValid
  }

  const resetForm = () => {
    setFormData({
      fullName: user?.name || "",
      phoneNumber: user?.phone || "",
      email: user?.email || "",
      area: user?.area?.areaName || "",
      address: user?.address || "",
      deliveryLocation: user?.deliveryLocation || "",
    })
    setFieldErrors({})
  }

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!isAuthenticated) {
    router.push("/login");
    return;
  }

  if (!validateForm()) {
    return
  }

  if (user?.balance < total) {
    toast({ title: "Insufficient Balance", description: "Recharge your balance to place the order.", variant: "destructive" })
    return
  }

  setIsSubmitting(true)
  try {
    // Fixed: Changed variable name from 'orderSubmited' to 'response'
    const response = await createOrder({
      items,
      deliveryAddress: {
        street: formData.address,
        area: formData.area,
        city: "Dhaka",
        zipCode: "1219",
        phone: formData.phoneNumber,
        location: formData.deliveryLocation, // Note: This might need to be under deliveryAddress
      },
      paymentMethod: "wallet",
      deliveryDate: new Date().toISOString().split("T")[0],
      deliveryTime: new Date().toISOString().split("T")[1].slice(0, 5),
      notes: "",
      totalAmount: total,
    }).unwrap()

    console.log(response, "Order submitted successfully")

    // Fixed: Now using 'response' instead of undefined variable
    if (response?.status) { // Changed from 'success' to 'status' based on your API response format
      toast({ title: "Order Placed", description: "Your order was successfully placed!" })
      clearCart()
      resetForm()
      // Optional: Redirect to order confirmation page
      // router.push(`/orders/${response.data._id}`)
    } else {
      throw new Error("Order failed")
    }
  } catch (err) {
    clearCart()
      resetForm()
    console.error("Order error:", err)
    // toast({ 
    //   title: "Error", 
    //   description: `Could not place the order. Please try again.`, 
    //   variant: "destructive" 
    // })
  } finally {
    setIsSubmitting(false)
  }
}

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-2">
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow space-y-4">
        <h2 className="text-xl font-bold mb-2">Delivery Information</h2>

        {!isAuthenticated && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              Please{" "}
              <span
                className="font-semibold cursor-pointer text-blue-600 hover:underline"
                onClick={() => router.push("/login")}
              >
                login
              </span>{" "}
              to continue with your order.
            </p>
          </div>
        )}

        <div className="space-y-1">
          <input
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Full Name"
            className={`w-full input-style ${!isAuthenticated ? "input-disabled" : ""} ${fieldErrors.fullName ? "border-red-500" : ""}`}
            disabled={!isAuthenticated}
          />
          {fieldErrors.fullName && <p className="text-red-500 text-xs">{fieldErrors.fullName}</p>}
        </div>

        <div className="space-y-1">
          <input
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            placeholder="Phone Number"
            className={`w-full input-style ${!isAuthenticated ? "input-disabled" : ""} ${fieldErrors.phoneNumber ? "border-red-500" : ""}`}
            disabled={!isAuthenticated}
          />
          {fieldErrors.phoneNumber && <p className="text-red-500 text-xs">{fieldErrors.phoneNumber}</p>}
        </div>

        <div className="space-y-1">
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className={`w-full input-style ${!isAuthenticated ? "input-disabled" : ""} ${fieldErrors.email ? "border-red-500" : ""}`}
            disabled={!isAuthenticated}
          />
          {fieldErrors.email && <p className="text-red-500 text-xs">{fieldErrors.email}</p>}
        </div>

        <div className="space-y-1">
          <select
            name="area"
            value={formData.area}
            onChange={handleAreaChange}
            className={`w-full input-style ${!isAuthenticated ? "input-disabled" : ""} ${fieldErrors.area ? "border-red-500" : ""}`}
            disabled={!isAuthenticated}
          >
            <option value="">Select Area</option>
            {deliveryAreas.map((area) => (
              <option key={area._id} value={area.areaName}>
                {area.areaName}
              </option>
            ))}
          </select>
          {fieldErrors.area && <p className="text-red-500 text-xs">{fieldErrors.area}</p>}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Detailed Address</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Street, house, floor, landmark etc."
            rows={4}
            className={`w-full input-style ${!isAuthenticated ? "input-disabled" : ""} ${fieldErrors.address ? "border-red-500" : ""}`}
            disabled={!isAuthenticated}
          />
          {fieldErrors.address && <p className="text-red-500 text-xs">{fieldErrors.address}</p>}
        </div>

        <div className="space-y-1">
          <button
            type="button"
            onClick={getCurrentLocation}
            disabled={!isAuthenticated || isGettingLocation}
            className={`flex items-center justify-center gap-2 w-full py-2 px-4 border rounded-md ${
              !isAuthenticated
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : isGettingLocation
                  ? "bg-gray-100 text-gray-600"
                  : fieldErrors.deliveryLocation
                    ? "border-red-500 bg-white"
                    : "bg-white hover:bg-gray-50"
            }`}
          >
            <MapPin size={18} className="text-red-500" />
            {isGettingLocation ? "Getting your location..." : "Use my current location"}
          </button>
          {fieldErrors.deliveryLocation && <p className="text-red-500 text-xs">{fieldErrors.deliveryLocation}</p>}
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow">
          <h2 className="text-xl font-bold mb-4">Your Order</h2>
          {items.map((item) => (
            <div key={item.id} className="border-b py-3">
              <div className="flex justify-between text-sm">
                <span>{item.name}</span>
                <span>{item.price.toFixed(2)}/-</span>
              </div>
              <div className="flex justify-between mt-2 items-center">
                <div className="flex border rounded">
                  <button
                    type="button"
                    onClick={() => handleQuantityUpdate(item.id, item.quantity - 1)}
                    className={`px-3 py-1 hover:bg-gray-100 ${!isAuthenticated ? "opacity-50 cursor-not-allowed" : ""}`}
                    disabled={!isAuthenticated}
                  >
                    <Minus size={14} />
                  </button>
                  <span className="px-4 py-1 border-x">{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => handleQuantityUpdate(item.id, item.quantity + 1)}
                    className={`px-3 py-1 hover:bg-gray-100 ${!isAuthenticated ? "opacity-50 cursor-not-allowed" : ""}`}
                    disabled={!isAuthenticated}
                  >
                    <Plus size={14} />
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <span>{(item.price * item.quantity).toFixed(2)}/-</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveFromCart(item.id)}
                    className={`text-red-500 text-xs hover:underline ${!isAuthenticated ? "opacity-50 cursor-not-allowed" : ""}`}
                    disabled={!isAuthenticated}
                  >
                    <Trash size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}

          <div className="border-t mt-4 pt-2 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{subtotal.toFixed(2)}/-</span>
            </div>
            {deliveryFees.map((fee) => (
              <div key={fee.id} className="flex justify-between text-gray-600">
                <span>Delivery Fee ({fee.name.split("/")[0]})</span>
                <span>{fee.fee.toFixed(2)}/-</span>
              </div>
            ))}
            <div className="flex justify-between font-bold mt-2 text-lg">
              <span>Total</span>
              <span>{total.toFixed(2)}/-</span>
            </div>
          </div>

          {user?.balance !== undefined && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <div className="flex justify-between text-sm">
                <span>Your Balance:</span>
                <span className={user.balance >= total ? "text-green-600" : "text-red-600"}>
                  ৳{user.balance.toLocaleString()}
                </span>
              </div>
              {user.balance < total && (
                <p className="text-xs text-red-600 mt-1">
                  Insufficient balance. You need ৳{(total - user.balance).toFixed(2)} more.
                </p>
              )}
            </div>
          )}
        </div>

        <div className="p-6 rounded-lg text-white space-y-4">
          <button
            type="submit"
            disabled={isSubmitting || (isAuthenticated && user?.balance && user.balance < total)}
            className={`w-full py-3 rounded font-bold transition-colors ${
              !isAuthenticated
                ? "bg-green-700 hover:bg-green-800 text-white"
                : "bg-primary hover:bg-opacity-90 text-white disabled:bg-gray-400 disabled:cursor-not-allowed"
            }`}
          >
            {!isAuthenticated ? "Login to Place Order" : isSubmitting ? "Processing..." : "Place Order"}
          </button>
        </div>
      </div>

      <style jsx>{`
        .input-style {
          padding: 0.75rem;
          border-radius: 0.375rem;
          border: 1px solid #ccc;
          outline: none;
          font-size: 0.95rem;
          transition: border-color 0.2s;
        }
        .input-style:focus {
          border-color: #d4a017;
          box-shadow: 0 0 0 2px rgba(212, 160, 23, 0.1);
        }
        .input-disabled {
          background-color: #f5f5f5;
          color: #9ca3af;
          cursor: not-allowed;
        }
        .input-disabled:focus {
          border-color: #ccc;
          box-shadow: none;
        }
      `}</style>
    </form>
  )
}
