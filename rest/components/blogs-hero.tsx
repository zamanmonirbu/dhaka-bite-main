import Link from "next/link"
import Image from "next/image"
import { Phone, Facebook, Instagram, Music } from "lucide-react"

export default function BlogsHero() {
  return (
    <section className="relative py-16 md:py-24">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image src="/blogs-hero-bg.jpg" alt="Blogs Background" fill className="object-cover" priority />
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      </div>

      <div className="container-custom relative z-10">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold text-secondary mb-6">Blogs</h1>

          <p className="text-white mb-8">
            Lorem ipsum dolor sit amet consectetur. Congue tristique euismod ornare nulla. In et dui ullamcorper gravida
            dolor sodales non.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <Link
              href="/order"
              className="bg-primary text-white px-6 py-3 rounded-md hover:bg-opacity-90 transition-colors inline-block text-center"
            >
              Order Now
            </Link>
            <Link
              href="/contact"
              className="bg-white text-primary border border-primary px-6 py-3 rounded-md hover:bg-primary hover:text-white transition-colors inline-flex items-center justify-center gap-2"
            >
              <Phone size={18} />
              <span>Contact Now</span>
            </Link>
          </div>

          <div className="flex gap-4">
            <Link
              href="https://facebook.com"
              className="bg-primary text-white p-2 rounded-md hover:bg-opacity-90 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Facebook size={20} />
            </Link>
            <Link
              href="https://instagram.com"
              className="bg-primary text-white p-2 rounded-md hover:bg-opacity-90 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Instagram size={20} />
            </Link>
            <Link
              href="https://tiktok.com"
              className="bg-primary text-white p-2 rounded-md hover:bg-opacity-90 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Music size={20} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
