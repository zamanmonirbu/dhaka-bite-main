"use client"

import Image from "next/image"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Plus, Minus, ShoppingCart, Loader2, ChevronLeft, ChevronRight } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { useCart } from "@/hooks/useCart"
import { useToast } from "@/hooks/use-toast"
import { useGetPackageByIdQuery } from "@/store/api/packageApi"
import type { CartItem } from "@/store/slices/cartSlice"

interface MenuItem {
  id: string
  name: string
  packageType: string
  mealType: "breakfast" | "lunch" | "dinner"
  image: string
  price: number
  day: string
  description: string
  ingredients: {
    name: string
    quantity: string
    unit: string
  }[]
  deliveryCharges: number
}

const convertApiMealToMenuItem = (meal: any): MenuItem => {
  return {
    id: meal._id,
    name: meal.name,
    packageType: meal.foodPackage.packageName,
    mealType: meal.time,
    image: meal.image,
    price: meal.price,
    day: meal.availability.charAt(0).toUpperCase() + meal.availability.slice(1),
    description: meal.description,
    ingredients: meal.ingredients,
    deliveryCharges: meal.deliveryCharges
  }
}

function MealCard({
  item,
  quantity,
  onQuantityChange,
  onAddToCart
}: {
  item: MenuItem
  quantity: number
  onQuantityChange: (id: string, delta: number) => void
  onAddToCart: (item: MenuItem) => void
}) {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm flex flex-col h-full bg-white hover:shadow-md transition-shadow duration-200">
      <div className="relative">
        <div className="w-full aspect-square">
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover"
          />
        </div>
        
        {/* Overlay with Day and Meal Type */}
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/60 to-transparent text-white p-2 flex items-start justify-between">
          <div className="text-xs font-medium text-white bg-green-700 rounded-full px-2 py-1">{item.day}</div>
          <div className="absolute right-2 top-2">
            <div className="text-white bg-green-700 rounded-full px-2 py-1 text-xs flex items-center">
              <span className="w-2 h-2 bg-white rounded-full mr-1"></span>
              {item.mealType.charAt(0).toUpperCase() + item.mealType.slice(1)}
            </div>
          </div>
        </div>

        {/* Price Badge */}
        <div className="absolute bottom-2 right-2 bg-red-600 text-white text-sm px-2 py-1 rounded-full shadow">
          ৳{item.price}
        </div>
      </div>
      
      <div className="p-1 flex flex-col flex-grow">
        {/* <h3 className="font-semibold text-lg mb-1">{item.name}</h3>
        <p className="text-sm text-gray-600 line-clamp-2 mb-3">{item.description}</p> */}

        {/* Ingredients */}
        <div className="mb-4 flex-grow">
          <div className="flex flex-wrap gap-1 text-xs">
            {item.ingredients.slice(0, 3).map((ing, i) => (
              <span key={i} className="bg-green-50 text-green-700 px-2 py-1 rounded-full border border-green-200">
                {ing.name}
              </span>
            ))}
            {item.ingredients.length > 3 && (
              <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full border border-gray-200">
                +{item.ingredients.length - 3} more
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

function DaySection({ 
  day, 
  items, 
  quantities,
  onQuantityChange,
  onAddToCart
}: { 
  day: string
  items: MenuItem[]
  quantities: Record<string, number>
  onQuantityChange: (id: string, delta: number) => void
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
      const cardWidth = isMobile ? 180 : 256
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
    <div className="mb-10">
      <h2 className="text-2xl font-semibold mb-4">{day}</h2>
      <div className="relative">
        <button
          className={`absolute left-1 sm:left-1 top-1/2 transform -translate-y-1/2 z-20 bg-white/90 backdrop-blur-sm shadow-lg rounded-full p-2 transition-all duration-200 ${
            canScrollLeft ? 'opacity-100 hover:bg-white hover:shadow-xl' : 'opacity-50 cursor-not-allowed'
          }`}
          onClick={() => scroll("left")}
          disabled={!canScrollLeft}
        >
          <ChevronLeft size={20} className="text-gray-700" />
        </button>

        <button
          className={`absolute right-2 sm:right-6 top-1/2 transform -translate-y-1/2 z-20 bg-white/90 backdrop-blur-sm shadow-lg rounded-full p-2 transition-all duration-200 ${
            canScrollRight ? 'opacity-100 hover:bg-white hover:shadow-xl' : 'opacity-50 cursor-not-allowed'
          }`}
          onClick={() => scroll("right")}
          disabled={!canScrollRight}
        >
          <ChevronRight size={20} className="text-gray-700" />
        </button>

        <div 
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto py-2 scrollbar-hide scroll-smooth px-4 sm:px-8"
          onScroll={checkScrollPosition}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {items.map(item => (
            <div 
              key={item.id} 
              className="min-w-[170px] max-w-[170px] sm:min-w-[256px] sm:max-w-[256px] flex-shrink-0"
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
    </div>
  )
}

export default function PackageMenuPage() {
  const params = useParams()
  const router = useRouter()
  const packageType = params.packageType as string
  const { addToCart } = useCart()
  const { toast } = useToast()
  const [quantities, setQuantities] = useState<Record<string, number>>({})
  const [selectedMealType, setSelectedMealType] = useState<string>("all")

  const { data, isLoading, error } = useGetPackageByIdQuery(packageType)

  const meals = (data?.data || []).map(convertApiMealToMenuItem)
  const filteredMeals = selectedMealType === "all"
    ? meals
    : meals.filter(item => item.mealType === selectedMealType)

  const days = [...new Set(filteredMeals.map(item => item.day))]

  const handleQuantityChange = (id: string, delta: number) => {
    setQuantities(prev => {
      const current = prev[id] || 0
      return { ...prev, [id]: Math.max(0, current + delta) }
    })
  }

  const handleAddToCart = async (item: MenuItem) => {
    const quantity = quantities[item.id] || 1

    for (let i = 0; i < quantity; i++) {
      const cartItem: CartItem = {
        id: `${item.id}-${Date.now()}-${i}`,
        name: `${item.packageType} ${item.mealType} - ${item.day}`,
        price: item.price,
        quantity: 1,
        image: item.image,
        mealType: item.mealType,
        menuType: item.packageType,
        ingredients: item.ingredients.map(ing => ({
          name: ing.name,
          quantity: `${ing.quantity} ${ing.unit}`
        }))
      }

      try {
        await addToCart(cartItem)
      } catch {
        toast({ title: "Error", description: "Could not add to cart", variant: "destructive" })
        return
      }
    }

    toast({ title: "Added to Cart", description: `${quantity} x ${item.name} added.` })
    setQuantities(prev => ({ ...prev, [item.id]: 0 }))
  }

  const mealTypes = ["all", "breakfast", "lunch", "dinner"]

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        Loading meals...
      </div>
    )
  }

  if (error || meals.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center">
        <p className="text-red-500">Could not load meals for this package.</p>
        <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-green-600 text-white rounded">
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen ">
      <div className="container mx-auto px-1 py-8">
       

        <div className="mb-6 flex flex-wrap gap-2">
          {mealTypes.map(type => (
            <button
              key={type}
              onClick={() => setSelectedMealType(type)}
              className={`px-4 py-2 rounded-full text-sm ${
                selectedMealType === type
                  ? "bg-green-600 text-white"
                  : "bg-white border border-gray-300 text-gray-600 hover:bg-gray-100"
              }`}
            >
              {type === "all" ? "All Meals" : type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        {days.map(day => {
          const mealsForDay = filteredMeals.filter(m => m.day === day)
          return (
            <DaySection
              key={day}
              day={day}
              items={mealsForDay}
              quantities={quantities}
              onQuantityChange={handleQuantityChange}
              onAddToCart={handleAddToCart}
            />
          )
        })}
      </div>
    </div>
  )
}