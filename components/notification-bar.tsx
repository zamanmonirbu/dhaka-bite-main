"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Search } from "lucide-react"
import Link from "next/link"

// Sample notifications - in a real app, these would come from your API
const notifications = [
  {
    id: 1,
    text: "Refer and win 1 month free delivery service",
    link: "/company-policy",
    linkText: "(Company Policy)",
  },
  {
    id: 2,
    text: "New Premium Menu available for this week!",
    link: "/premium-menu",
    linkText: "(View Details)",
  },
  {
    id: 3,
    text: "Special discount on Standard Menu this weekend",
    link: "/promotions",
    linkText: "(Check Now)",
  },
]

export default function NotificationBar() {
  const [currentNotification, setCurrentNotification] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const notificationRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const interval = setInterval(() => {
      // Start the animation
      setIsAnimating(true)

      // After animation completes, change the notification
      setTimeout(() => {
        setCurrentNotification((prev) => (prev + 1) % notifications.length)
        setIsAnimating(false)
      }, 500) // This should match the CSS transition duration
    }, 3000) // Change every 3 seconds

    return () => clearInterval(interval)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // Navigate to search results or handle search logic
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`
    }
  }

  return (
    <div className="bg-primary text-white py-3 overflow-hidden">
      <div className="container-custom">
        {/* Desktop Layout - Side by Side */}
        <div className="hidden md:flex">
          {/* Left 50% - Sliding Notifications */}
          <div className="w-1/2 relative h-6 overflow-hidden">
            <div
              ref={notificationRef}
              className={`absolute w-full transition-transform duration-500 ease-in-out ${
                isAnimating ? "-translate-x-full" : "translate-x-0"
              }`}
            >
              <div className="whitespace-nowrap">
                {notifications[currentNotification].text}{" "}
                <Link href={notifications[currentNotification].link} className="text-secondary hover:underline">
                  {notifications[currentNotification].linkText}
                </Link>
              </div>
            </div>

            {/* Next notification (slides in from right) */}
            <div
              className={`absolute w-full transition-transform duration-500 ease-in-out ${
                isAnimating ? "translate-x-0" : "translate-x-full"
              }`}
            >
              <div className="whitespace-nowrap">
                {notifications[(currentNotification + 1) % notifications.length].text}{" "}
                <Link
                  href={notifications[(currentNotification + 1) % notifications.length].link}
                  className="text-secondary hover:underline"
                >
                  {notifications[(currentNotification + 1) % notifications.length].linkText}
                </Link>
              </div>
            </div>
          </div>

          {/* Right 50% - Full Width Search Input */}
          <div className="w-1/2 flex justify-end">
            <form onSubmit={handleSearch} className="relative w-full max-w-lg">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search services & products..."
                className="bg-white/10 border border-white/20 rounded-full px-4 py-1.5 pr-10 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent w-full text-sm"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white transition-colors"
              >
                <Search size={16} />
              </button>
            </form>
          </div>
        </div>

        {/* Mobile Layout - Two Rows */}
        <div className="md:hidden space-y-2">
          {/* First Row - Notifications */}
          <div className="relative h-6 overflow-hidden">
            <div
              className={`absolute w-full transition-transform duration-500 ease-in-out ${
                isAnimating ? "-translate-x-full" : "translate-x-0"
              }`}
            >
              <div className="whitespace-nowrap text-center text-sm">
                {notifications[currentNotification].text}{" "}
                <Link href={notifications[currentNotification].link} className="text-secondary hover:underline">
                  {notifications[currentNotification].linkText}
                </Link>
              </div>
            </div>

            {/* Next notification (slides in from right) */}
            <div
              className={`absolute w-full transition-transform duration-500 ease-in-out ${
                isAnimating ? "translate-x-0" : "translate-x-full"
              }`}
            >
              <div className="whitespace-nowrap text-center text-sm">
                {notifications[(currentNotification + 1) % notifications.length].text}{" "}
                <Link
                  href={notifications[(currentNotification + 1) % notifications.length].link}
                  className="text-secondary hover:underline"
                >
                  {notifications[(currentNotification + 1) % notifications.length].linkText}
                </Link>
              </div>
            </div>
          </div>

          {/* Second Row - Search Input */}
          <div className="flex justify-center">
            <form onSubmit={handleSearch} className="relative w-full max-w-sm">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search services & products..."
                className="bg-white/10 border border-white/20 rounded-full px-4 py-1.5 pr-10 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent w-full text-sm"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white transition-colors"
              >
                <Search size={16} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
