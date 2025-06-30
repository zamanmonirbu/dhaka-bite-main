import OffersGrid from "@/components/offers-grid"
import OtherServices from "@/components/other-services"
import Testimonials from "@/components/testimonials"
import DeliveryArea from "@/components/delivery-area"
import Footer from "@/components/footer"
import HeroSection from "@/components/HeroSection"

export default function OffersPage() {
  return (
    <div className="min-h-screen ">
      <HeroSection
        title="Offers"
        description="Discover amazing discounts on your favorite meals. Limited time offers that bring you the best value for delicious, home-style cooking."
      details="Explore our latest offers and enjoy great savings on your next meal. Don't miss out on these limited-time deals that make dining with us even more delightful."
      />
      <OffersGrid />
      
    </div>
  )
}
