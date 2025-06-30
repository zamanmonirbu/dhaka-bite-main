"use client"

import { useState } from "react"
import { Receipt, Truck, ChefHat } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import AddBalanceModal from "@/components/AddBalanceModal"
import { useAuth } from "@/hooks/useAuth"


export default function DeliveryChargeOptions() {
  const { toast } = useToast()
  const { user } = useAuth() // get logged in user

  const [modalOpen, setModalOpen] = useState(false)
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null)

  const options = [
    {
      id: "basic",
      name: "Basic Package",
      price: 400,
      icon: <Receipt className="h-8 w-8 text-primary" />,
      iconBgColor: "bg-green-200",
      buttonBgColor: "bg-green-200 hover:bg-green-300 text-primary",
    },
    {
      id: "standard",
      name: "Standard Package",
      price: 450,
      icon: <Truck className="h-8 w-8 text-white" />,
      iconBgColor: "bg-primary",
      buttonBgColor: "bg-primary hover:bg-primary/90 text-white",
    },
    {
      id: "premium",
      name: "Premium Package",
      price: 500,
      icon: <ChefHat className="h-8 w-8 text-primary" />,
      iconBgColor: "bg-green-200",
      buttonBgColor: "bg-green-200 hover:bg-green-300 text-primary",
    },
  ]

  const handleSubscribe = (price: number) => {
    setSelectedAmount(price)
    setModalOpen(true)
  }

  return (
    <section className="py-16 ">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Delivery Charge Options</h2>
          <p className="max-w-2xl mx-auto text-gray-700">
            Monthly delivery charges for your meal plan.
            <br />
            Payment via bKash, Nagad & Credit Card.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {options.map((option) => (
            <div key={option.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6 text-center">
                <div className={`w-20 h-20 ${option.iconBgColor} rounded-full mx-auto flex items-center justify-center mb-4`}>
                  {option.icon}
                </div>
                <h3 className="text-xl font-bold text-primary mb-2">{option.name}</h3>
                <div className="flex items-baseline justify-center">
                  <p className="text-gray-500 text-lg mr-2">Delivery Charge</p>
                  <span className="text-3xl font-bold">{option.price}</span>
                  <span className="text-gray-500 ml-1">/ Month</span>
                </div>
              </div>

              <div className="border-t border-gray-200"></div>

              <div className="p-6 pt-0">
                <button
                  onClick={() => handleSubscribe(option.price)}
                  className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${option.buttonBgColor}`}
                >
                  Pay Delivery Charge
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedAmount !== null && (
        <AddBalanceModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          user={user}
          onSuccess={() => {
            toast({
              title: "Payment Successful",
              description: `Your payment of ৳${selectedAmount} has been recorded.`,
            })
          }}
        />
      )}
    </section>
  )
}
