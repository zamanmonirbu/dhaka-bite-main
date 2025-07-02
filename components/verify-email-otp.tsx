"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { useVerifyEmailMutation } from "@/store/api/authApi"

export default function VerifyEmailOtp() {
  const router = useRouter()
  const { toast } = useToast()
  const [verifyEmail] = useVerifyEmailMutation()
  
  const [email, setEmail] = useState<string>("")
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [resendDisabled, setResendDisabled] = useState(false)
  const [countdown, setCountdown] = useState(0)

  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    // Get email from sessionStorage
    const storedEmail = sessionStorage.getItem('verificationEmail')
    if (storedEmail) {
      setEmail(storedEmail)
    } else {
      // If no email found, redirect to signup
      toast({
        title: "Session Expired",
        description: "Please sign up again.",
        variant: "destructive",
      })
      router.push('/signup')
    }
    
    setOtp(["", "", "", "", "", ""])
  }, [router, toast])

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else if (countdown === 0 && resendDisabled) {
      setResendDisabled(false)
    }
  }, [countdown, resendDisabled])

  const handleChange = (index: number, value: string) => {
    if (value && !/^\d+$/.test(value)) return
    const newOtp = [...otp]
    newOtp[index] = value.slice(-1)
    setOtp(newOtp)
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text/plain").trim()
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split("")
      setOtp(digits)
      inputRefs.current[5]?.focus()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (otp.some((digit) => digit === "")) {
      toast({
        title: "Incomplete OTP",
        description: "Please enter all 6 digits of the OTP.",
        variant: "destructive",
      })
      return
    }

    if (!email) {
      toast({
        title: "Error",
        description: "Email not found. Please sign up again.",
        variant: "destructive",
      })
      router.push('/signup')
      return
    }

    setIsSubmitting(true)

    try {
      const result = await verifyEmail({
        otp: otp.join(""),
        email: email,
      }).unwrap()

      toast({
        title: "Email Verified",
        description: result.message || "Email verified successfully!",
      })

      // Clear stored email
      sessionStorage.removeItem('verificationEmail')
      
      router.push("/login")
    } catch (error: any) {
      console.error('Verification error:', error)
      toast({
        title: "Verification Failed",
        description: error?.data?.message || error?.message || "Invalid OTP. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleResendOtp = async () => {
    if (!email) {
      toast({
        title: "Error",
        description: "Email not found. Please sign up again.",
        variant: "destructive",
      })
      router.push('/signup')
      return
    }

    setResendDisabled(true)
    setCountdown(60) // 1 minute countdown

    try {
      // You might need to create a resend OTP mutation in your authApi
      // const result = await resendOtp({ email }).unwrap()
      
      // For now, using a simple success message
      toast({
        title: "OTP Sent",
        description: "A new OTP has been sent to your email.",
      })
    } catch (error: any) {
      console.error('Resend error:', error)
      toast({
        title: "Error",
        description: error?.data?.message || error?.message || "Failed to resend OTP.",
        variant: "destructive",
      })
      setResendDisabled(false)
      setCountdown(0)
    }
  }

  // Don't render if email is not available
  if (!email) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-sm">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Loading...</h1>
          <p className="text-gray-500 mt-3">Please wait...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-sm">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold">Enter OTP</h1>
        <p className="text-gray-500 mt-3">
          An OTP has been sent to <span className="font-medium text-green-900">{email}</span>.
          <br />
          Please verify it below.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex justify-center gap-2">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={index === 0 ? handlePaste : undefined}
              maxLength={1}
              className="w-12 h-12 text-center text-xl border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
              required
            />
          ))}
        </div>

        <div className="text-center">
          <p className="text-gray-600">
            Didn't Receive OTP?{" "}
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={resendDisabled}
              className={`text-primary font-medium hover:underline ${resendDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              Resend OTP {countdown > 0 && `(${countdown}s)`}
            </button>
          </p>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-primary text-white py-3 rounded-md hover:bg-primary/90 transition-colors disabled:opacity-70"
        >
          {isSubmitting ? "Verifying..." : "Verify"}
        </button>
      </form>

      <div className="text-center mt-6">
        <p className="text-gray-600">
          Back to{" "}
          <Link href="/login" className="text-primary font-medium hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  )
}