"use client"

import Image from "next/image"
import Link from "next/link"
import { Star } from "lucide-react"
import { useGetAllMealPackagesQuery } from "@/store/api/mealPackageApi"

export default function MenuPackages() {
  const { data, isLoading } = useGetAllMealPackagesQuery()

  const mealPackages = data?.data || []

  return (
    <section className="py-12 md:py-20 bg-gradient-to-br from-green-50 to-white">
      <div className="container-custom">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-2xl md:text-4xl font-bold mb-4 text-gray-900">Choose Your Perfect Menu</h2>
          <p className="text-base md:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover our carefully crafted meal packages designed to satisfy your taste buds and nutritional needs.
          </p>
        </div>

        {isLoading ? (
          <p className="text-center">Loading...</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8 mb-8 md:mb-12">
            {mealPackages.map((menu, index) => (
              <div key={menu._id} className={`relative group cursor-pointer transform transition-all duration-300 hover:scale-105 ${index === 2 ? "col-span-2 md:col-span-1" : ""}`}>
                {/* Savings */}
                <div className="absolute top-3 left-3 z-20">
                  <div className="bg-green-600 text-white px-2 py-1 rounded-md text-xs font-semibold">
                    Save ৳{menu.savings || menu.save || 0}
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 h-full">
                  <div className="relative h-32 md:h-40 bg-cover bg-center">
                    <Image src={menu.image} alt={menu.packageName} fill className="object-cover rounded-t-2xl" />
                  </div>

                  <div className="pt-10 md:pt-12 pb-6 px-4 md:px-6">
                    <h3 className="text-lg md:text-xl font-bold text-center mb-2 text-gray-900">{menu.packageName}</h3>
                    <div className="text-center mb-4">
                      <div className="flex items-center justify-center gap-2 mb-1">
                        <span className="text-2xl md:text-3xl font-bold text-primary">৳{menu.discountedPrice}</span>
                        <span className="text-sm md:text-base text-gray-400 line-through">৳{menu.actualPrice}</span>
                      </div>
                      <p className="text-xs text-gray-500">Per meal</p>
                    </div>

                    <Link href={`/menu/${menu._id}`}>
                      <button className="w-full bg-gradient-to-r from-primary to-green-600 text-white py-3 rounded-lg font-semibold text-sm md:text-base transition-all duration-300 hover:shadow-lg hover:from-green-600 hover:to-primary transform hover:-translate-y-0.5">
                        View Menu
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-100">
          <h3 className="text-xl md:text-2xl font-bold mb-3 text-gray-900">Can't Decide? Try Our Mixed Package!</h3>
          <p className="text-sm md:text-base text-gray-600 mb-6 max-w-2xl mx-auto">
            Get the best of all worlds with our weekly mixed package.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/all-package/foods">
              <button className="bg-primary text-white px-6 md:px-8 py-3 rounded-lg font-semibold text-sm md:text-base hover:bg-primary/90 transition-colors">
                View All Packages
              </button>
            </Link>
            <Link href="/subscription">
              <button className="border-2 border-primary text-primary px-6 md:px-8 py-3 rounded-lg font-semibold text-sm md:text-base hover:bg-primary hover:text-white transition-colors">
                Subscribe Now
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
