"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useGetTestimonialsQuery } from "@/store/api/testimonialApi"

interface Testimonial {
  _id: string
  userId: {
    _id: string
    name: string
    profileImage: string
  }
  review: string
  rating: number
}

export default function Testimonials() {
  const { data: testimonials, isLoading } = useGetTestimonialsQuery()
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    if (!isLoading && testimonials?.length) {
      setActiveIndex(0)
    }
  }, [isLoading, testimonials])

  const nextSlide = () => {
    setActiveIndex((current) => (current === ((testimonials?.length ?? 0) - 1) ? 0 : current + 1))
  }

  const prevSlide = () => {
    setActiveIndex((current) => (current === 0 ? (testimonials?.length ?? 0) - 1 : current - 1))
  }

  const goToSlide = (index: number) => {
    setActiveIndex(index)
  }

const visibleTestimonials = () => {
    const result = []
    const testimonialsLength = testimonials?.length ?? 0
    for (let i = 0; i < 3 && i < testimonialsLength; i++) {
      const index = (activeIndex + i) % testimonialsLength
      result.push(testimonials?.[index])
    }
    return result
  }

  if (isLoading) {
    return <p className="text-center py-10">Loading testimonials...</p>
  }

  if (!testimonials?.length) {
    return <p className="text-center py-10">No testimonials found.</p>
  }

  return (
    <section className="py-16 bg-[#f2e2b7]">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h2 className="text-lg font-medium text-primary mb-2">Testimonial</h2>
            <h3 className="text-3xl font-bold">
              {testimonials?.length} Customers <br />
              Gave Their Feedback
            </h3>
          </div>

          <div className="flex items-center mt-4 md:mt-0">
            <button
              onClick={prevSlide}
              className="w-8 h-8 border border-gray-300 rounded-sm flex items-center justify-center mr-2 hover:bg-primary hover:text-white transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={nextSlide}
              className="w-8 h-8 bg-primary text-white rounded-sm flex items-center justify-center hover:bg-primary/90 transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {visibleTestimonials().filter((testimonial): testimonial is Testimonial => !!testimonial).map((testimonial) => (
            <div key={testimonial._id} className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                  <Image
                    src={testimonial?.userId?.profileImage || "/placeholder.svg"}
                    alt={testimonial?.userId?.name || "User"}
                    width={40}
                    height={40}
                  />
                </div>
                <div>
                  <h4 className="font-semibold">{testimonial?.userId?.name || "Unknown User"}</h4>
                  <p className="text-sm text-gray-600">Customer</p>
                </div>
              </div>

              <div className="flex mb-3">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-4 h-4 ${i < testimonial.rating ? "text-yellow-400" : "text-gray-300"}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              <p className="text-gray-700">{testimonial.review}</p>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-6">
          {testimonials?.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 mx-1 rounded-full ${
                index === activeIndex ? "bg-primary" : "bg-gray-300"
              } transition-colors`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

