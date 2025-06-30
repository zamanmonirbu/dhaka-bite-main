import type { Metadata } from "next"
import Image from "next/image"
import VerifyOtpForm from "@/components/verify-otp-form"
import VerifyEmailOtp from "@/components/verify-email-otp"

export const metadata: Metadata = {
  title: "Verify OTP | Dhaka Bite",
  description: "Verify your one-time password to continue",
}

interface Props {
  params: {
    email: string
  }
}

export default function VerifyOtpPage({ params }: Props) {
  const { email } = params

  return (
    <main className="min-h-screen flex">
      {/* Left side image */}
      <div className="hidden md:block md:w-1/2 relative">
        <Image
          src="/bengali-food-curry.jpg"
          alt="Traditional Bengali curry dishes"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Right side OTP form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 bg-gray-50">
        <div className="w-full max-w-md">
          <VerifyEmailOtp email={decodeURIComponent(email)} />
        </div>
      </div>
    </main>
  )
}
