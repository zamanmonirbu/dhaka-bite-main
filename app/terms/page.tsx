import DeliveryArea from "@/components/delivery-area"
import Footer from "@/components/footer"
import HeroSection from "@/components/HeroSection"
import OtherServices from "@/components/other-services"
import TermsContent from "@/components/terms-content"
import Testimonials from "@/components/testimonials"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms & Conditions | Dhaka Bite",
  description: "Terms and conditions for using Dhaka Bite's food ordering and delivery services.",
}

export default function TermsPage() {
  return (
    <main>
      {/* Move Hero OUTSIDE container to go full width */}
      <HeroSection
        title="Terms & Conditions"
        description="Review the terms and conditions before using DhakaBite’s food delivery service."
        backgroundImage="/blogs-hero-bg.jpg"
      />

      <TermsContent />
      {/* <OtherServices />
      <Testimonials />
      <DeliveryArea />
      <Footer /> */}
    </main>
  )
}
