"use client"

import { useState, useEffect } from "react"
import { Minus, Plus, Trash } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/useAuth"
import { useGetDeliveryAreasQuery } from "@/store/api/deliveryApi"
import dynamic from "next/dynamic"
import { useCart } from "@/hooks/useCart"
import { useCreateOrderMutation } from "@/rest/store/api/orderApi"

interface DeliveryArea {
  _id: string
  areaName: string
  latitude: number
  longitude: number
}

export default function CheckoutForm() {
  const { user } = useAuth()
  const { toast } = useToast()
  const Map = dynamic(() => import("./LocationPickerMap"), { ssr: false })
  const { items, removeFromCart, updateQuantity, clearCart } = useCart()
  const { data } = useGetDeliveryAreasQuery()
  const [createOrder, { isLoading, isError,  }] = useCreateOrderMutation()


  const deliveryAreas: DeliveryArea[] = data?.data || []

  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    area: "",
    address: "",
    deliveryLocation: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedArea, setSelectedArea] = useState<DeliveryArea | null>(null)
  const [selectedPosition, setSelectedPosition] = useState<{ lat: number; lng: number } | null>(null)
  const [showMap, setShowMap] = useState(false)

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: user.name || "",
        phoneNumber: user.phone || "",
        email: user.email || "",
        area: user.area?.areaName || "",
        address: user.address || "",
        deliveryLocation: user.deliveryLocation || ""
      }))

      if (user.area) {
        const userArea: DeliveryArea = {
          _id: user.area._id,
          areaName: user.area.areaName,
          latitude: user.area.latitude,
          longitude: user.area.longitude
        }
        setSelectedArea(userArea)
        setSelectedPosition({ lat: user.area.latitude, lng: user.area.longitude })
        setShowMap(true)
      }
    }
  }, [user])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleAreaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const areaName = e.target.value
    const area = deliveryAreas.find(a => a.areaName === areaName) || null
    setSelectedArea(area)

    if (area) {
      setSelectedPosition({ lat: area.latitude, lng: area.longitude })
      setFormData(prev => ({
        ...prev,
        area: areaName,
        deliveryLocation: `${area.latitude},${area.longitude}`
      }))
      setShowMap(true)
    } else {
      setSelectedPosition(null)
      setFormData(prev => ({
        ...prev,
        area: "",
        deliveryLocation: ""
      }))
      setShowMap(false)
    }
  }

  const handleMapClick = (lat: number, lng: number) => {
    setSelectedPosition({ lat, lng })
    setFormData(prev => ({
      ...prev,
      deliveryLocation: `${lat},${lng}`
    }))
  }

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const deliveryFees = items.map(item => ({
    id: item.id,
    name: item.name,
    fee: parseFloat((item.price * 0.1 * item.quantity).toFixed(2)),
  }))
  const totalDeliveryFee = deliveryFees.reduce((sum, f) => sum + f.fee, 0)
  const total = subtotal + totalDeliveryFee

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  const { fullName, phoneNumber, email, area, address, deliveryLocation } = formData;

  if (!fullName || !phoneNumber || !email || !area || !address || !deliveryLocation) {
    toast({ title: "Missing Info", description: "Please fill in all fields.", variant: "destructive" })
    return
  }

  if (user?.balance < total) {
    toast({ title: "Insufficient Balance", description: "Recharge your balance to place the order.", variant: "destructive" })
    return
  }

  setIsSubmitting(true)
  try {
    await createOrder({
      items,
      deliveryAddress: {
        street: address,
        area,
        city: "Dhaka",
        zipCode: "1219",
        phone: phoneNumber,
      },
      paymentMethod: "wallet",
      deliveryDate: new Date().toISOString().split("T")[0],
      deliveryTime: new Date().toISOString().split("T")[1].slice(0, 5),
      notes: "",
      totalAmount: total,
    })

    toast({ title: "Order Placed", description: "Your order was successfully placed!" })
    clearCart()
  } catch (err) {
    console.error("Order error:", err)
    toast({ title: "Error", description: "Could not place the order.", variant: "destructive" })
  } finally {
    setIsSubmitting(false)
  }
}


  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-2 ">
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow space-y-4">
        <h2 className="text-xl font-bold mb-2">Delivery Information</h2>

        <input name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Full Name" className="w-full input-style" required />
        <input name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} placeholder="Phone Number" className="w-full input-style" required />
        <input name="email" value={formData.email} onChange={handleChange} placeholder="Email" className="w-full input-style" required />

        <select name="area" value={formData.area} onChange={handleAreaChange} className="w-full input-style" required>
          <option value="">Select Area</option>
          {deliveryAreas.map(area => (
            <option key={area._id} value={area.areaName}>{area.areaName}</option>
          ))}
        </select>

        {showMap && selectedArea && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">Select exact location from map:</p>
            <div className="h-64 w-full border rounded-lg overflow-hidden">
              <Map onMapClick={handleMapClick} selectedPosition={selectedPosition} />
            </div>
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Detailed Address</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Street, house, floor, landmark etc."
            rows={4}
            className="w-full input-style"
            required
          />
        </div>

       
      </div>

      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow">
          <h2 className="text-xl font-bold mb-4">Your Order</h2>
          {items.map(item => (
            <div key={item.id} className="border-b py-3">
              <div className="flex justify-between text-sm">
                <span>{item.name}</span>
                <span>{item.price.toFixed(2)}/-</span>
              </div>
              <div className="flex justify-between mt-2 items-center">
                <div className="flex border rounded">
                  <button type="button" onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-3 py-1 hover:bg-gray-100"><Minus size={14} /></button>
                  <span className="px-4 py-1 border-x">{item.quantity}</span>
                  <button type="button" onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-3 py-1 hover:bg-gray-100"><Plus size={14} /></button>
                </div>
                <div className="flex items-center gap-2">
                  <span>{(item.price * item.quantity).toFixed(2)}/-</span>
                  <button type="button" onClick={() => removeFromCart(item.id)} className="text-red-500 text-xs hover:underline"><Trash size={16} /></button>
                </div>
              </div>
            </div>
          ))}

          <div className="border-t mt-4 pt-2 text-sm">
            <div className="flex justify-between"><span>Subtotal</span><span>{subtotal.toFixed(2)}/-</span></div>
            {deliveryFees.map(fee => (
              <div key={fee.id} className="flex justify-between text-gray-600">
                <span>Delivery Fee ({fee.name.split("/")[0]})</span>
                <span>{fee.fee.toFixed(2)}/-</span>
              </div>
            ))}
            <div className="flex justify-between font-bold mt-2 text-lg"><span>Total</span><span>{total.toFixed(2)}/-</span></div>
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
            disabled={isSubmitting || (user?.balance && user.balance < total)}
            className="w-full bg-primary py-3 rounded text-white font-bold hover:bg-opacity-90 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? "Processing..." : "Place Order"}
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
      `}</style>
    </form>
  )
}

