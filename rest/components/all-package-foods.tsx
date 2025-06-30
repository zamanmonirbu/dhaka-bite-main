"use client"
import Image from "next/image"
import { Plus, Minus, Check } from "lucide-react"
import { useCart } from "@/hooks/useCart"

interface MealItem {
  id: string
  name: string
  image: string
  ingredients: { name: string; quantity: string }[]
  price: number
  type: "lunch" | "dinner"
  day: string
  date: string
}

interface PackageData {
  name: string
  description: string
  color: string
  meals: { [key: string]: { lunch: MealItem; dinner: MealItem } }
}

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

// Generate package data
const generatePackageData = (): PackageData[] => {
  const packages = [
    {
      name: "Basic",
      description:
        "Affordable and nutritious meals perfect for everyday dining. Features fish-based proteins with rice, vegetables, and lentils.",
      color: "bg-green-600",
      price: { lunch: 65, dinner: 75 },
      lunchImage: "/curry-rice-fish-bowl.png",
      dinnerImage: "/bengali-fish-dish.jpg",
      protein: "Fish",
    },
    {
      name: "Standard",
      description:
        "Enhanced meals with chicken protein and additional variety. Perfect balance of taste, nutrition, and value.",
      color: "bg-blue-600",
      price: { lunch: 80, dinner: 90 },
      lunchImage: "/fried-chicken.png",
      dinnerImage: "/food-plate.jpg",
      protein: "Chicken",
    },
    {
      name: "Premium",
      description:
        "Our finest offering with premium beef protein and gourmet preparations. The ultimate dining experience at home.",
      color: "bg-purple-600",
      price: { lunch: 120, dinner: 140 },
      lunchImage: "/beef-curry.png",
      dinnerImage: "/bengali-food-curry.jpg",
      protein: "Beef",
    },
  ]

  return packages.map((pkg) => {
    const meals: { [key: string]: { lunch: MealItem; dinner: MealItem } } = {}

    daysOfWeek.forEach((day) => {
      meals[day] = {
        lunch: {
          id: `${pkg.name.toLowerCase()}-${day.toLowerCase()}-lunch`,
          name: "Lunch",
          image: pkg.lunchImage,
          ingredients: [
            { name: "Rice", quantity: "250 gm" },
            {
              name: pkg.protein,
              quantity: pkg.name === "Standard" ? "2 pieces" : pkg.name === "Premium" ? "4 pieces" : "1 piece",
            },
            { name: "Vegetables", quantity: "120 gm" },
            { name: "Lentils", quantity: "60 gm" },
          ],
          price: pkg.price.lunch,
          type: "lunch",
          day,
          date: getNextDateForDay(day),
        },
        dinner: {
          id: `${pkg.name.toLowerCase()}-${day.toLowerCase()}-dinner`,
          name: "Dinner",
          image: pkg.dinnerImage,
          ingredients: [
            { name: "Rice", quantity: "250 gm" },
            {
              name: pkg.protein,
              quantity: pkg.name === "Standard" ? "2 pieces" : pkg.name === "Premium" ? "4 pieces" : "1 piece",
            },
            { name: "Vegetables", quantity: "120 gm" },
            { name: "Lentils", quantity: "60 gm" },
          ],
          price: pkg.price.dinner,
          type: "dinner",
          day,
          date: getNextDateForDay(day),
        },
      }
    })

    return {
      name: pkg.name,
      description: pkg.description,
      color: pkg.color,
      meals,
    }
  })
}

export default function AllPackageFoods() {
  const { addToCart, updateQuantity, items } = useCart()
  const packageData = generatePackageData()

  // Function to get quantity of an item in cart
  const getItemQuantity = (mealId: string) => {
    const item = items.find((item) => item.id === mealId)
    return item ? item.quantity : 0
  }

  const handleAddToCart = (meal: MealItem) => {
    addToCart({
      id: meal.id,
      name: `${meal.day} ${meal.name}`,
      price: meal.price,
      image: meal.image,
      ingredients: meal.ingredients.map((ing) => ing.name),
      quantity: 1,
    })
  }

  const handleQuantityChange = (mealId: string, newQuantity: number) => {
    updateQuantity(mealId, Math.max(0, newQuantity))
  }

  const MealCard = ({ meal }: { meal: MealItem }) => {
    const quantity = getItemQuantity(meal.id)

    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
        <div className="relative h-48">
          <Image src={meal.image || "/placeholder.svg"} alt={meal.name} fill className="object-cover" />
          <div className="absolute top-2 left-2">
            <span
              className={`px-2 py-1 rounded text-white text-xs font-medium ${
                meal.type === "lunch" ? "bg-green-600" : "bg-orange-600"
              }`}
            >
              {meal.type === "lunch" ? "🍽️ Lunch" : "🌙 Dinner"}
            </span>
          </div>
          <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded text-sm font-bold">
            {meal.price}/-
          </div>
        </div>

        <div className="p-4">
          <h4 className="font-semibold text-lg mb-3 text-center">{meal.name}</h4>

          <div className="space-y-2 mb-4">
            {meal.ingredients.map((ingredient, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <Check className="w-3 h-3 text-green-600 mr-2" />
                  <span className="text-gray-700">{ingredient.name}</span>
                </div>
                <span className="text-gray-600 font-medium">{ingredient.quantity}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between">
            {quantity > 0 ? (
              <>
                <div className="flex items-center border border-gray-300 rounded">
                  <button
                    onClick={() => handleQuantityChange(meal.id, quantity - 1)}
                    className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-3 py-1 border-x border-gray-300 text-sm font-medium">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(meal.id, quantity + 1)}
                    className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <button
                  onClick={() => handleAddToCart(meal)}
                  className="bg-green-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-green-700 flex items-center"
                >
                  <Check className="w-4 h-4 mr-1" />
                  Add Cart
                </button>
              </>
            ) : (
              <>
                <div className="flex items-center border border-gray-300 rounded">
                  <button disabled className="px-2 py-1 text-gray-400 cursor-not-allowed">
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-3 py-1 border-x border-gray-300 text-sm font-medium">1</span>
                  <button disabled className="px-2 py-1 text-gray-400 cursor-not-allowed">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <button
                  onClick={() => handleAddToCart(meal)}
                  className="bg-green-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-green-700 flex items-center"
                >
                  <Check className="w-4 h-4 mr-1" />
                  Add Cart
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    )
  }

  const PackageSection = ({ packageInfo }: { packageInfo: PackageData }) => {
    return (
      <div className="mb-16">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Weekly Menu - {packageInfo.name}</h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            {packageInfo.description} Each day includes both lunch and dinner options with detailed ingredient
            quantities.
          </p>
        </div>

        <div className="space-y-8">
          {daysOfWeek.map((day, dayIndex) => {
            if (dayIndex % 2 === 0) {
              const currentDay = daysOfWeek[dayIndex]
              const nextDay = daysOfWeek[dayIndex + 1]

              return (
                <div key={day} className="grid md:grid-cols-2 gap-8">
                  {/* Current Day */}
                  <div>
                    <div className="text-center mb-6">
                      <h3 className="text-xl font-bold">{currentDay}</h3>
                      <p className="text-gray-600">{packageInfo.meals[currentDay]?.lunch.date}</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <MealCard meal={packageInfo.meals[currentDay]?.lunch} />
                      <MealCard meal={packageInfo.meals[currentDay]?.dinner} />
                    </div>
                  </div>

                  {/* Next Day */}
                  {nextDay && (
                    <div>
                      <div className="text-center mb-6">
                        <h3 className="text-xl font-bold">{nextDay}</h3>
                        <p className="text-gray-600">{packageInfo.meals[nextDay]?.lunch.date}</p>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <MealCard meal={packageInfo.meals[nextDay]?.lunch} />
                        <MealCard meal={packageInfo.meals[nextDay]?.dinner} />
                      </div>
                    </div>
                  )}
                </div>
              )
            }
            return null
          })}
        </div>
      </div>
    )
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Hero Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">All Package Foods</h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Explore our complete weekly menu across all three packages. Each package offers 7 days of delicious meals
            with both lunch and dinner options, featuring detailed ingredient quantities and nutritional information.
          </p>
        </div>

        {/* Package Sections */}
        {packageData.map((packageInfo) => (
          <PackageSection key={packageInfo.name} packageInfo={packageInfo} />
        ))}

        {/* Call to Action */}
        <div className="text-center mt-16 bg-white rounded-lg p-8 shadow-sm">
          <h3 className="text-2xl font-bold mb-4">Ready to Order?</h3>
          <p className="text-gray-600 mb-6">
            Mix and match from any package or choose a weekly subscription for the best value.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => (window.location.href = "/checkout")}
              className="bg-primary text-white px-8 py-3 rounded-md hover:bg-primary/90 transition-colors font-medium"
            >
              Proceed to Checkout
            </button>
            <button
              onClick={() => (window.location.href = "/subscription")}
              className="border border-primary text-primary px-8 py-3 rounded-md hover:bg-primary hover:text-white transition-colors font-medium"
            >
              View Subscription Plans
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
