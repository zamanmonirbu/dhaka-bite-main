"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"
import { useGetTestimonialsQuery, useCreateTestimonialMutation } from "@/store/api/testimonialApi"
import { useAuth } from "@/hooks/useAuth"
import { useToast } from "@/hooks/use-toast"

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
  const { data, isLoading, refetch } = useGetTestimonialsQuery()

const testimonials: Testimonial[] = data || []

// console.log("testimonials", testimonials)


  const [createTestimonial] = useCreateTestimonialMutation()
  const { user, isAuthenticated } = useAuth()

  // console.log(user, isAuthenticated)

  const { toast } = useToast()



  const [activeIndex, setActiveIndex] = useState(0)
  const [rating, setRating] = useState(0)
  const [review, setReview] = useState("")
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!isLoading && testimonials?.length) {
      setActiveIndex(0)
    }
  }, [isLoading, testimonials])

  const nextSlide = () => {
    setActiveIndex((current) => (current === (testimonials?.length ?? 0) - 1 ? 0 : current + 1))
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

  const handleSubmit = async () => {
    if (!review || rating === 0) return toast({ title: "Please provide rating and review." })

    try {
      setSubmitting(true)
      await createTestimonial({ rating, review, userId: user?._id }).unwrap()
      toast({ title: "Thank you!", description: "Your review has been submitted." })
      setRating(0)
      setReview("")
      refetch()
    } catch (err) {
      toast({ title: "Error", description: "Could not submit review." })
    } finally {
      setSubmitting(false)
    }
  }

  if (isLoading) return <p className="text-center py-10">Loading testimonials...</p>
  // if (!testimonials?.length) return <p className="text-center py-10">No testimonials found.</p>

  return (
    <section className="py-16 bg-[#f2e2b7]">
      <div className="container-custom">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h2 className="text-lg font-medium text-primary mb-2">Testimonial</h2>
            <h3 className="text-3xl font-bold">
              {testimonials.length} Customers <br />
              Gave Their Feedback
            </h3>
          </div>

          <div className="flex items-center mt-4 md:mt-0">
            <button onClick={prevSlide} className="w-8 h-8 border border-gray-300 rounded-sm mr-2 hover:bg-primary hover:text-white">
              <ChevronLeft size={18} />
            </button>
            <button onClick={nextSlide} className="w-8 h-8 bg-primary text-white rounded-sm hover:bg-primary/90">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Testimonials */}
        <div className="overflow-x-auto scrollbar-none">
          <div className="flex flex-nowrap gap-6">
            {visibleTestimonials().filter((t): t is Testimonial => !!t).map((t) => (
              <div key={t._id} className="p-6 rounded-lg shadow-sm bg-white">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                    <Image src={t.userId.profileImage || "/placeholder.svg"} alt={t.userId.name} width={40} height={40} />
                  </div>
                  <div>
                    <h4 className="font-semibold">{t.userId.name}</h4>
                    <p className="text-sm text-gray-600">Customer</p>
                  </div>
                </div>
                <div className="flex mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className={i < t.rating ? "text-yellow-400" : "text-gray-300"} />
                  ))}
                </div>
                <p className="text-gray-700">{t.review}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Slide dots */}
        <div className="flex justify-center mt-6">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 mx-1 rounded-full ${index === activeIndex ? "bg-primary" : "bg-gray-300"}`}
            />
          ))}
        </div>

        {/* Review Submission */}
        {isAuthenticated && (
          <div className="mt-12 bg-white p-6 rounded-lg shadow-sm max-w-2xl mx-auto">
            <h4 className="text-xl font-semibold mb-4 text-center">Leave a Review</h4>

            <div className="flex justify-center mb-4">
              {[1, 2, 3, 4, 5].map((num) => (
                <button key={num} type="button" onClick={() => setRating(num)}>
                  <Star size={28} className={`transition ${rating >= num ? "text-yellow-400" : "text-gray-300"}`} />
                </button>
              ))}
            </div>

            <textarea
              className="w-full border border-gray-300 rounded-md p-3 mb-4"
              rows={4}
              placeholder="Write your feedback..."
              value={review}
              onChange={(e) => setReview(e.target.value)}
            />

            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full bg-primary text-white py-2 rounded-md hover:bg-primary/90 transition"
            >
              {submitting ? "Submitting..." : "Submit Review"}
            </button>
          </div>
        )}

        {!isAuthenticated && (
          <div className="mt-10 text-center text-gray-700 italic">
            Please log in to leave a review.
          </div>
        )}
      </div>
    </section>
  )
}

