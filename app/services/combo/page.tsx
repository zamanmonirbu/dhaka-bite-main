    import ServiceProducts from "@/components/service-products"
import ServiceHero from "@/components/service-hero"

const comboProducts = [
  {
    id: "combo-1",
    name: "Burger Combo",
    price: 180,
    image: "/sandwich-fries.png",
    description: "Chicken burger with fries and drink",
    ingredients: ["Chicken Burger", "French Fries", "Soft Drink", "Ketchup"],
  },
  {
    id: "combo-2",
    name: "Pizza Combo",
    price: 250,
    image: "/fast-food.png",
    description: "Personal pizza with garlic bread and drink",
    ingredients: ["Personal Pizza", "Garlic Bread", "Soft Drink", "Dip"],
  },
  {
    id: "combo-3",
    name: "Chicken Combo",
    price: 220,
    image: "/fried-chicken.png",
    description: "Fried chicken with rice and salad",
    ingredients: ["Fried Chicken", "Rice", "Salad", "Gravy", "Drink"],
  },
  {
    id: "combo-4",
    name: "Wrap Combo",
    price: 150,
    image: "/fast-food.png",
    description: "Chicken wrap with chips and drink",
    ingredients: ["Chicken Wrap", "Potato Chips", "Soft Drink", "Sauce"],
  },
  {
    id: "combo-5",
    name: "Fish Combo",
    price: 190,
    image: "/bengali-fish-dish.jpg",
    description: "Fish fillet with fries and coleslaw",
    ingredients: ["Fish Fillet", "French Fries", "Coleslaw", "Tartar Sauce", "Drink"],
  },
  {
    id: "combo-6",
    name: "Sandwich Combo",
    price: 140,
    image: "/sandwich-fries.png",
    description: "Club sandwich with fries and drink",
    ingredients: ["Club Sandwich", "French Fries", "Soft Drink", "Pickles"],
  },
  {
    id: "combo-7",
    name: "Wings Combo",
    price: 200,
    image: "/fried-chicken.png",
    description: "Chicken wings with rice and drink",
    ingredients: ["Chicken Wings", "Rice", "Vegetables", "Sauce", "Drink"],
  },
  {
    id: "combo-8",
    name: "Family Combo",
    price: 350,
    image: "/food-plate.png",
    description: "Large combo for 2-3 people",
    ingredients: ["2 Burgers", "Large Fries", "Chicken Wings", "2 Drinks", "Dessert"],
  },
]

export default function ComboPage() {
  return (
    <div className="min-h-screen">
      <ServiceHero
        title="Combo Meals"
        description="Value meal combinations with everything you need for a complete meal"
        backgroundImage="/food-spread-background.jpg"
      />
      <ServiceProducts products={comboProducts} category="combo" />
    </div>
  )
}
