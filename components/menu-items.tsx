"use client"

import { useState } from "react"
import Image from "next/image"
import { Check, Minus, Plus, Sun, Moon } from "lucide-react"

// Days of the week
const daysOfWeek = ["Friday", "Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"]

// Function to get the next date for a given day
const getNextDateForDay = (dayName: string): string => {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  const today = new Date()
  const todayDayIndex = today.getDay()
  const targetDayIndex = days.indexOf(dayName)

  let daysToAdd = targetDayIndex - todayDayIndex
  if (daysToAdd <= 0) daysToAdd += 7

  const targetDate = new Date(today)
  targetDate.setDate(today.getDate() + daysToAdd)

  return `${dayName}/${targetDate.getDate()} ${targetDate.toLocaleString("default", { month: "short" })}`
}

interface MenuItem {
  id: string
  name: string
  image: string
  price: number
  day: string
  date: string
  mealType: "Lunch" | "Dinner"
  items: {
    main: { name: string; quantity: string }
    sides: { name: string; quantity: string }[]
    protein: {
      name: string
      quantity: string
    }
  }
}

// Generate menu items based on type (2 meals per day)
const generateMenuItems = (type: string): MenuItem[] => {
  const menuConfig = {
    Basic: {
      price: 65,
      lunchImage: "/curry-rice-fish-bowl.png",
      dinnerImage: "/bengali-fish-dish.jpg",
      protein: { name: "Fish", quantity: "1 piece" },
      main: { name: "Rice", quantity: "200 gm" },
      sides: [
        { name: "Vegetables", quantity: "100 gm" },
        { name: "Lentils", quantity: "50 gm" },
      ],
    },
    Standard: {
      price: 80,
      lunchImage: "/fried-chicken.png",
      dinnerImage: "/bengali-food-curry.jpg",
      protein: { name: "Chicken", quantity: "2 pieces" },
      main: { name: "Rice", quantity: "250 gm" },
      sides: [
        { name: "Vegetables", quantity: "120 gm" },
        { name: "Lentils", quantity: "60 gm" },
      ],
    },
    Premium: {
      price: 120,
      lunchImage: "/beef-curry.png",
      dinnerImage: "/bengali-food-platter.jpg",
      protein: { name: "Beef", quantity: "4 pieces" },
      main: { name: "Rice", quantity: "300 gm" },
      sides: [
        { name: "Vegetables", quantity: "150 gm" },
        { name: "Dal", quantity: "80 gm" },
        { name: "Salad", quantity: "50 gm" },
      ],
    },
  }

  const config = menuConfig[type as keyof typeof menuConfig] || menuConfig.Basic

  // Generate 2 meals (lunch & dinner) for each day of the week
  const meals: MenuItem[] = []

  daysOfWeek.forEach((day) => {
    // Lunch meal
    meals.push({
      id: `${type.toLowerCase()}-${day.toLowerCase()}-lunch`,
      name: `${type} Lunch - ${day}`,
      image: config.lunchImage,
      price: config.price,
      day,
      date: getNextDateForDay(day),
      mealType: "Lunch",
      items: {
        main: config.main,
        sides: config.sides,
        protein: config.protein,
      },
    })

    // Dinner meal
    meals.push({
      id: `${type.toLowerCase()}-${day.toLowerCase()}-dinner`,
      name: `${type} Dinner - ${day}`,
      image: config.dinnerImage,
      price: config.price,
      day,
      date: getNextDateForDay(day),
      mealType: "Dinner",
      items: {
        main: config.main,
        sides: [...config.sides, { name: "Salad", quantity: "30 gm" }],
        protein: config.protein,
      },
    })
  })

  return meals
}

interface MenuItemsProps {
  type: string
}

export default function MenuItems({ type }: MenuItemsProps) {
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({})
  const [showIngredientsModal, setShowIngredientsModal] = useState<string | null>(null)
  const menuItems = generateMenuItems(type)

  // Group meals by pairs of days (2 days = 4 meals per row)
  const mealRows: { days: string[]; dates: string[]; meals: MenuItem[] }[] = []

  for (let i = 0; i < daysOfWeek.length; i += 2) {
    const day1 = daysOfWeek[i]
    const day2 = daysOfWeek[i + 1]

    const day1Meals = menuItems.filter((item) => item.day === day1)
    const day2Meals = menuItems.filter((item) => item.day === day2)

    // Combine meals from 2 days (4 meals total)
    const rowMeals = [...day1Meals, ...(day2Meals || [])]
    const days = [day1, day2].filter(Boolean)
    const dates = days.map((day) => getNextDateForDay(day))

    if (rowMeals.length > 0) {
      mealRows.push({
        days,
        dates,
        meals: rowMeals,
      })
    }
  }

  // Function to handle quantity changes
  const updateQuantity = (id: string, change: number) => {
    setQuantities((prev) => {
      const currentQuantity = prev[id] || 1
      const newQuantity = Math.max(1, currentQuantity + change)
      return { ...prev, [id]: newQuantity }
    })
  }

  // Function to handle adding to cart
  const addToCart = (item: MenuItem) => {
    console.log(`Added ${quantities[item.id] || 1} of ${item.name} to cart`)
  }

  return (
    <section className="py-16 bg-white">
      <div className="container-custom">
        <h2 className="text-3xl font-bold text-center mb-6">Weekly Menu - {type}</h2>
        <p className="text-center mb-12 max-w-3xl mx-auto">
          Our menu changes weekly to provide variety and seasonal ingredients. Each day includes both lunch and dinner
          options with detailed ingredient quantities.
        </p>

        <div className="space-y-8">
          {mealRows.map((row, rowIndex) => (
            <div key={rowIndex} className="bg-gray-50 rounded-lg p-6">
              {/* Grid for 2 days with centered headers */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {row.days.map((day, dayIndex) => {
                  const dayMeals = row.meals.filter((meal) => meal.day === day)
                  const dayDate = getNextDateForDay(day)

                  return (
                    <div key={day} className="space-y-4">
                      {/* Centered Day Header */}
                      <div className="text-center">
                        <h3 className="text-xl font-bold text-gray-800">{day}</h3>
                        <p className="text-gray-600 text-sm">{dayDate}</p>
                      </div>

                      {/* Lunch and Dinner Cards for this day - 2 columns on mobile, 2 columns on desktop */}
                      <div className="grid grid-cols-2 gap-4">
                        {dayMeals.map((item) => (
                          <MenuCard
                            key={item.id}
                            item={item}
                            quantity={quantities[item.id] || 1}
                            onUpdateQuantity={updateQuantity}
                            onAddToCart={addToCart}
                            showIngredientsModal={showIngredientsModal}
                            setShowIngredientsModal={setShowIngredientsModal}
                          />
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

interface MenuCardProps {
  item: MenuItem
  quantity: number
  onUpdateQuantity: (id: string, change: number) => void
  onAddToCart: (item: MenuItem) => void
  showIngredientsModal: string | null
  setShowIngredientsModal: (id: string | null) => void
}

function MenuCard({ 
  item, 
  quantity, 
  onUpdateQuantity, 
  onAddToCart, 
  showIngredientsModal, 
  setShowIngredientsModal 
}: MenuCardProps) {
  return (
    <>
      <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
        {/* Food Image with Meal Type Badge */}
        <div className="relative">
          <Image
            src={item.image || "/placeholder.svg"}
            alt={item.name}
            width={300}
            height={200}
            className="w-full h-32 sm:h-40 object-cover"
          />
          <div className="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
            {item.mealType === "Lunch" ? <Sun size={10} /> : <Moon size={10} />}
            {item.mealType}
          </div>
          <div className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded">{item.price}/-</div>
        </div>

        {/* Menu Details */}
        <div className="p-3">
          {/* Meal Type Header */}
          <div className="text-center mb-3">
            <p className="text-sm font-bold text-gray-800">{item.mealType}</p>
          </div>

          {/* Ingredients with Quantities - Hidden on mobile, visible on desktop */}
          <div className="hidden sm:block space-y-1 mb-3">
            {/* Main Item */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Check size={10} className="text-primary mr-1" />
                <span className="text-xs font-medium">{item.items.main.name}</span>
              </div>
              <span className="text-xs text-gray-600 bg-gray-100 px-1 py-0.5 rounded">{item.items.main.quantity}</span>
            </div>

            {/* Protein */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Check size={10} className="text-primary mr-1" />
                <span className="text-xs font-medium">{item.items.protein.name}</span>
              </div>
              <span className="text-xs text-gray-600 bg-gray-100 px-1 py-0.5 rounded">{item.items.protein.quantity}</span>
            </div>

            {/* Sides (show first 2 to save space) */}
            {item.items.sides.slice(0, 2).map((side, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <Check size={10} className="text-primary mr-1" />
                  <span className="text-xs font-medium">{side.name}</span>
                </div>
                <span className="text-xs text-gray-600 bg-gray-100 px-1 py-0.5 rounded">{side.quantity}</span>
              </div>
            ))}
          </div>

          {/* View Ingredients Button for Mobile */}
          <div className="sm:hidden mb-3">
            <button
              onClick={() => setShowIngredientsModal(item.id)}
              className="w-full text-center text-green-600 font-medium py-2 border border-green-600 rounded-md hover:bg-green-50 transition-colors text-xs"
            >
              View Ingredients
            </button>
          </div>

          {/* Quantity Controls and Add to Cart in Same Row */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
  {/* Quantity Controls */}
  <div className="flex items-center border border-gray-300 rounded-md w-full sm:w-1/2">
    <button
      onClick={() => onUpdateQuantity(item.id, -1)}
      className="flex-1 sm:flex-none px-2 py-1 text-gray-600 hover:bg-gray-100 transition-colors"
    >
      <Minus size={12} className="mx-auto" />
    </button>
    <span className="flex-1 sm:flex-none px-2 py-1 border-x border-gray-300 text-xs font-medium min-w-[30px] text-center">
      {quantity}
    </span>
    <button
      onClick={() => onUpdateQuantity(item.id, 1)}
      className="flex-1 sm:flex-none px-2 py-1 text-gray-600 hover:bg-gray-100 transition-colors"
    >
      <Plus size={12} className="mx-auto" />
    </button>
  </div>

  {/* Add to Cart Button */}
  <button
    onClick={() => onAddToCart(item)}
    className="w-full sm:w-1/2 bg-primary text-white px-2 py-1 rounded-md hover:bg-primary/90 flex items-center justify-center transition-colors text-xs"
  >
    <Check size={12} className="mr-1" />
    Add Cart
  </button>
</div>
        </div>
      </div>

      {/* Ingredients Modal for Mobile */}
      {showIngredientsModal === item.id && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 sm:hidden">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm mx-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Ingredients</h3>
              <button
                onClick={() => setShowIngredientsModal(null)}
                className="text-gray-500 hover:text-gray-700 text-xl font-bold"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Check size={16} className="text-green-600 mr-2" />
                  <span>{item.items.main.name}</span>
                </div>
                <span className="text-gray-600 text-sm">{item.items.main.quantity}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Check size={16} className="text-green-600 mr-2" />
                  <span>{item.items.protein.name}</span>
                </div>
                <span className="text-gray-600 text-sm">{item.items.protein.quantity}</span>
              </div>
              {item.items.sides.map((side, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Check size={16} className="text-green-600 mr-2" />
                    <span>{side.name}</span>
                  </div>
                  <span className="text-gray-600 text-sm">{side.quantity}</span>
                </div>
              ))}
            </div>
            
            <button
              onClick={() => setShowIngredientsModal(null)}
              className="w-full mt-4 bg-green-600 text-white py-2 rounded-md hover:bg-green-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  )
}