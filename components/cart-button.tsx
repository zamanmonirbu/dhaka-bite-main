"use client"

import { useState } from "react"
import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

interface CartButtonProps {
  itemId: string
  itemName: string
  quantity: number
  price: number
}

export default function CartButton({ itemId, itemName, quantity, price }: CartButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleAddToCart = async () => {
    setIsLoading(true)

    try {
      // In a real app, this would be an API call to your backend
      // await postData('/cart/add', { itemId, quantity, price })

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      toast({
        title: "Added to cart",
        description: `${quantity} x ${itemName} added to your cart`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not add item to cart. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      onClick={handleAddToCart}
      disabled={isLoading}
      className="bg-primary text-white hover:bg-primary/90 flex items-center gap-2"
    >
      <ShoppingCart size={16} />
      {isLoading ? "Adding..." : "Add to Cart"}
    </Button>
  )
}
