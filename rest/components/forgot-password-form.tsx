"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

export default function ForgotPasswordForm() {
  const { toast } = useToast()
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // In a real app, this would be an API call to your backend
      // await fetch('/api/auth/forgot-password', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email })
      // });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setIsSubmitted(true)
      toast({
        title: "OTP Sent",
        description: "Please check your email for the verification code.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem sending the verification code. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-sm">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold">Forget Password</h1>
        <p className="text-gray-500 mt-3 mx-auto max-w-md">
          Please enter the email address linked to your account. We'll send a one-time password (OTP) to your email for
          verification.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-gray-700 font-medium mb-1">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Enter your mail address..."
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
            disabled={isSubmitted}
          />
        </div>

        {!isSubmitted ? (
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary text-white py-3 rounded-md hover:bg-primary/90 transition-colors disabled:opacity-70"
          >
            {isSubmitting ? "Sending..." : "Send OTP"}
          </button>
        ) : (
          <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6">
            <p className="text-green-800">
              We've sent a verification code to <strong>{email}</strong>. Please check your email and enter the code on
              the next screen.
            </p>
          </div>
        )}
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
