"use client"

import { useEffect } from "react"
import Image from "next/image"
import { X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { useCart } from "@/hooks/useCart"

interface CartModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function CartModal({ isOpen, onClose }: CartModalProps) {
  const router = useRouter()
  const { toast } = useToast()
  const { items, totalPrice, removeFromCart } = useCart()

  // Close modal when Escape key is pressed
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscKey)
    }

    return () => {
      document.removeEventListener("keydown", handleEscKey)
    }
  }, [isOpen, onClose])

  // Prevent body scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }

    return () => {
      document.body.style.overflow = "auto"
    }
  }, [isOpen])

  const handleRemoveItem = async (id: string) => {
    try {
      await removeFromCart(id)
      toast({
        title: "Item removed",
        description: "The item has been removed from your cart.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not remove item from cart.",
        variant: "destructive",
      })
    }
  }

  const handleCheckout = () => {
    onClose()
    router.push("/checkout")
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-auto">
        <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold">Your Cart</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <div className="p-4">
          {items.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Your cart is empty</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex items-center border rounded-lg p-3 relative">
                  <div className="w-20 h-20 relative rounded-md overflow-hidden mr-4">
                    <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1">
                    <div className="inline-block bg-red-600 text-white text-xs px-2 py-1 rounded mb-2">{item.date}</div>
                    <h3 className="font-semibold text-lg">{item.name}</h3>
                    <p className="text-gray-700">
                      {item.quantity} * ৳{item.price.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-500">{item.menuType} Menu</p>
                  </div>
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                  >
                    <X size={20} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="sticky bottom-0 bg-white p-4 border-t">
            <div className="flex justify-between items-center mb-4">
              <span className="font-semibold">Total:</span>
              <span className="font-bold">৳{totalPrice.toFixed(2)}</span>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full bg-primary text-white py-3 rounded-md hover:bg-primary/90 transition-colors"
            >
              Check Out
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
