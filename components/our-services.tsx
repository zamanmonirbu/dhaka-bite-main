"use client"

import Image from "next/image"
import Link from "next/link"
import { Check, Heart, Loader2, ChevronLeft, ChevronRight } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { useCart } from "@/hooks/useCart"
import { useToast } from "@/hooks/use-toast"
import { useGetMealsQuery } from "@/store/api/mealApi"
import { useGetPackagesQuery } from "@/store/api/packageApi"
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
  const [favorites, setFavorites] = useState<Record<string, boolean>>({})

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

  const handleAddToCart = async (item: MenuItem) => {
    const cartItem: CartItem = {
      id: `${item.id}-${Date.now()}`,
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
      toast({ title: "Added to cart", description: `${item.packageType} ${item.mealType} (${item.day}) added to your cart` })
    } catch (error) {
      toast({ title: "Error", description: "Could not add item to cart. Please try again.", variant: "destructive" })
    }
  }

  const handleToggleFavorite = (itemId: string) => {
    setFavorites(prev => ({ ...prev, [itemId]: !prev[itemId] }))
    const menuItems = getMenuItemsByPackage()
    const item = menuItems.find(i => i.id === itemId)
    if (item) handleAddToCart(item)
  }

  const menuItems = getMenuItemsByPackage()
  const packageTypes = packagesData?.data?.map((pkg: any) => pkg.packageName) || []

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
    <section className="py-4  mt-12">
      <div className="w-full">
        {packageTypes.map((packageType: string) => (
          <PackageSection
            key={packageType}
            packageType={packageType}
            items={menuItems.filter(item => item.packageType === packageType)}
            favorites={favorites}
            handleToggleFavorite={handleToggleFavorite}
          />
        ))}
      </div>
    </section>
  )
}

function PackageSection({ 
  packageType, 
  items, 
  favorites, 
  handleToggleFavorite 
}: { 
  packageType: string
  items: MenuItem[]
  favorites: Record<string, boolean>
  handleToggleFavorite: (id: string) => void 
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
      // Calculate scroll amount based on screen size
      const isMobile = window.innerWidth < 640
      const cardWidth = isMobile ? 180 : 220 // Adjusted for mobile responsiveness
      const gap = 12 // Gap between cards
      const scrollAmount = cardWidth + gap
      
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth"
      })
      
      // Update button states after scroll animation
      setTimeout(checkScrollPosition, 300)
    }
  }

  return (
    <div className="mb-12">
      <h3 className="text-2xl font-bold text-center mb-6 px-4">{packageType} Menu</h3>
      
      <div className="relative">
        {/* Left Navigation Button */}
        <button
          className={`absolute left-2 top-1/2 transform -translate-y-1/2 z-20 bg-white/90 backdrop-blur-sm shadow-lg rounded-full p-1.5 transition-all duration-200 ${
            canScrollLeft 
              ? 'opacity-100 hover:bg-white hover:shadow-xl' 
              : 'opacity-50 cursor-not-allowed'
          }`}
          onClick={() => scroll("left")}
          disabled={!canScrollLeft}
          aria-label="Scroll left"
        >
          <ChevronLeft size={18} className="text-gray-700" />
        </button>

        {/* Right Navigation Button */}
        <button
          className={`absolute right-2 top-1/2 transform -translate-y-1/2 z-20 bg-white/90 backdrop-blur-sm shadow-lg rounded-full p-1.5 transition-all duration-200 ${
            canScrollRight 
              ? 'opacity-100 hover:bg-white hover:shadow-xl' 
              : 'opacity-50 cursor-not-allowed'
          }`}
          onClick={() => scroll("right")}
          disabled={!canScrollRight}
          aria-label="Scroll right"
        >
          <ChevronRight size={18} className="text-gray-700" />
        </button>

        {/* Scrollable Container */}
        <div 
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto py-2 scrollbar-hide scroll-smooth"
          onScroll={checkScrollPosition}
          style={{
            scrollbarWidth: 'none', /* Firefox */
            msOverflowStyle: 'none', /* IE and Edge */
          }}
        >
          {items.map(item => (
            <div 
              key={item.id} 
              className="min-w-[170px] max-w-[170px] sm:min-w-[200px] sm:max-w-[200px] flex-shrink-0"
            >
              <MealCard
                item={item}
                isFavorite={!!favorites[item.id]}
                onToggleFavorite={() => handleToggleFavorite(item.id)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* See More Link */}
      <div className="flex justify-end mt-4 px-4">
        <Link 
          href={`/menu/${packageType.toLowerCase()}`} 
          className="text-primary font-medium flex items-center hover:underline transition-colors"
          aria-label={`See more ${packageType} menu items`}
        >
          See More <ChevronRight size={16} className="ml-1" />
        </Link>
      </div>
    </div>
  )
}

function MealCard({ 
  item, 
  isFavorite, 
  onToggleFavorite 
}: { 
  item: MenuItem
  isFavorite: boolean
  onToggleFavorite: () => void 
}) {
  const [isIngredientsOpen, setIsIngredientsOpen] = useState(false)
  const imageAspectRatio = 4 / 3
  const imageHeight = 200
  const imageWidth = imageHeight * imageAspectRatio

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm flex flex-col h-full bg-white hover:shadow-md transition-shadow duration-200">
      <div className="relative flex-1">
        <div className="w-full" style={{ paddingTop: `${100 / imageAspectRatio}%` }}>
          <Image
            src={item.image}
            alt={`${item.packageType} ${item.mealType} - ${item.day}`}
            width={imageWidth}
            height={imageHeight}
            className="absolute top-0 left-0 w-full h-full object-cover"
            quality={80}
            priority={false}
          />
        </div>

        {/* Overlay with Day and Meal Type */}
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/60 to-transparent text-white p-2 flex items-start justify-between">
          <div className="text-xs font-medium">{item.day}</div>
          <div className="absolute left-1/2 transform -translate-x-1/2 top-2">
            <div className="bg-green-600 text-white text-xs px-2 py-1 rounded-full flex items-center">
              <span className="w-2 h-2 bg-white rounded-full mr-1"></span>
              {item.mealType.charAt(0).toUpperCase() + item.mealType.slice(1)}
            </div>
          </div>
        </div>

        {/* Favorite Button */}
        <div className="absolute top-2 right-2 z-10">
          <button 
            onClick={onToggleFavorite} 
            className={`p-1.5 rounded-full shadow-md transition-all duration-200 ${
              isFavorite ? "bg-green-100 scale-110" : "bg-white/90 hover:bg-white"
            }`}
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart 
              size={16} 
              className={isFavorite ? "text-green-600 fill-green-600" : "text-gray-500"} 
            />
          </button>
        </div>

        {/* Price Badge */}
        <div className="absolute bottom-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full font-medium shadow-md">
          ৳{item.price}
        </div>
      </div>

      {/* Card Content */}
      <div className="p-3 flex flex-col flex-grow">
        {/* Desktop Ingredients List */}
        <div className="hidden sm:block space-y-2 mb-4 flex-grow">
          {item.ingredients.slice(0, 3).map((ingredient, index) => (
            <div key={index} className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <Check size={14} className="text-green-600 mr-2" />
                <span className="truncate">{ingredient.name}</span>
              </div>
              <span className="text-gray-500 text-xs ml-2 flex-shrink-0">
                {ingredient.quantity} {ingredient.unit}
              </span>
            </div>
          ))}
          {item.ingredients.length > 3 && (
            <div className="text-xs text-gray-500 text-center">
              +{item.ingredients.length - 3} more ingredients
            </div>
          )}
        </div>

        {/* Mobile Ingredients Dialog */}
        <div className="sm:hidden mb-3">
          <Dialog open={isIngredientsOpen} onOpenChange={setIsIngredientsOpen}>
            <DialogTrigger asChild>
              <button className="w-full text-center text-green-600 text-sm font-medium py-2 border border-green-600 rounded-md hover:bg-green-50 transition-colors">
                View Ingredients
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{item.name} - Ingredients</DialogTitle>
              </DialogHeader>
              <div className="space-y-3">
                {item.ingredients.map((ingredient, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                    <div className="flex items-center">
                      <Check size={16} className="text-green-600 mr-2" />
                      <span>{ingredient.name}</span>
                    </div>
                    <span className="text-gray-600 text-sm">
                      {ingredient.quantity} {ingredient.unit}
                    </span>
                  </div>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  )
}
