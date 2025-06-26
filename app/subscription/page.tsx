import type { Metadata } from "next"
import HeroSection from "@/components/HeroSection"
import SubscriptionPlans from "@/components/subscription-plans"

export const metadata: Metadata = {
  title: "Subscription Plans | Dhaka Bite",
  description: "Choose from our range of subscription plans for regular meal delivery.",
}

export default function SubscriptionPage() {
  return (
    <main>
      <HeroSection
        title="Subscription Plans"
        description="Choose from our range of subscription plans for regular meal delivery."
        backgroundImage="/subscription-hero-bg.jpg"
      />
      <SubscriptionPlans />
    </main>
  )
}
