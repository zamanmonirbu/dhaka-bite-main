import ServiceProducts from "@/components/service-products"
import ServiceHero from "@/components/service-hero"

const fastFoodProducts = [
  {
    id: "fast-food-1",
    name: "Chicken Burger",
    price: 120,
    image: "/fast-food.png",
    description: "Juicy chicken burger with fresh vegetables",
    ingredients: ["Chicken Patty", "Bun", "Lettuce", "Tomato", "Cheese", "Mayo"],
  },
  {
    id: "fast-food-2",
    name: "Beef Pizza",
    price: 180,
    image: "/fast-food.png",
    description: "Delicious beef pizza with cheese",
    ingredients: ["Pizza Base", "Beef", "Cheese", "Tomato Sauce", "Onion", "Bell Pepper"],
  },
  {
    id: "fast-food-3",
    name: "Fish Burger",
    price: 110,
    image: "/fast-food.png",
    description: "Crispy fish burger with tartar sauce",
    ingredients: ["Fish Fillet", "Bun", "Lettuce", "Tomato", "Tartar Sauce"],
  },
  {
    id: "fast-food-4",
    name: "Chicken Pizza",
    price: 160,
    image: "/fast-food.png",
    description: "Chicken pizza with mushrooms",
    ingredients: ["Pizza Base", "Chicken", "Cheese", "Mushroom", "Tomato Sauce"],
  },
  {
    id: "fast-food-5",
    name: "Club Sandwich",
    price: 95,
    image: "/sandwich-fries.png",
    description: "Triple layer club sandwich",
    ingredients: ["Bread", "Chicken", "Bacon", "Lettuce", "Tomato", "Mayo"],
  },
  {
    id: "fast-food-6",
    name: "Chicken Wrap",
    price: 85,
    image: "/fast-food.png",
    description: "Grilled chicken wrap with vegetables",
    ingredients: ["Tortilla", "Chicken", "Lettuce", "Tomato", "Cucumber", "Sauce"],
  },
  {
    id: "fast-food-7",
    name: "Beef Burger",
    price: 140,
    image: "/fast-food.png",
    description: "Classic beef burger with cheese",
    ingredients: ["Beef Patty", "Bun", "Cheese", "Lettuce", "Tomato", "Onion"],
  },
  {
    id: "fast-food-8",
    name: "Chicken Wings",
    price: 130,
    image: "/fried-chicken.png",
    description: "Spicy chicken wings (6 pieces)",
    ingredients: ["Chicken Wings", "Spicy Sauce", "Celery", "Ranch Dip"],
  },
]

export default function FastFoodPage() {
  return (
    <div className="min-h-screen">
      <ServiceHero
        title="Fast Food"
        description="Quick and delicious fast food options for when you're in a hurry"
        backgroundImage="/fast-food-detail.jpg"
      />
      <ServiceProducts products={fastFoodProducts} category="fast-food" />
    </div>
  )
}
