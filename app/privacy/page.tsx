import NotificationBar from "@/components/notification-bar"
import Navbar from "@/components/navbar"
import PrivacyContent from "@/components/privacy-content"
import Footer from "@/components/footer"
import type { Metadata } from "next"
import DeliveryArea from "@/components/delivery-area"
import Testimonials from "@/components/testimonials"
import OtherServices from "@/components/other-services"
import HeroSection from "@/components/HeroSection"

export const metadata: Metadata = {
  title: "Privacy Policy | Dhaka Bite",
  description: "Privacy policy for Dhaka Bite's food ordering and delivery services.",
}

export default function PrivacyPage() {
  return (
    <main>

       <div className="min-h-screen ">
            <HeroSection
              title="Privacy Policy"
              description="Your privacy is important to us. Learn how we handle your personal information."
            details=""
            />
            <PrivacyContent />
          </div>
   
    </main>
  )
}
