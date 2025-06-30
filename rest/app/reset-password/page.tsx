import type { Metadata } from "next"
import ResetPasswordForm from "@/components/reset-password-form"
import Image from "next/image"

export const metadata: Metadata = {
  title: "Reset Password | Dhaka Bite",
  description: "Create a new password for your Dhaka Bite account",
}

export default function ResetPasswordPage() {
  return (
    <main className="min-h-screen flex">
      {/* Food Background Image - Left Side */}
      <div className="hidden md:block md:w-1/2 relative">
        <Image
          src="/bengali-fish-dish.jpg"
          alt="Bengali fish dish with vegetables"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Reset Password Form - Right Side */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 bg-gray-50">
        <div className="w-full max-w-md">
          <ResetPasswordForm />
        </div>
      </div>
    </main>
  )
}
