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

  const handleQuantityChange = (itemId: string, change: number) => {
    setQuantities(prev => {
      const currentQuantity = prev[itemId] || 0
      const newQuantity = Math.max(0, currentQuantity + change)
      return { ...prev, [itemId]: newQuantity }
    })
  }

  const handleAddToCart = async (item: MenuItem) => {
    const quantity = quantities[item.id] || 1

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

    setQuantities(prev => ({ ...prev, [item.id]: 0 }))
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
            quantities={quantities}
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
  quantities,
  onQuantityChange,
  onAddToCart
}: { 
  packageType: string
  packageId: string
  items: MenuItem[]
  quantities: Record<string, number>
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
      const cardWidth = isMobile ? 180 : 220
      const gap = 12
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
          className="flex gap-3 overflow-x-auto py-2 scrollbar-hide scroll-smooth"
          onScroll={checkScrollPosition}
        >
          {items.map(item => (
            <div 
              key={item.id} 
              className="min-w-[170px] max-w-[170px] sm:min-w-[200px] sm:max-w-[200px] flex-shrink-0"
            >
              <MealCard
                item={item}
                quantity={quantities[item.id] || 0}
                onQuantityChange={onQuantityChange}
                onAddToCart={onAddToCart}
              />
            </div>
          ))}
        </div>
      </div>

      {/* ✅ Use packageId in route */}
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

// MealCard component remains unchanged – you already have that correctly implemented.



function MealCard({ 
  item, 
  quantity,
  onQuantityChange,
  onAddToCart
}: { 
  item: MenuItem
  quantity: number
  onQuantityChange: (itemId: string, change: number) => void
  onAddToCart: (item: MenuItem) => void
}) {
  const imageAspectRatio = 1 / 1
  const imageSize = 200

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm flex flex-col h-full bg-white hover:shadow-md transition-shadow duration-200">
      <div className="relative flex-1">
        <div className="w-full" style={{ paddingTop: `${100 / imageAspectRatio}%` }}>
          <Image
            src={item.image}
            alt={`${item.packageType} ${item.mealType} - ${item.day}`}
            width={imageSize}
            height={imageSize}
            className="absolute top-0 left-0 w-full h-full object-cover"
            quality={80}
            priority={false}
          />
        </div>

        {/* Overlay with Day and Meal Type */}
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/60 to-transparent text-white p-2 flex items-start justify-between">
          <div className="text-xs font-medium text-white bg-primary rounded-full px-2 py-1">{item.day}</div>
          <div className="absolute right-2 top-2">
            <div className="text-white bg-primary rounded-full px-2 py-1 text-xs px-2 py-1 rounded-full flex items-center">
              <span className="w-2 h-2 bg-white rounded-full mr-1"></span>
              {item.mealType.charAt(0).toUpperCase() + item.mealType.slice(1)}
            </div>
          </div>
        </div>

        {/* Price Badge */}
        <div className="absolute bottom-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full font-medium shadow-md">
          ৳{item.price}
        </div>
      </div>

      {/* Card Content */}
      <div className="p-3 flex flex-col flex-grow">
        {/* Ingredients - Horizontal Display */}
        <div className="mb-4 flex-grow">
          <div className="flex flex-wrap gap-1 text-xs">
            {item.ingredients.slice(0, 4).map((ingredient, index) => (
              <span 
                key={index} 
                className="bg-green-50 text-green-700 px-2 py-1 rounded-full border border-green-200"
              >
                {ingredient.name}
              </span>
            ))}
            {item.ingredients.length > 4 && (
              <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full border border-gray-200">
                +{item.ingredients.length - 4} more
              </span>
            )}
          </div>
        </div>

        {/* Desktop: Quantity Controls and Add to Cart in one row */}
        <div className="hidden sm:flex items-center justify-between gap-2">
          <div className="flex items-center border border-gray-300 rounded-md">
            <button
              onClick={() => onQuantityChange(item.id, -1)}
              className="p-1 hover:bg-gray-100 transition-colors"
              disabled={quantity === 0}
            >
              <Minus size={14} className={quantity === 0 ? "text-gray-300" : "text-gray-600"} />
            </button>
            <span className="px-3 py-1 text-sm font-medium min-w-[2rem] text-center">
              {quantity}
            </span>
            <button
              onClick={() => onQuantityChange(item.id, 1)}
              className="p-1 hover:bg-gray-100 transition-colors"
            >
              <Plus size={14} className="text-gray-600" />
            </button>
          </div>
          <button
            onClick={() => onAddToCart(item)}
            disabled={quantity === 0}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              quantity === 0 
                ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                : "bg-green-600 text-white hover:bg-green-700"
            }`}
          >
            <ShoppingCart size={14} />
            Add
          </button>
        </div>

        {/* Mobile: Quantity Controls in one row, Add to Cart in second row */}
        <div className="sm:hidden space-y-2">
          <div className="flex items-center justify-center">
            <div className="flex items-center border border-gray-300 rounded-md">
              <button
                onClick={() => onQuantityChange(item.id, -1)}
                className="p-2 hover:bg-gray-100 transition-colors"
                disabled={quantity === 0}
              >
                <Minus size={16} className={quantity === 0 ? "text-gray-300" : "text-gray-600"} />
              </button>
              <span className="px-4 py-2 text-sm font-medium min-w-[3rem] text-center">
                {quantity}
              </span>
              <button
                onClick={() => onQuantityChange(item.id, 1)}
                className="p-2 hover:bg-gray-100 transition-colors"
              >
                <Plus size={16} className="text-gray-600" />
              </button>
            </div>
          </div>
          <button
            onClick={() => onAddToCart(item)}
            disabled={quantity === 0}
            className={`w-full flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              quantity === 0 
                ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                : "bg-green-600 text-white hover:bg-green-700"
            }`}
          >
            <ShoppingCart size={16} />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}