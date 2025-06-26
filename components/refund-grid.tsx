import { cn } from "@/lib/utils"

export function Refund() {
  return (
    <div className={cn("bg-background rounded-lg p-6")}>
      <h2 className="text-xl font-semibold mb-3">Refund Policy</h2>
      <p className="mb-3">
        If you are unhappy with your order, please contact us within 12 of
        delivery to initiate a refund.
      </p>
      <p className="mb-3">
        Refunds are subject to the policies of the restaurant and our platform.
      </p>
      <p>
        In the case of incorrect or unsatisfactory food, please contact customer
        support within [X hours].
      </p>
    </div>
  )
}
