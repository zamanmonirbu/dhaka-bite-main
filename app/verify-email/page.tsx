import Image from "next/image"
import VerifyEmailOtp from "@/components/verify-email-otp"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Verify Email | Dhaka Bite",
  description: "Verify your email address to complete registration",
}

export default function VerifyEmailPage() {
  return (
    <main className="min-h-screen flex">
      <div className="hidden md:block md:w-1/2 relative">
        <Image
          src="https://res.cloudinary.com/dv4ouaclr/image/upload/v1751196385/hero-images/healthy-food.jpg"
          alt="Traditional Bengali curry dishes"
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="w-full md:w-1/2 flex items-center justify-center p-6 bg-gray-50">
        <div className="w-full max-w-md">
          <VerifyEmailOtp />
        </div>
      </div>
    </main>
  )
}