import type { Metadata } from "next"
import VerifyOtpForm from "@/components/verify-otp-form"
import Image from "next/image"

export const metadata: Metadata = {
  title: "Verify OTP | Dhaka Bite",
  description: "Verify your one-time password to continue",
}

export default function VerifyOtpPage() {
  return (
    <main className="min-h-screen flex">
      {/* Food Background Image - Left Side */}
      <div className="hidden md:block md:w-1/2 relative">
        <Image
          src="https://res.cloudinary.com/dv4ouaclr/image/upload/v1751196385/hero-images/healthy-food.jpg"
          alt="Traditional Bengali curry dishes"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* OTP Verification Form - Right Side */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 bg-gray-50">
        <div className="w-full max-w-md">
          <VerifyOtpForm />
        </div>
      </div>
    </main>
  )
}
