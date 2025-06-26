import CheckoutForm from "@/components/checkout-form"
import OtherServices from "@/components/other-services"
import Testimonials from "@/components/testimonials"
import DeliveryArea from "@/components/delivery-area"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Checkout | Dhaka Bite",
  description: "Complete your order and provide delivery details",
}

export default function CheckoutPage() {
  return (
    <main>
      <div className="py-12 bg-white">
        <div className="container-custom">
          <h1 className="text-3xl font-bold mb-8">Checkout</h1>
          <CheckoutForm />
        </div>
      </div>
      {/* <OtherServices />
      <Testimonials />
      <DeliveryArea /> */}
    </main>
  )
}
