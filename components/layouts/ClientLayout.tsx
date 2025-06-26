"use client"

import { usePathname } from "next/navigation"
import NotificationBar from "@/components/notification-bar"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import OtherServices from "@/components/other-services"
import Testimonials from "@/components/testimonials"
import DeliveryArea from "@/components/delivery-area"
import { Toaster } from "@/components/ui/toaster"

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isDashboard = pathname.startsWith("/dashboard")

  return (
    <>
      {!isDashboard && <NotificationBar />}
      {!isDashboard && <Navbar />}
      <main>{children}</main>
      <Toaster />
      {!isDashboard && <OtherServices />}
      {!isDashboard && <Testimonials />}
      {!isDashboard && <DeliveryArea />}
      {!isDashboard && <Footer />}
    </>
  )
}
