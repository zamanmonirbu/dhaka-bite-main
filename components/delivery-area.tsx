"use client"

import dynamic from "next/dynamic"
import { useGetLocationQuery } from "@/store/api/locationApi"
import { MapPin } from "lucide-react"
import ReactDOMServer from "react-dom/server"

// Lazily import MapContainer and related Leaflet stuff with SSR disabled
const MapWithNoSSR = dynamic(() => import("./MapWithNoSSR"), { ssr: false })

export default function DeliveryArea() {
  const { data, isLoading, isError } = useGetLocationQuery()
  const locations = data?.data || []

  return (
    <section className="bg-gradient-to-br from-green-50">
      <div>
        {isLoading && (
          <p className="text-center text-gray-500">Loading delivery area...</p>
        )}

        {isError && (
          <p className="text-center text-red-500">Failed to load delivery area.</p>
        )}

        {!isLoading && locations.length > 0 && (
          <div className="relative w-full h-[500px] rounded-lg overflow-hidden z-0">
            <MapWithNoSSR locations={locations} />
          </div>
        )}
      </div>
    </section>
  )
}
