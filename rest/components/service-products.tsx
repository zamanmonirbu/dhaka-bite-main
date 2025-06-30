"use client"

import Image from "next/image"
import { useCart } from "@/hooks/useCart"
import { useToast } from "@/hooks/use-toast"
import { Plus, Minus } from "lucide-react"

interface Product {
  id: string
  name: string
  price: number
  image: string
  description: string
  ingredients: string[]
}

interface ServiceProductsProps {
  products: Product[]
  category: string
}

export default function ServiceProducts({ products, category }: ServiceProductsProps) {
  const { addItem, getItemQuantity, updateQuantity, removeItem } = useCart()
  const { toast } = useToast()

  const handleAddToCart = (product: Product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      type: "service",
      category: category,
      ingredients: product.ingredients,
    })

    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart.`,
    })
  }

  const handleQuantityChange = (product: Product, newQuantity: number) => {
    if (newQuantity === 0) {
      removeItem(product.id)
      toast({
        title: "Removed from Cart",
        description: `${product.name} has been removed from your cart.`,
      })
    } else {
      updateQuantity(product.id, newQuantity)
    }
  }

  return (
    <section className="py-16 bg-white">
      <div className="container-custom">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => {
            const quantity = getItemQuantity(product.id)

            return (
              <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
                {/* Image */}
                <div className="relative h-48 w-full overflow-hidden">
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform hover:scale-105 duration-300"
                  />
                  <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-semibold">
                    ৳{product.price}
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                  <p className="text-gray-600 text-sm mb-3">{product.description}</p>

                  {/* Ingredients */}
                  <div className="mb-4">
                    {product.ingredients.map((ingredient, index) => (
                      <div key={index} className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>✓ {ingredient}</span>
                      </div>
                    ))}
                  </div>

                  {/* Add to Cart / Quantity Controls */}
                  <div className="flex items-center justify-center">
                    {quantity === 0 ? (
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                      >
                        ✓ Add to Cart
                      </button>
                    ) : (
                      <div className="flex items-center gap-2 w-full">
                        <button
                          onClick={() => handleQuantityChange(product, quantity - 1)}
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="px-3 py-1 bg-gray-100 rounded text-center min-w-[40px] flex-1">
                          {quantity}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(product, quantity + 1)}
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
