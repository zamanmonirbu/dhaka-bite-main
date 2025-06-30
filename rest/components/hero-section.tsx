"use client"

import Link from "next/link"
import Image from "next/image"
import { Facebook, Instagram, Phone, } from "lucide-react"
import { SiTiktok, SiWhatsapp } from "react-icons/si"
import { useEffect, useState } from "react"
import { useGetHeroImagesQuery } from "@/store/api/heroImageApi"
import { useGetPackagesQuery } from "@/store/api/packageApi"


export default function HeroSection() {
  const [showCopiedMessage, setShowCopiedMessage] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const phoneNumber = "01400650261"

  const { data: packagesData, isLoading: packagesLoading } = useGetPackagesQuery()
  const packages = packagesData?.data || [];

  console.log(packages)

  const { data: heroImageData, isLoading: heroImagesLoading } = useGetHeroImagesQuery()
  const carouselImages = heroImageData?.data || []

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

  if (packagesLoading || heroImagesLoading) {
    return <p className="text-center text-white text-xl mt-10">Loading hero images and packages...</p>
  }

  return (
    <section className="w-full ">
      <div className="flex flex-col sm:flex-row gap-5 items-stretch justify-between mx-auto relative">

        {/* Carousel Section */}
        <div className="w-full sm:w-2/3 rounded-xl overflow-hidden relative aspect-[5/2] bg-white">
          {/* Image Carousel */}
          {carouselImages.map((image, index) => (
            <div
              key={image._id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                index === currentImageIndex ? "opacity-100" : "opacity-0"
              }`}
            >
              <Image
                src={image.image || "/placeholder.svg"}
                alt={image.title || `Hero image ${index + 1}`}
                layout="fill"
                objectFit="contain"
                className="rounded-xl"
                priority={index === 0}
              />
            </div>
          ))}

          {/* Fixed Social Media Icons */}
          <div className="absolute bottom-3 left-3 z-30 flex gap-2 sm:gap-3">
           <Link
              href="https://www.facebook.com/share/1BBhiDmhEj/"
              className="bg-primary p-2 rounded-md hover:bg-green-600 shadow-md transition"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Facebook size={20} className="text-white" />
            </Link>
            <Link
              href="https://www.instagram.com/dhakabite?igsh=MXNpNzN3ejJwZzExdw=="
              className="bg-primary p-2 rounded-md hover:bg-green-600 shadow-md transition"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Instagram size={20} className="text-white" />
            </Link>
            <Link
              href="https://www.tiktok.com/@dhaka_bite?_t=ZS-8wsWsjYPj8i&_r=1"
              className="bg-primary p-2 rounded-md hover:bg-green-600 shadow-md transition"
              target="_blank"
              rel="noopener noreferrer"
            >
              <SiTiktok size={20} className="text-white" />
            </Link>
            <Link
              href="https://wa.me/01400650261"
              className="bg-primary p-2 rounded-md hover:bg-green-600 shadow-md transition"
              target="_blank"
              rel="noopener noreferrer"
            >
              <SiWhatsapp size={20} className="text-white" />
            </Link>
          </div>

          {/* Dots Indicator */}
          <div className="absolute bottom-2 right-3 sm:right-6 flex space-x-2 z-20">
            {carouselImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all border-2 ${
                  index === currentImageIndex
                    ? "bg-secondary border-secondary"
                    : "bg-white/30 border-white/50 hover:bg-white/50"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Buttons and Icons Section */}
        <div className="w-full sm:w-1/3 flex flex-col gap-4 rounded-xl p-4">
          {/* Order / Contact Buttons */}
          <div className="flex flex-col gap-3">
            <div className="flex gap-2 w-full">
              <Link
                href="/all-package/foods"
                className="btn-primary text-sm px-4 py-2 w-1/2 text-center"
              >
                Order Now
              </Link>
              <button
                onClick={handleContactClick}
                className="btn-primary text-sm px-4 py-2 w-1/2 text-center relative"
              >
                <Phone size={16} className="mr-2 inline-block" />
                Contact
                {showCopiedMessage && (
                  <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-2 py-1 rounded-md text-xs whitespace-nowrap z-10">
                    Phone number copied!
                  </div>
                )}
              </button>
            </div>
          </div>

          {/* Subscribe Button */}
          <div>
            <Link href="/subscription">
              <button className="border w-full border-primary text-primary px-4 py-2 rounded-md font-semibold text-sm hover:bg-primary hover:text-white transition-colors">
                Subscribe Now
              </button>
            </Link>
          </div>

         <div className="grid grid-cols-3 gap-3">
  {packages.map((packageItem) => (
    <Link key={packageItem._id} href={`/package/${packageItem._id}`}>
      <div className="flex flex-col gap-2 p-4 rounded-md shadow-md hover:shadow-lg transition">
        <Image
          src={packageItem.image}
          alt={packageItem.packageName}
          width={15}
          height={15}
          className="w-full sm:h-16 md:h-20 lg:h-24 xl:h-32 h-16 object-cover rounded-full"
        />
        <h4 className="text-lg font-semibold">{packageItem.packageName}</h4>
        <p className="text-sm">{packageItem.description}</p>
      </div>
    </Link>
  ))}
</div>

        </div>
      </div>
    </section>
  )
}

