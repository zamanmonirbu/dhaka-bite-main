"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { User } from "@/store/api/authApi"
import { useCreatePaymentMutation } from "@/store/api/mPaymentApi"


interface AddBalanceModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (amount: number) => void,
    user: User | null
}

export default function AddBalanceModal({ isOpen, onClose, onSuccess,user }: AddBalanceModalProps) {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    amount: "",
    lastFourDigits: "",
    reference: "",
    mobileNumber: "",
    payType: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [createPayment, { isLoading }] = useCreatePaymentMutation()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setIsSubmitting(true)

  try {
    const response = await createPayment({
      userId: user?.id,
      amount: Number(formData.amount),
      lastFourDigits: formData.lastFourDigits,
      reference: formData.reference,
      mobileNumber: formData.mobileNumber,
      payType: formData.payType
    }).unwrap() // <-- Ensures you can catch specific errors

    toast({
      title: "✅ Payment Request Created",
      description: `Your request for ৳${formData.amount} has been submitted successfully.`,
    })

    onSuccess(Number(formData.amount))
    onClose()
  } catch (error: any) {
    toast({
      title: "❌ Error Submitting Payment",
      description:
        error?.data?.message || "Failed to submit payment request. Please try again.",
      variant: "destructive",
    })
  } finally {
    setIsSubmitting(false)
  }
}

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Balance via bKash</DialogTitle>
          {/* <DialogDescription>
            Send money to our bKash merchant number and fill the details below.
          </DialogDescription> */}
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-yellow-50 p-4 rounded-md mb-4">
            <p className="font-medium text-center">Bkash personal acccount: <span className="text-green-600">01860106511</span></p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Payment Method</label>
            <select
              name="payType"
              value={formData.payType}
              onChange={handleChange}
              className="block w-full border border-gray-300 rounded-md p-2"
              required
            >
              <option value="">Select payment method</option>
              <option value="subscription">Subscription</option>
              <option value="recharge">
                Recharge
              </option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Amount (৳)</label>
            <Input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="Enter amount"
              required
              min="10"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Last 4 Digits of Transaction Id</label>
            <Input
              type="text"
              name="lastFourDigits"
              value={formData.lastFourDigits}
              onChange={handleChange}
              placeholder="Last 4 digits"
              required
              maxLength={4}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Reference (Provided in bKash)</label>
            <Input
              type="text"
              name="reference"
              value={formData.reference}
              onChange={handleChange}
              placeholder="Reference number"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Your Mobile Number</label>
            <Input
              type="tel"
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleChange}
              placeholder="01XXXXXXXXX"
              required
            />
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || isSubmitting} className="text-white">
              {isLoading || isSubmitting ? "Submitting..." : "Submit Payment"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

