"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import axios from "../store/api/axiosClient"

interface Props {
  email: string
}

export default function VerifyEmailOtp({ email }: Props) {
  const router = useRouter()
  const { toast } = useToast()
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [resendDisabled, setResendDisabled] = useState(false)
  const [countdown, setCountdown] = useState(0)

  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    setOtp(["", "", "", "", "", ""])
  }, [])

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

    setIsSubmitting(true)

    try {
      const res = await axios.post("/auth/verify-email", {
        otp: otp.join(""),
        email,
      })

      const { status, message } = res.data

      toast({
        title: status ? "Email Verified" : "Verification Failed",
        description: message || "Something went wrong.",
        variant: status ? "default" : "destructive",
      })

      if (status) router.push("/login")
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Something went wrong.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleResendOtp = async () => {
    setResendDisabled(true)
    setCountdown(600)

    try {
      const res = await axios.post("/auth/resend-verify-email", { email })

      const { status, message } = res.data

      toast({
        title: status ? "OTP Sent" : "Failed",
        description: message || "Something went wrong.",
        variant: status ? "default" : "destructive",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Something went wrong.",
        variant: "destructive",
      })
      setResendDisabled(false)
      setCountdown(0)
    }
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
