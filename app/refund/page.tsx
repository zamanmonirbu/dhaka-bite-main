import OffersGrid from "@/components/offers-grid"
import OtherServices from "@/components/other-services"
import Testimonials from "@/components/testimonials"
import DeliveryArea from "@/components/delivery-area"
import Footer from "@/components/footer"
import HeroSection from "@/components/HeroSection"
import { Refund } from "@/components/refund-grid"

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <HeroSection
        title="Refund Policy"
        description="Learn about our refund policy and how to request a refund."
        backgroundImage="/refund-hero-bg.jpg"
      />
     
      <Refund />
      {/* <OtherServices />
      <Testimonials />
      <DeliveryArea />
      <Footer /> */}
    </div>
  )
}
