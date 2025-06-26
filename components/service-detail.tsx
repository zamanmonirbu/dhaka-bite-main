"use client"

import Image from "next/image"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"

interface ServiceDetailProps {
  title: string
  description: string
  price: number
  image: string
}

export default function ServiceDetail({ title, description, price, image }: ServiceDetailProps) {
  const { toast } = useToast()
  const [isAddingToCart, setIsAddingToCart] = useState(false)

  const handleAddToCart = async () => {
    setIsAddingToCart(true)

    try {
      // In a real app, this would be an API call to your backend
      // await fetch('/api/cart/add', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ title, price, quantity: 1 })
      // });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800))

      toast({
        title: "Added to cart",
        description: `${title} has been added to your cart.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem adding this item to your cart.",
        variant: "destructive",
      })
    } finally {
      setIsAddingToCart(false)
    }
  }

  return (
    <section className="py-16 bg-white">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Product Image */}
          <div className="rounded-lg overflow-hidden">
            <Image
              src={image || "/placeholder.svg"}
              alt={title}
              width={600}
              height={500}
              className="w-full object-cover"
              priority
            />
          </div>

          {/* Product Details */}
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-6">{title}</h1>
            <p className="text-gray-700 mb-8">{description}</p>

            <div className="text-3xl font-bold text-secondary mb-8">{price.toFixed(2)} /-</div>

            <button
              onClick={handleAddToCart}
              disabled={isAddingToCart}
              className="w-full bg-primary text-white py-4 rounded-md hover:bg-primary/90 transition-colors disabled:opacity-70"
            >
              {isAddingToCart ? "Adding..." : "Add Cart"}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
