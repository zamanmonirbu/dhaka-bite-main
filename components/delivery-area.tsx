"use client"

import Image from "next/image"
import { useGetLocationQuery } from "@/store/api/locationApi"

interface LocationData {
  title: string
  image?: string
}

export default function DeliveryArea() {
  const { data, isLoading, isError } = useGetLocationQuery()
  const location: LocationData | undefined = data?.data

  return (
    <section className="py-16 bg-white">
      <div className="container-custom">
        <h2 className="text-3xl font-bold text-center text-primary mb-6">Delivery Area</h2>

        {isLoading && (
          <p className="text-center text-gray-500">Loading delivery area...</p>
        )}

        {isError && (
          <p className="text-center text-red-500">Failed to load delivery area.</p>
        )}

        {!isLoading && location && (
          <>
            <p className="text-center mb-12 max-w-3xl mx-auto">
              We currently deliver to areas like <strong>{location.title}</strong> and nearby zones in Dhaka city.
            </p>

            {location.image && (
              <div className="relative w-full h-[400px] rounded-lg overflow-hidden">
                <Image
                  src={location.image}
                  alt={`${location.title} Delivery Area`}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}
          </>
        )}
      </div>
    </section>
  )
}

