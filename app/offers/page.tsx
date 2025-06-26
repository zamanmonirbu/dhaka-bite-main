import OffersGrid from "@/components/offers-grid"
import OtherServices from "@/components/other-services"
import Testimonials from "@/components/testimonials"
import DeliveryArea from "@/components/delivery-area"
import Footer from "@/components/footer"
import HeroSection from "@/components/HeroSection"

export default function OffersPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <HeroSection
        title="Offers"
        description="Discover amazing discounts on your favorite meals. Limited time offers that bring you the best value for delicious, home-style cooking."
        backgroundImage="/offers-hero-bg.jpg"
      />
      <OffersGrid />
      {/* <OtherServices />
      <Testimonials />
      <DeliveryArea />
      <Footer /> */}
    </div>
  )
}
