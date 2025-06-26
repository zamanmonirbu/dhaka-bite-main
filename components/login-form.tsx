"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Eye, EyeOff } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { useDispatch } from "react-redux"
import { setCredentials } from "@/store/slices/authSlice"
import { useLoginMutation } from "@/store/api/authApi"

export default function LoginForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const dispatch = useDispatch()
  const [loginMutation] = useLoginMutation()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const result = await loginMutation(formData).unwrap()

      console.log("Login result:", result)

     dispatch(
  setCredentials({
    user: result.data.user,
    token: result.data.accessToken,
  })
)

      toast({
        title: "Login successful",
        description: result.data.message || "Welcome back to Dhaka Bite!",
      })

      // Redirect to dashboard
      router.push("/dashboard")
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error?.data?.message || "Invalid email or password. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-sm">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold">Welcome Back!</h1>
        <p className="text-gray-500 mt-2">Enter to get unlimited data & information</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-gray-700 font-medium mb-1">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Enter your mail address..."
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-gray-700 font-medium mb-1">
            Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter Password..."
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
              className="h-4 w-4 accent-primary"
            />
            <span className="ml-2 text-gray-700 text-sm">Remember Me</span>
          </label>
          <Link href="/forgot-password" className="text-primary text-sm hover:underline">
            Forgot Password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-primary text-white py-3 rounded-md hover:bg-primary/90 transition-colors disabled:opacity-70"
        >
          {isSubmitting ? "Signing In..." : "Sign In"}
        </button>
      </form>

      <div className="text-center mt-6">
        <p className="text-gray-600">
          Don't have an account?{" "}
          <Link href="/signup" className="text-primary font-medium hover:underline">
            Register Here
          </Link>
        </p>
      </div>
    </div>
  )
}

