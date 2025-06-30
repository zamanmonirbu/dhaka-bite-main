import type { Metadata } from "next"
import ForgotPasswordForm from "@/components/forgot-password-form"
import Image from "next/image"

export const metadata: Metadata = {
  title: "Forgot Password | Dhaka Bite",
  description: "Reset your Dhaka Bite account password",
}

export default function ForgotPasswordPage() {
  return (
    <main className="min-h-screen flex">
      {/* Food Background Image - Left Side */}
      <div className="hidden md:block md:w-1/2 relative">
        <Image
          src="https://res.cloudinary.com/dv4ouaclr/image/upload/v1751196385/hero-images/healthy-food.jpg"
          alt="Traditional Bengali food with vada and chutneys"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Forgot Password Form - Right Side */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 bg-gray-50">
        <div className="w-full max-w-md">
          <ForgotPasswordForm />
        </div>
      </div>
    </main>
  )
}
