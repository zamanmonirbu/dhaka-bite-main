import { baseApi } from "./baseApi"

export interface Payment {
  _id: string
  userId: string
  orderId?: string
  subscriptionId?: string
  amount: number
  method: "card" | "cash" | "wallet"
  status: "pending" | "completed" | "failed" | "refunded"
  transactionId: string
  paymentGateway: string
  metadata: any
  createdAt: string
  updatedAt: string
}

export interface PaymentIntent {
  clientSecret: string
  paymentIntentId: string
  amount: number
}

export interface CreatePaymentIntentRequest {
  amount: number
  currency: string
  orderId?: string
  subscriptionId?: string
  metadata?: any
}

export interface ConfirmPaymentRequest {
  paymentIntentId: string
  paymentMethodId: string
}

export interface RefundRequest {
  paymentId: string
  amount?: number
  reason: string
}

export const paymentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Create payment intent for Stripe
    createPaymentIntent: builder.mutation<{ success: boolean; data: PaymentIntent }, CreatePaymentIntentRequest>({
      query: (paymentData) => ({
        url: "/payments/create-intent",
        method: "POST",
        body: paymentData,
      }),
    }),

    // Confirm payment
    confirmPayment: builder.mutation<{ success: boolean; data: Payment }, ConfirmPaymentRequest>({
      query: (confirmData) => ({
        url: "/payments/confirm",
        method: "POST",
        body: confirmData,
      }),
      invalidatesTags: ["Payment", "Order", "Subscription", "User"],
    }),

    // Get user's payments
    getPayments: builder.query<{ success: boolean; data: Payment[] }, void>({
      query: () => "/payments",
      providesTags: ["Payment"],
    }),

    // Get single payment
    getPayment: builder.query<{ success: boolean; data: Payment }, string>({
      query: (id) => `/payments/${id}`,
      providesTags: ["Payment"],
    }),

    // Process refund (admin only)
    processRefund: builder.mutation<{ success: boolean; data: Payment }, RefundRequest>({
      query: (refundData) => ({
        url: "/payments/refund",
        method: "POST",
        body: refundData,
      }),
      invalidatesTags: ["Payment"],
    }),

    // Get payment methods
    getPaymentMethods: builder.query<{ success: boolean; data: any[] }, void>({
      query: () => "/payments/methods",
      providesTags: ["Payment"],
    }),

    // Add payment method
    addPaymentMethod: builder.mutation<{ success: boolean; data: any }, { paymentMethodId: string }>({
      query: (methodData) => ({
        url: "/payments/methods",
        method: "POST",
        body: methodData,
      }),
      invalidatesTags: ["Payment"],
    }),

    // Remove payment method
    removePaymentMethod: builder.mutation<{ success: boolean; message: string }, string>({
      query: (methodId) => ({
        url: `/payments/methods/${methodId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Payment"],
    }),
  }),
})

export const {
  useCreatePaymentIntentMutation,
  useConfirmPaymentMutation,
  useGetPaymentsQuery,
  useGetPaymentQuery,
  useProcessRefundMutation,
  useGetPaymentMethodsQuery,
  useAddPaymentMethodMutation,
  useRemovePaymentMethodMutation,
} = paymentApi
