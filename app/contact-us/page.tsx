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
        details="We’re here to help! Whether you have questions about our services, need support, or just want to share your feedback, feel free to reach out to us. Our team is ready to assist you."
      />
      <ContactForm />
      
    </main>
  )
}
