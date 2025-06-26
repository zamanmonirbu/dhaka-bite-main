"use client"

import Link from "next/link"
import { Facebook, Instagram, Phone, ChevronLeft, ChevronRight } from "lucide-react"
import { SiTiktok } from "react-icons/si"
import { useEffect, useState } from "react"
import { useGetHeroImagesQuery } from "@/store/api/heroImageApi"

export default function HeroSection() {
  const [showCopiedMessage, setShowCopiedMessage] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const phoneNumber = "01400650261"

  const { data, isLoading } = useGetHeroImagesQuery()
  const carouselImages = data?.data || []

  useEffect(() => {
    if (!carouselImages.length) return
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === carouselImages.length - 1 ? 0 : prevIndex + 1
      )
    }, 4000)
    return () => clearInterval(interval)
  }, [carouselImages.length])

  const handleContactClick = async () => {
    try {
      await navigator.clipboard.writeText(phoneNumber)
      setShowCopiedMessage(true)
      setTimeout(() => setShowCopiedMessage(false), 3000)
      window.location.href = `tel:${phoneNumber}`
    } catch (err) {
      console.error("Failed to copy phone number:", err)
      window.location.href = `tel:${phoneNumber}`
    }
  }

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === carouselImages.length - 1 ? 0 : prevIndex + 1
    )
  }

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? carouselImages.length - 1 : prevIndex - 1
    )
  }

  if (isLoading) {
    return <p className="text-center text-white text-xl mt-10">Loading hero images...</p>
  }

  return (
    <section className="relative w-full h-screen overflow-hidden">
      {/* Background Carousel Images */}
      <div className="absolute inset-0 w-full h-full">
        {carouselImages.map((image, index) => (
          <div
            key={image._id}
            className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
              index === currentImageIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={image.image || "/placeholder.svg"}
              alt={image.title || `Hero image ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Content */}
      <div className="relative z-30 h-full flex items-center justify-start">
        <div className="container-custom">
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Healthy, affordable meals that taste like home — only at{" "}
              <span className="text-secondary">Dhaka Bite.</span>
            </h1>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link href="/all-package/foods" className="btn-primary text-lg px-8 py-4">
                Order Now
              </Link>
              <button
                onClick={handleContactClick}
                className="bg-white/10 backdrop-blur-sm text-white border border-white/30 font-medium py-4 px-8 rounded-md hover:bg-white/20 transition-all flex items-center justify-center gap-2 relative text-lg"
              >
                <Phone size={20} />
                <span>Contact Now</span>
                {showCopiedMessage && (
                  <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-3 py-1 rounded-md text-sm whitespace-nowrap z-10">
                    Phone number copied!
                  </div>
                )}
              </button>
            </div>

            <div className="flex gap-4">
              <Link
                href="https://www.facebook.com/share/1BBhiDmhEj/"
                className="bg-white/10 backdrop-blur-sm text-white p-3 rounded-md hover:bg-white/20 transition-colors border border-white/30"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Facebook size={24} />
              </Link>
              <Link
                href="https://www.instagram.com/dhakabite?igsh=MXNpNzN3ejJwZzExdw=="
                className="bg-white/10 backdrop-blur-sm text-white p-3 rounded-md hover:bg-white/20 transition-colors border border-white/30"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram size={24} />
              </Link>
              <Link
                href="https://www.tiktok.com/@dhaka_bite?_t=ZS-8wsWsjYPj8i&_r=1"
                className="bg-white/10 backdrop-blur-sm text-white p-3 rounded-md hover:bg-white/20 transition-colors border border-white/30"
                target="_blank"
                rel="noopener noreferrer"
              >
                <SiTiktok size={24} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevImage}
        className="hidden sm:flex absolute left-6 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-colors z-20 border border-white/30"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={nextImage}
        className="hidden sm:flex absolute right-6 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-colors z-20 border border-white/30"
      >
        <ChevronRight size={24} />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
        {carouselImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImageIndex(index)}
            className={`w-4 h-4 rounded-full transition-all border-2 ${
              index === currentImageIndex
                ? "bg-secondary border-secondary"
                : "bg-white/30 border-white/50 hover:bg-white/50"
            }`}
          />
        ))}
      </div>
    </section>
  )
}
