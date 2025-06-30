import type { Metadata } from "next"
import LoginForm from "@/components/login-form"
import Image from "next/image"

export const metadata: Metadata = {
  title: "Login | Dhaka Bite",
  description: "Log in to your Dhaka Bite account to order delicious meals",
}

export default function LoginPage() {
  return (
    <main className="min-h-screen flex">
      {/* Food Background Image - Left Side */}
      <div className="hidden md:block md:w-1/2 relative">
        <Image
          src="https://res.cloudinary.com/dv4ouaclr/image/upload/v1751196385/hero-images/healthy-food.jpg"
          alt="Traditional Bengali food platter"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Login Form - Right Side */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 bg-gray-50">
        <div className="w-full max-w-md">
          <LoginForm />
        </div>
      </div>
    </main>
  )
}
