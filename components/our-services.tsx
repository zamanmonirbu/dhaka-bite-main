"use client"

import Image from "next/image"
import Link from "next/link"
import { Check, Loader2, ChevronLeft, ChevronRight, Plus, Minus, ShoppingCart } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { useCart } from "@/hooks/useCart"
import { useToast } from "@/hooks/use-toast"
import { useGetMealsQuery } from "@/store/api/mealApi"
import { useGetPackagesQuery } from "@/store/api/packageApi"
import type { CartItem } from "@/store/slices/cartSlice"

interface MenuItem {
  discountedPrice: any
  actualPrice: any
  id: string
  packageType: string
  mealType: "breakfast" | "lunch" | "dinner"
  image: string
  price: number
  day: string
  name: string
  description: string
  ingredients: {
    name: string
    quantity: string
    unit: string
  }[]
  deliveryCharges: number
}

const convertApiMealToMenuItem = (apiMeal: any, day: string, packageInfo: any): MenuItem => {
  return {
    id: apiMeal._id,
    packageType: packageInfo.packageName,
    mealType: apiMeal.time,
    image: apiMeal.image,
    price: apiMeal.price,
    day: day.charAt(0).toUpperCase() + day.slice(1),
    name: apiMeal.name,
    description: apiMeal.description,
    ingredients: apiMeal.ingredients,
    deliveryCharges: apiMeal.deliveryCharges,
    actualPrice: apiMeal.actualPrice || packageInfo.actualPrice || apiMeal.price,
    discountedPrice: apiMeal.discountedPrice || packageInfo.discountedPrice || apiMeal.price,
    savings: apiMeal.savings || packageInfo.savings || 0
    
  }
}

export default function OurServices() {
  const { addToCart } = useCart()
  const { toast } = useToast()
  const today = new Date().toISOString().split("T")[0]
  const [quantities, setQuantities] = useState<Record<string, number>>({})

  const { data: mealsData, isLoading: mealsLoading, error: mealsError } = useGetMealsQuery({ today })
  const { data: packagesData, isLoading: packagesLoading, error: packagesError } = useGetPackagesQuery()

  const isLoading = mealsLoading || packagesLoading
  const error = mealsError || packagesError

  const getMenuItemsByPackage = (): MenuItem[] => {
    if (!mealsData?.data) return []
    const menuItems: MenuItem[] = []
    mealsData.data.forEach((packageData: any) => {
      Object.keys(packageData.days).forEach(day => {
        packageData.days[day].forEach((meal: any) => {
          menuItems.push(convertApiMealToMenuItem(meal, day, packageData.packageInfo))
        })
      })
    })
    return menuItems
  }

  // Helper function to get quantity with default value of 1
  const getQuantity = (itemId: string): number => {
    return quantities[itemId] ?? 1
  }

  const handleQuantityChange = (itemId: string, change: number) => {
    setQuantities(prev => {
      const currentQuantity = prev[itemId] ?? 1
      const newQuantity = Math.max(1, currentQuantity + change)
      return { ...prev, [itemId]: newQuantity }
    })
  }

  const handleAddToCart = async (item: MenuItem) => {
    const quantity = getQuantity(item.id)

    for (let i = 0; i < quantity; i++) {
      const cartItem: CartItem = {
        id: `${item.id}-${Date.now()}-${i}`,
        name: `${item.packageType} ${item.mealType.charAt(0).toUpperCase() + item.mealType.slice(1)} - ${item.day}`,
        price: item.price,
        quantity: 1,
        image: item.image,
        mealType: item.mealType,
        menuType: item.packageType,
        ingredients: item.ingredients.map(ing => ({
          name: ing.name,
          quantity: `${ing.quantity} ${ing.unit}`,
        }))
      }

      try {
        await addToCart(cartItem)
      } catch (error) {
        toast({ title: "Error", description: "Could not add item to cart. Please try again.", variant: "destructive" })
        return
      }
    }

    toast({ 
      title: "Added to cart", 
      description: `${quantity} x ${item.packageType} ${item.mealType} (${item.day}) added to your cart` 
    })

    // Reset to default quantity of 1 after adding to cart
    setQuantities(prev => ({ ...prev, [item.id]: 1 }))
  }

  const menuItems = getMenuItemsByPackage()
  const packageList = packagesData?.data || []

  if (isLoading) {
    return (
      <section className="py-16">
        <div className="container-custom flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading meals...</span>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-16">
        <div className="container-custom text-center py-12">
          <p className="text-red-500 mb-4">Failed to load meals. Please try again later.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-green-600 text-white px-2 py-1 rounded-md hover:bg-green-700"
          >
            Retry
          </button>
        </div>
      </section>
    )
  }

  return (
    <section className="py-4 rounded-2xl shadow-lg border border-gray-100 mt-12">
      <div className="w-full">
        {packageList.map((pkg: any) => (
          <PackageSection
            key={pkg._id}
            packageType={pkg.packageName}
            packageId={pkg._id}
            items={menuItems.filter(item => item.packageType === pkg.packageName)}
            getQuantity={getQuantity}
            onQuantityChange={handleQuantityChange}
            onAddToCart={handleAddToCart}
          />
        ))}
      </div>
    </section>
  )
}

function PackageSection({ 
  packageType, 
  packageId,
  items, 
  getQuantity,
  onQuantityChange,
  onAddToCart
}: { 
  packageType: string
  packageId: string
  items: MenuItem[]
  getQuantity: (itemId: string) => number
  onQuantityChange: (itemId: string, change: number) => void
  onAddToCart: (item: MenuItem) => void
}) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const checkScrollPosition = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1)
    }
  }

  useEffect(() => {
    checkScrollPosition()
  }, [items])

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const isMobile = window.innerWidth < 640
      const cardWidth = isMobile ? 200 : 240
      const gap = 16
      const scrollAmount = cardWidth + gap
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth"
      })
      setTimeout(checkScrollPosition, 300)
    }
  }

  return (
    <div className="mb-12">
      <h3 className="text-2xl font-bold text-center mb-6 px-4">{packageType} Menu</h3>
      <div className="relative">
        <button
          className={`absolute left-2 top-1/2 transform -translate-y-1/2 z-20 bg-white/90 backdrop-blur-sm shadow-lg rounded-full p-1.5 transition-all duration-200 ${
            canScrollLeft ? 'opacity-100 hover:bg-white hover:shadow-xl' : 'opacity-50 cursor-not-allowed'
          }`}
          onClick={() => scroll("left")}
          disabled={!canScrollLeft}
        >
          <ChevronLeft size={18} className="text-gray-700" />
        </button>

        <button
          className={`absolute right-2 top-1/2 transform -translate-y-1/2 z-20 bg-white/90 backdrop-blur-sm shadow-lg rounded-full p-1.5 transition-all duration-200 ${
            canScrollRight ? 'opacity-100 hover:bg-white hover:shadow-xl' : 'opacity-50 cursor-not-allowed'
          }`}
          onClick={() => scroll("right")}
          disabled={!canScrollRight}
        >
          <ChevronRight size={18} className="text-gray-700" />
        </button>

        <div 
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto py-2 scrollbar-hide scroll-smooth px-4"
          onScroll={checkScrollPosition}
        >
          {items.map(item => (
            <div 
              key={item.id} 
              className="min-w-[200px] max-w-[200px] sm:min-w-[240px] sm:max-w-[240px] flex-shrink-0"
            >
              <MealCard
                item={item}
                quantity={getQuantity(item.id)}
                onQuantityChange={onQuantityChange}
                onAddToCart={onAddToCart}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end mt-4 px-4">
        <Link 
          href={`/menu/${packageId}`} 
          className="text-primary font-medium flex items-center hover:underline transition-colors"
        >
          See More <ChevronRight size={16} className="ml-1" />
        </Link>
      </div>
    </div>
  )
}

function MealCard({ item, quantity, onQuantityChange, onAddToCart }: { 
  item: MenuItem
  quantity: number
  onQuantityChange: (itemId: string, change: number) => void
  onAddToCart: (item: MenuItem) => void
}) {
  // console.log("item:", item);
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300">
      {/* Image Section with Discount Badge */}
      <div className="relative">
        <div className="aspect-square w-full overflow-hidden">
          <Image
            src={item.image}
            alt={`${item.packageType} ${item.mealType} - ${item.day}`}
            width={240}
            height={240}
            className="w-full h-full object-cover"
            quality={80}
            priority={false}
          />
        </div>
        
       {item?.actualPrice && (
  <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
    {Math.round(((item.actualPrice - item.discountedPrice) / item.actualPrice * 100))}% OFF
  </div>
)}
       

      </div>

      {/* Content Section */}
      <div className="p-4 space-y-2">
        {/* Title and Price */}
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold text-sm text-gray-900 leading-tight ">
              {item.day} <span className="text-green-600 pl-4">{item.mealType.charAt(0).toUpperCase() + item.mealType.slice(1)}</span>
            </h3>
          </div>
          <div className="text-right">
            <span className="text-sm font-bold text-gray-900">৳{item.price}</span>
          </div>
        </div>

        {/* Ingredients */}
        <div className="flex flex-wrap gap-2">
          {item.ingredients.slice(0, 4).map((ingredient, index) => (
            <span 
              key={index} 
              className="bg-green-100 text-green-700 text-sm px-3 py-1 rounded-full font-medium"
            >
              {ingredient.name}
            </span>
          ))}
          {item.ingredients.length > 4 && (
            <span className="bg-gray-100 text-gray-600 text-sm px-3 py-1 rounded-full font-medium">
              +{item.ingredients.length - 4}
            </span>
          )}
        </div>

        {/* Quantity Controls */}
        <div className="flex justify-center">
          <div className="flex items-center border-2 border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => onQuantityChange(item.id, -1)}
              className="px-4 py-2 bg-gray-50 hover:bg-gray-100 transition-colors"
              disabled={quantity === 1}
            >
              <Minus size={18} className={quantity === 1 ? "text-gray-300" : "text-gray-600"} />
            </button>
            <div className="px-6 py-2 bg-white font-bold text-lg min-w-[60px] text-center">
              {quantity}
            </div>
            <button
              onClick={() => onQuantityChange(item.id, 1)}
              className="px-4 py-2 bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <Plus size={18} className="text-gray-600" />
            </button>
          </div>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={() => onAddToCart(item)}
          className="w-full bg-green-700 hover:bg-green-800 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
        >
          <ShoppingCart size={20} />
          Add to cart
        </button>
      </div>
    </div>
  )
}