"use client"
import Link from "next/link"

export default function MenuPackages() {
  return (
    <div className="text-center rounded-2xl p-6 md:p-8 shadow-lg border border-gray-100">
      <h3 className="text-xl md:text-2xl font-bold mb-3 text-gray-900">
        Can't Decide? Try Our Mixed Package!
      </h3>
      <p className="text-sm text-gray-600 mb-6 max-w-2xl mx-auto">
        Get the best of all worlds with our weekly mixed package.
      </p>
      <div className="flex flex-row gap-2 justify-center flex-wrap">
        <Link href="/all-package/foods">
          <button className="bg-primary text-white px-4 py-2 rounded-md font-semibold text-sm hover:bg-primary/90 transition-colors">
            View All Packages
          </button>
        </Link>
        <Link href="/subscription">
          <button className="border border-primary text-primary px-4 py-2 rounded-md font-semibold text-sm hover:bg-primary hover:text-white transition-colors">
            Subscribe Now
          </button>
        </Link>
      </div>
    </div>
  )
}
