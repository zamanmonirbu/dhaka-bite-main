import ContactHero from "@/components/contact-hero"
import ContactForm from "@/components/contact-form"
import type { Metadata } from "next"
import OtherServices from "@/components/other-services"
import Testimonials from "@/components/testimonials"
import DeliveryArea from "@/components/delivery-area"
import Footer from "@/components/footer"
import HeroSection from "@/components/HeroSection"

export const metadata: Metadata = {
  title: "Contact Us | Dhaka Bite",
  description: "Get in touch with Dhaka Bite for any questions, feedback, or support.",
}

export default function ContactPage() {
  return (
    <main>
      <HeroSection
        title="Contact Us"
        description="Get in touch with Dhaka Bite for any questions, feedback, or support."
        backgroundImage="/contact-hero-bg.jpg"
      />
      <ContactForm />
      {/* <OtherServices />
      <Testimonials />
      <DeliveryArea />
      <Footer /> */}
    </main>
  )
}
