import MenuHero from "@/components/menu-hero"
import MenuStory from "@/components/menu-story"
import MenuItems from "@/components/menu-items"
import OtherServices from "@/components/other-services"
import Testimonials from "@/components/testimonials"
import DeliveryArea from "@/components/delivery-area"
import type { Metadata } from "next"

interface MenuPageProps {
  params: {
    type: string
  }
}

export async function generateMetadata({ params }: MenuPageProps): Promise<Metadata> {
  const formattedType = formatMenuType(params.type)

  return {
    title: `${formattedType} Menu | Dhaka Bite`,
    description: `Explore our delicious ${formattedType.toLowerCase()} menu options at Dhaka Bite.`,
  }
}

// Helper function to format menu type
function formatMenuType(type: string): string {
  // Convert 'basic', 'standard', 'premium' to 'Basic', 'Standard', 'Premium'
  return type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()
}

export default function MenuPage({ params }: MenuPageProps) {
  const menuType = formatMenuType(params.type)

  // Menu descriptions based on type
  const menuDescriptions = {
    Basic:
      "Our Basic Menu offers affordable, nutritious meals perfect for everyday dining. Each meal is freshly prepared with quality ingredients.",
    Standard:
      "The Standard Menu provides a perfect balance of taste and nutrition with premium ingredients and larger portions for a satisfying meal experience.",
    Premium:
      "Experience luxury dining at home with our Premium Menu featuring gourmet dishes, premium cuts, and chef-crafted recipes for special occasions.",
  }

  // Get the appropriate description based on menu type
  const description = menuDescriptions[menuType as keyof typeof menuDescriptions] || menuDescriptions.Basic

  return (
    <main>
      <MenuHero type={menuType} description={description} />
      <MenuStory />
      <MenuItems type={menuType} />
      {/* <OtherServices />
      <Testimonials />
      <DeliveryArea /> */}
    </main>
  )
}
