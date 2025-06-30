import { baseApi } from "./baseApi"

export interface SimpleSubscription {
  _id: string
  userId: string
  subcriptionName: string
  subcriptionPrice: number
  subciptionType: "subcription" | "recharge"
  method: "bkash" | "nagad" | "rocket" | "card"
  createdAt: string
  updatedAt: string
}

export interface SubscriptionResponse {
  success: boolean
  message: string
  data: {
    subcriptions: SimpleSubscription[]
    recharges: SimpleSubscription[]
  }
}

export interface CreateSimpleSubscriptionRequest {
  userId: string
  subcriptionName: string
  subcriptionPrice: number
  subciptionType: "subcription" | "recharge"
  method: "bkash" | "nagad" | "rocket" | "card"
}

export const subscriptionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ Create a new subscription/recharge
    createSubscription: builder.mutation<{ success: boolean; data: SimpleSubscription }, CreateSimpleSubscriptionRequest>({
      query: (payload) => ({
        url: "/subcription",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Subscription"],
    }),

    // ✅ Get all subscriptions and recharges
    getSubscriptions: builder.query<SubscriptionResponse, void>({
      query: () => "/subcription",
      providesTags: ["Subscription"],
    }),

    // ✅ Get a single subscription/recharge
    getSubscription: builder.query<{ success: boolean; data: SimpleSubscription }, string>({
      query: (id) => `/subcription/${id}`,
      providesTags: ["Subscription"],
    }),

    // ✅ Update a subscription/recharge
    updateSubscription: builder.mutation<{ success: boolean; data: SimpleSubscription }, { id: string; payload: Partial<CreateSimpleSubscriptionRequest> }>({
      query: ({ id, payload }) => ({
        url: `/subcription/${id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["Subscription"],
    }),

    // ✅ Delete a subscription/recharge
    deleteSubscription: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({
        url: `/subcription/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Subscription"],
    }),
  }),
})

export const {
  useCreateSubscriptionMutation,
  useGetSubscriptionsQuery,
  useGetSubscriptionQuery,
  useUpdateSubscriptionMutation,
  useDeleteSubscriptionMutation,
} = subscriptionApi
