"use client"

import type React from "react"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Eye, EyeOff } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { useDispatch } from "react-redux"
import { setCredentials } from "@/store/slices/authSlice"
import { useRegisterMutation } from "@/store/api/authApi"
import { baseApi } from "@/store/api/baseApi"



export default function SignUpForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    area: "",
    address: "",
    referenceCode: "",
    password: "",
    confirmPassword: "",
    phone: "",
  })
  const [areas, setAreas] = useState([])
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [termsAccepted, setTermsAccepted] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const dispatch = useDispatch()
  const [registerMutation] = useRegisterMutation()

  useEffect(() => {
   const fetchAreas = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/delivery-area`)
    const data = await res.json()
    if (data.status) {
      setAreas(data.data)
    }
  } catch (error) {
    console.error("Failed to fetch delivery areas", error)
  }
}


    fetchAreas()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      })
      return
    }

    if (!termsAccepted) {
      toast({
        title: "Terms and Conditions",
        description: "Please accept the terms and conditions to create an account.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const registerData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        phone: formData.phone,
        area: formData.area,
        address: formData.address,
        referenceCode: formData.referenceCode,
      }

      const result = await registerMutation(registerData).unwrap()

      if (!result?.data) throw new Error("Registration failed.")

      toast({
        title: "Success",
        description: result.message || "Account created successfully.",
      })

      router.push(`/verify-mail/${result.data.email}`)
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error?.data?.message ||
          error?.data?.error ||
          error?.message ||
          error?.error ||
          "There was a problem creating your account.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-sm">
      <div className="text-center mb-6">
        <p className="text-gray-500">Welcome to Website</p>
        <h1 className="text-3xl font-bold mt-2">Create an account</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {[
          { id: "name", label: "Name", type: "text", required: true },
          { id: "email", label: "Email", type: "email", required: true },
          { id: "address", label: "Address", type: "text", required: true },
          { id: "referenceCode", label: "Reference Code", type: "text", required: false },
          { id: "phone", label: "Phone", type: "text", required: true },
        ].map((field) => (
          <div key={field.id}>
            <label htmlFor={field.id} className="block text-gray-700 font-medium mb-1">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            <input
              type={field.type}
              id={field.id}
              name={field.id}
              value={(formData as any)[field.id]}
              onChange={handleChange}
              required={field.required}
              placeholder={`Enter your ${field.label.toLowerCase()}...`}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        ))}

        {/* Area dropdown */}
        <div>
          <label htmlFor="area" className="block text-gray-700 font-medium mb-1">
            Want to take food delivery <span className="text-red-500">*</span>
          </label>
          <select
            id="area"
            name="area"
            value={formData.area}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="">Select Area</option>
            {areas.map((area: any, index) => (
              <option key={index} value={area.areaName}>
                {area.areaName}
              </option>
            ))}
          </select>
        </div>

        {/* Password */}
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
              placeholder="Enter password..."
              className="w-full px-4 py-3 border border-gray-300 rounded-md pr-10 focus:outline-none focus:ring-1 focus:ring-primary"
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

        {/* Confirm Password */}
        <div>
          <label htmlFor="confirmPassword" className="block text-gray-700 font-medium mb-1">
            Confirm Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Confirm password..."
              className="w-full px-4 py-3 border border-gray-300 rounded-md pr-10 focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Terms & Conditions */}
        <div className="mt-4">
          <label className="flex items-start gap-2">
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={() => setTermsAccepted(!termsAccepted)}
              className="mt-1 h-4 w-4 accent-primary"
            />
            <span className="text-sm text-gray-700">
              I agree to the{" "}
              <Link href="/terms" className="text-primary hover:underline">
                terms & conditions
              </Link>
            </span>
          </label>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-primary text-white py-3 rounded-md hover:bg-primary/90 transition-colors disabled:opacity-70 mt-6"
        >
          {isSubmitting ? "Creating Account..." : "Create Account"}
        </button>
      </form>

      <div className="text-center mt-6">
        <p className="text-gray-600">
          Already have an account?{" "}
          <Link href="/login" className="text-primary font-medium hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  )
}
