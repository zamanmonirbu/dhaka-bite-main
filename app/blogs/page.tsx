import BlogsHero from "@/components/blogs-hero"
import BlogPosts from "@/components/blog-posts"
import OtherServices from "@/components/other-services"
import Testimonials from "@/components/testimonials"
import DeliveryArea from "@/components/delivery-area"
import type { Metadata } from "next"
import Footer from "@/components/footer"
import HeroSection from "@/components/HeroSection"

export const metadata: Metadata = {
  title: "Blogs | Dhaka Bite",
  description: "Read our latest blogs about food, nutrition, and healthy eating habits.",
}

export default function BlogsPage() {
  return (
    <main>
      <HeroSection
        title="Blogs"
        description="Read our latest blogs about food, nutrition, and healthy eating habits."
        details="Explore our blogs for insights on food, nutrition, and healthy eating habits. Stay informed with Dhaka Bite."
      />
      <BlogPosts />
     
    </main>
  )
}
