import MenuHero from "@/components/menu-hero"
import MenuStory from "@/components/menu-story"
import AllPackageFoods from "@/components/all-package-foods"
import OtherServices from "@/components/other-services"
import Testimonials from "@/components/testimonials"
import DeliveryArea from "@/components/delivery-area"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "All Package Foods | Dhaka Bite",
  description: "Explore all our package food options with lunch and dinner meals.",
}

export default function AllPackageFoodsPage() {
  return (
    <main>
      <MenuHero
        type="All Package Foods"
        description="Discover our complete range of package meals featuring both lunch and dinner options for every day of the week."
      />
      <MenuStory />
      <AllPackageFoods />
      {/* <OtherServices />
      <Testimonials />
      <DeliveryArea /> */}
    </main>
  )
}
