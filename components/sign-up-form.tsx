"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Eye, EyeOff } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { useRegisterMutation } from "@/store/api/authApi"
import { useGetDeliveryAreasQuery } from "@/store/api/deliveryApi"

export default function SignUpForm() {
  const router = useRouter()
  const { toast } = useToast()
  const { data } = useGetDeliveryAreasQuery()
  const areas = data?.data || []

  const [register] = useRegisterMutation()

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    area: "",
    address: "",
    referenceCode: "",
    phone: "",
    password: "",
    confirmPassword: ""
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [termsAccepted, setTermsAccepted] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match. Please try again.",
        variant: "destructive",
      })
      return
    }

    if (!termsAccepted) {
      toast({
        title: "Terms Not Accepted",
        description: "You must accept the terms and conditions.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Remove confirmPassword from the data sent to backend
      const { confirmPassword, ...registrationData } = formData
      
      const result = await register(registrationData).unwrap()
      
      if (!result?.data?.email && !result?.email) {
        throw new Error("Failed to register")
      }

      toast({
        title: "Success",
        description: result.message || "Account created successfully! Please check your email for verification.",
      })

      // Store email in sessionStorage for OTP verification
      // This is more secure than URL params
      sessionStorage.setItem('verificationEmail', formData.email)
      
      // Navigate to verification page without email in URL
      router.push('/verify-email')
    } catch (error: any) {
      console.error('Registration error:', error)
      toast({
        title: "Error",
        description:
          error?.data?.message || error?.message || "Something went wrong during registration.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-sm max-w-xl mx-auto">
      <div className="text-center mb-6">
        <p className="text-gray-500">Welcome to DhakaBite</p>
        <h1 className="text-3xl font-bold mt-2">Create an Account</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <InputField label="Name" name="name" value={formData.name} onChange={handleChange} required />
        <InputField label="Email" name="email" type="email" value={formData.email} onChange={handleChange} required />
        <InputField label="Phone" name="phone" value={formData.phone} onChange={handleChange} required />
        <InputField label="Address" name="address" value={formData.address} onChange={handleChange} required />
        <InputField label="Reference Code" name="referenceCode" value={formData.referenceCode} onChange={handleChange} />

        {/* Area dropdown */}
        <div>
          <label htmlFor="area" className="block font-medium text-gray-700 mb-1">
            Delivery Area <span className="text-red-500">*</span>
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
            {areas.map((a: any) => (
              <option key={a._id} value={a._id}>{a.areaName}</option>
            ))}
          </select>
        </div>

        {/* Password */}
        <PasswordField
          label="Password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          show={showPassword}
          toggleShow={() => setShowPassword(!showPassword)}
        />

        {/* Confirm Password */}
        <PasswordField
          label="Confirm Password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          show={showConfirmPassword}
          toggleShow={() => setShowConfirmPassword(!showConfirmPassword)}
        />

        {/* Terms checkbox */}
        <div className="flex items-start gap-2 mt-4">
          <input
            type="checkbox"
            checked={termsAccepted}
            onChange={() => setTermsAccepted(!termsAccepted)}
            className="mt-1 h-4 w-4 accent-primary"
          />
          <p className="text-sm text-gray-700">
            I agree to the{" "}
            <Link href="/terms" className="text-primary hover:underline">
              terms & conditions
            </Link>
          </p>
        </div>

        {/* Submit button */}
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

function InputField({ label, name, value, onChange, type = "text", required = false }: any) {
  return (
    <div>
      <label htmlFor={name} className="block text-gray-700 font-medium mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={`Enter your ${label.toLowerCase()}...`}
        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
      />
    </div>
  )
}

function PasswordField({ label, name, value, onChange, show, toggleShow }: any) {
  return (
    <div>
      <label htmlFor={name} className="block text-gray-700 font-medium mb-1">
        {label} <span className="text-red-500">*</span>
      </label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          required
          placeholder={`Enter ${label.toLowerCase()}...`}
          className="w-full px-4 py-3 border border-gray-300 rounded-md pr-10 focus:outline-none focus:ring-1 focus:ring-primary"
        />
        <button
          type="button"
          onClick={toggleShow}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
        >
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  )
}