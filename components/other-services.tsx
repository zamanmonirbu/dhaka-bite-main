"use client"

import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useGetOtherServicesQuery } from "@/store/api/otherServiceApi"

export default function OtherServices() {
  const router = useRouter()

const {
  data,
  isLoading,
  isError,
  error,
} = useGetOtherServicesQuery()

const categories = data?.data || []


  return (
    <section className="py-12 md:py-20 bg-gradient-to-br from-green-50 to-white">
      <div className="container-custom">
        <h2 className="text-2xl md:text-4xl font-bold mb-4 text-gray-900 text-center">Other Services</h2>
        <p className="text-base md:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed text-center mb-12">
          At Dhaka Bite, we offer more than regular lunch and dinner.
          <br />
          From prebooking special meals to fast food, snacks and value combos — our extra services are designed to
          complement your every need.
        </p>

        {isLoading ? (
          <p className="text-center text-gray-600">Loading services...</p>
        ) : isError ? (
          <p className="text-center text-red-500">Failed to load services.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* ✅ Hardcoded Prebooking Card */}
            <div
              className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer transform transition-transform hover:scale-105 border border-gray-100"
              onClick={() => router.push("/prebooking")}
            >
              <div className="relative h-48 w-full overflow-hidden">
                <Image src="/catering.png" alt="Prebooking" fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                  <h3 className="text-xl font-bold text-white p-4">Prebooking</h3>
                </div>
              </div>
              <div className="p-4">
                <p className="text-gray-600 text-sm mb-4">
                  Pre-order your meals for special events or future dates
                </p>
                <Link
                  href="/prebooking"
                  className="bg-gradient-to-r from-primary to-green-600 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-primary transition-all duration-300 inline-block w-full text-center font-semibold"
                >
                  View Prebooking
                </Link>
              </div>
            </div>

            {/* ✅ Dynamic cards from backend */}
            {categories.map((category) => (
              <div
                key={category.packageName}
                className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer transform transition-transform hover:scale-105 border border-gray-100"
                onClick={() =>
                  router.push(`/services/${category.packageName.toLowerCase().replace(/\s+/g, "-")}`)
                }
              >
                <div className="relative h-48 w-full overflow-hidden">
                  <Image src={category.image} alt={category.packageName} fill className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                    <h3 className="text-xl font-bold text-white p-4">{category.packageName}</h3>
                  </div>
                </div>

                <div className="p-4">
                  <p className="text-gray-600 text-sm mb-4">
                    {category.description.length > 60
                      ? `${category.description.slice(0, 60)}...`
                      : category.description}
                  </p>
                  <Link
                    href={`/services/${category.packageName.toLowerCase().replace(/\s+/g, "-")}`}
                    className="bg-gradient-to-r from-primary to-green-600 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-primary transition-all duration-300 inline-block w-full text-center font-semibold"
                  >
                    View {category.packageName}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
