import OffersGrid from "@/components/offers-grid"
import OtherServices from "@/components/other-services"
import Testimonials from "@/components/testimonials"
import DeliveryArea from "@/components/delivery-area"
import Footer from "@/components/footer"
import HeroSection from "@/components/HeroSection"
import { Refund } from "@/components/refund-grid"

export default function RefundPage() {
  return (
    <div className="min-h-screen">
      <HeroSection
        title="Refund Policy"
        description="Learn about our refund policy and how to request a refund."
        details="At Dhaka Bite, we strive to ensure customer satisfaction. If you are not satisfied with your order, please read our refund policy to understand how to request a refund."
      />
     
      <Refund />

    </div>
  )
}
