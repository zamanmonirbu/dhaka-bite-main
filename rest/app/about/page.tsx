import HeroSection from "@/components/HeroSection"
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
        backgroundImage="https://res.cloudinary.com/dv4ouaclr/image/upload/fl_preserve_transparency/v1751178245/Goals_objectives_zqpudo.jpg?_s=public-apps"
        details="DhakaBite launched on 1st July 2025, is a solo-owned food delivery brand aimed at making meals affordable and hygienic. We operate with a homemade-style kitchen, just like meals served by a loving mother.
      Our mission is to deliver clean, safe, and high-quality food to bachelors, office workers, and small events across Dhaka.
      By eliminating extra operational costs and profit-sharing, we’re able to offer nutritious meals at just 66 BDT per meal."
      />
    </main>
  )
}
