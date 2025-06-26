"use client"

import Image from "next/image"
import Link from "next/link"
import { Check, ChevronRight, Minus, Plus, Loader2 } from "lucide-react"
import { useState } from "react"
import { useCart } from "@/hooks/useCart"
import { useToast } from "@/hooks/use-toast"
import { useGetTodayMealsQuery, type ApiMeal } from "@/store/api/mealApi"
import type { CartItem } from "@/store/slices/cartSlice"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface MenuItem {
  id: string
  type: "basic" | "standard" | "premium"
  mealType: "breakfast" | "lunch" | "dinner" | "snack"
  image: string
  price: number
  day: string
  date: string
  name: string
  description: string
  ingredients: {
    name: string
    quantity: string
    unit: string
  }[]
  deliveryCharges: number
}

const getTodayDayName = (): string => {
  const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
  const today = new Date()
  return days[today.getDay()]
}

const getDateForDay = (dayName: string): string => {
  const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
  const today = new Date()
  const todayDayIndex = today.getDay()
  const targetDayIndex = days.indexOf(dayName.toLowerCase())

  if (targetDayIndex === todayDayIndex) {
    return `${today.getDate()} ${today.toLocaleString("default", { month: "short" })}`
  }

  let daysToAdd = targetDayIndex - todayDayIndex
  if (daysToAdd <= 0) daysToAdd += 7

  const targetDate = new Date(today)
  targetDate.setDate(today.getDate() + daysToAdd)

  return `${targetDate.getDate()} ${targetDate.toLocaleString("default", { month: "short" })}`
}

const convertApiMealToMenuItem = (apiMeal: ApiMeal, day: string): MenuItem => {
  return {
    id: apiMeal._id,
    type: apiMeal.foodPackage,
    mealType: apiMeal.time,
    image: apiMeal.image,
    price: apiMeal.price,
    day: day.charAt(0).toUpperCase() + day.slice(1),
    date: getDateForDay(day),
    name: apiMeal.name,
    description: apiMeal.description,
    ingredients: apiMeal.ingredients,
    deliveryCharges: apiMeal.deliveryCharges,
  }
}

export default function OurServices() {
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({})
  const { addToCart } = useCart()
  const { toast } = useToast()

  const todayDayName = getTodayDayName()
  const { data: mealsData, isLoading, error } = useGetTodayMealsQuery(todayDayName)

  const getMenuItemsByPackage = (packageType: "basic" | "standard" | "premium"): MenuItem[] => {
    if (!mealsData?.data?.[packageType]) return []

    const packageData = mealsData.data[packageType]
    const menuItems: MenuItem[] = []

    Object.keys(packageData).forEach(day => {
      packageData[day].forEach(meal => {
        menuItems.push(convertApiMealToMenuItem(meal, day))
      })
    })

    return menuItems
  }

  const updateQuantity = (id: string, change: number) => {
    setQuantities((prev) => {
      const currentQuantity = prev[id] || 1
      const newQuantity = Math.max(1, currentQuantity + change)
      return { ...prev, [id]: newQuantity }
    })
  }

  const handleAddToCart = async (item: MenuItem) => {
    const quantity = quantities[item.id] || 1

    const cartItem: CartItem = {
      id: `${item.id}-${Date.now()}`,
      name: `${item.type.charAt(0).toUpperCase() + item.type.slice(1)} ${item.mealType.charAt(0).toUpperCase() + item.mealType.slice(1)} - ${item.day}`,
      price: item.price,
      quantity,
      image: item.image,
      date: item.date,
      mealType: item.mealType as "lunch" | "dinner",
      menuType: item.type.charAt(0).toUpperCase() + item.type.slice(1) as "Basic" | "Standard" | "Premium",
      ingredients: item.ingredients.map(ing => ({
        name: ing.name,
        quantity: `${ing.quantity} ${ing.unit}`,
      })),
    }

    try {
      await addToCart(cartItem)
      toast({
        title: "Added to cart",
        description: `${quantity} x ${item.type} ${item.mealType} (${item.day}) added to your cart`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not add item to cart. Please try again.",
        variant: "destructive",
      })
    }
  }

  const MealCard = ({ item }: { item: MenuItem }) => {
    const quantity = quantities[item.id] || 1
    const [isIngredientsOpen, setIsIngredientsOpen] = useState(false)

    return (
      <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm flex flex-col h-full">
        <div className="relative flex-1">
          <Image
            src={item.image || "/placeholder.svg"}
            alt={`${item.type} ${item.mealType} - ${item.day}`}
            width={300}
            height={200}
            className="w-full h-48 object-cover"
          />
          
          <div className="absolute top-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 flex justify-between items-center">
            <div className="text-xs sm:text-sm font-medium">
              {item.day}, {item.date}
            </div>
            
            <div className="bg-green-600 text-white text-xs px-2 py-1 rounded flex items-center">
              <span className="w-2 h-2 bg-white rounded-full mr-1"></span>
              {item.mealType.charAt(0).toUpperCase() + item.mealType.slice(1)}
            </div>
          </div>
          
          <div className="absolute bottom-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded">
            {item.price}/-
          </div>
        </div>

        <div className="p-4 flex flex-col flex-grow">
          <h3 className="text-lg font-semibold mb-2 text-center">
            {item.name}
          </h3>
          
          <p className="text-sm text-gray-600 text-center mb-4 line-clamp-2">
            {item.description}
          </p>

          <div className="hidden sm:block space-y-2 mb-4 flex-grow">
            {item.ingredients.map((ingredient, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <Check size={16} className="text-green-600 mr-2" />
                  <span className="text-sm">{ingredient.name}</span>
                </div>
                <span className="text-gray-600 text-xs">{ingredient.quantity} {ingredient.unit}</span>
              </div>
            ))}
          </div>

          <div className="sm:hidden mb-4">
            <Dialog open={isIngredientsOpen} onOpenChange={setIsIngredientsOpen}>
              <DialogTrigger asChild>
                <button className="w-full text-center text-green-600 text-sm font-medium py-2 border border-green-600 rounded-md hover:bg-green-50">
                  View Ingredients
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Ingredients</DialogTitle>
                </DialogHeader>
                <div className="space-y-2">
                  {item.ingredients.map((ingredient, index) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b">
                      <div className="flex items-center">
                        <Check size={16} className="text-green-600 mr-2" />
                        <span>{ingredient.name}</span>
                      </div>
                      <span className="text-gray-600 text-sm">{ingredient.quantity} {ingredient.unit}</span>
                    </div>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="mt-auto">
            <div className="flex items-center justify-between w-full mb-3">
              <div className="flex items-center border border-gray-300 rounded-md w-full max-w-[120px]">
                <button 
                  onClick={() => updateQuantity(item.id, -1)} 
                  className="px-3 py-2 text-gray-600 hover:bg-gray-100 flex items-center justify-center"
                  aria-label="Decrease quantity"
                >
                  <Minus size={16} />
                </button>
                <span className="px-3 py-2 border-x border-gray-300 text-center flex-1">
                  {quantity}
                </span>
                <button 
                  onClick={() => updateQuantity(item.id, 1)} 
                  className="px-3 py-2 text-gray-600 hover:bg-gray-100 flex items-center justify-center"
                  aria-label="Increase quantity"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
            
           <button
  onClick={() => handleAddToCart(item)}
  className="w-full bg-green-600 text-white py-4 sm:px-2 sm:py-2 px-4  text-sm sm:text-base rounded-md hover:bg-green-700 flex items-center justify-center"
  aria-label={`Add ${item.name} to cart`}
>
  <Check size={16} className="mr-2" />
  Add to Cart
</button>

          </div>
        </div>
      </div>
    )
  }

  const PackageSection = ({ items, type }: { items: MenuItem[]; type: string }) => {
    if (items.length === 0) {
      return (
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-center mb-8">{type.charAt(0).toUpperCase() + type.slice(1)} Menu</h3>
          <div className="text-center text-gray-500 py-8">
            No meals available for this package today
          </div>
        </div>
      )
    }

    return (
      <div className="mb-12">
        <h3 className="text-2xl font-bold text-center mb-8">{type.charAt(0).toUpperCase() + type.slice(1)} Menu</h3>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
          {items.map((item) => (
            <MealCard key={item.id} item={item} />
          ))}
        </div>

        <div className="flex justify-end mt-6">
          <Link
            href={`/menu/${type.toLowerCase()}`}
            className="text-primary font-medium flex items-center hover:underline"
            aria-label={`See more ${type} menu items`}
          >
            See More <ChevronRight size={16} className="ml-1" />
          </Link>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading meals...</span>
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="text-center py-12">
            <p className="text-red-500 mb-4">Failed to load meals. Please try again later.</p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
              aria-label="Retry loading meals"
            >
              Retry
            </button>
          </div>
        </div>
      </section>
    )
  }

  const basicMenuItems = getMenuItemsByPackage("basic")
  const standardMenuItems = getMenuItemsByPackage("standard")
  const premiumMenuItems = getMenuItemsByPackage("premium")

  return (
    <section className="py-16 bg-white">
      <div className="container-custom">
        <PackageSection items={basicMenuItems} type="basic" />
        <PackageSection items={standardMenuItems} type="standard" />
        <PackageSection items={premiumMenuItems} type="premium" />
      </div>
    </section>
  )
}