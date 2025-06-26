import ServiceProducts from "@/components/service-products"
import ServiceHero from "@/components/service-hero"

const snacksProducts = [
  {
    id: "snacks-1",
    name: "Samosa Combo",
    price: 45,
    image: "/snacks.png",
    description: "Crispy samosas with chutney",
    ingredients: ["Samosa", "Potato", "Chutney", "Onion"],
  },
  {
    id: "snacks-2",
    name: "Spring Rolls",
    price: 55,
    image: "/snacks.png",
    description: "Vegetable spring rolls (4 pieces)",
    ingredients: ["Spring Roll", "Vegetables", "Sweet & Sour Sauce"],
  },
  {
    id: "snacks-3",
    name: "French Fries",
    price: 35,
    image: "/snacks.png",
    description: "Crispy golden french fries",
    ingredients: ["Potato", "Salt", "Ketchup"],
  },
  {
    id: "snacks-4",
    name: "Chicken Nuggets",
    price: 75,
    image: "/fried-chicken.png",
    description: "Crispy chicken nuggets (8 pieces)",
    ingredients: ["Chicken", "Breadcrumbs", "BBQ Sauce", "Honey Mustard"],
  },
  {
    id: "snacks-5",
    name: "Onion Rings",
    price: 40,
    image: "/snacks.png",
    description: "Crispy onion rings with dip",
    ingredients: ["Onion", "Batter", "Ranch Dip"],
  },
  {
    id: "snacks-6",
    name: "Nachos",
    price: 65,
    image: "/snacks.png",
    description: "Loaded nachos with cheese",
    ingredients: ["Tortilla Chips", "Cheese", "Salsa", "Jalapenos"],
  },
  {
    id: "snacks-7",
    name: "Mozzarella Sticks",
    price: 80,
    image: "/snacks.png",
    description: "Fried mozzarella sticks (6 pieces)",
    ingredients: ["Mozzarella", "Breadcrumbs", "Marinara Sauce"],
  },
  {
    id: "snacks-8",
    name: "Mixed Platter",
    price: 120,
    image: "/snacks.png",
    description: "Assorted snacks platter",
    ingredients: ["Samosa", "Spring Roll", "Nuggets", "Fries", "Sauces"],
  },
]

export default function SnacksPage() {
  return (
    <div className="min-h-screen">
      <ServiceHero
        title="Snacks & Appetizers"
        description="Perfect light bites and appetizers for any time of the day"
        backgroundImage="/snacks-detail.jpg"
      />
      <ServiceProducts products={snacksProducts} category="snacks" />
    </div>
  )
}
