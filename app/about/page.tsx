import HeroSection from "@/components/HeroSection"
import OtherServices from "@/components/other-services"
import Testimonials from "@/components/testimonials"
import DeliveryArea from "@/components/delivery-area"
import Footer from "@/components/footer"
import AboutContent from "@/components/about-page"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "About | Dhaka Bite",
  description: "Learn more about Dhaka Bite, our mission, and our story.",
}

export default function AboutPage() {
  return (
    <main>
      <HeroSection
        title="About"
        description="Learn more about Dhaka Bite, our mission, and our story."
        backgroundImage="/about-hero-bg.jpg"
      />
      <AboutContent />
      {/* <OtherServices />
      <Testimonials />
      <DeliveryArea />
      <Footer /> */}
    </main>
  )
}
