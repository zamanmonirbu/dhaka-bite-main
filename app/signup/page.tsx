import SignUpForm from "@/components/sign-up-form"
import type { Metadata } from "next"
import Image from "next/image"

export const metadata: Metadata = {
  title: "Sign Up | Dhaka Bite",
  description: "Create an account to order delicious meals from Dhaka Bite",
}

export default function SignUpPage() {
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
           <div className="w-full ">
             <SignUpForm />
           </div>
         </div>
       </main>
  )
}
