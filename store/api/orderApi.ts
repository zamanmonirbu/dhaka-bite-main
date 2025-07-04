import { baseApi } from "./baseApi"
import type { CartItem } from "./cartApi"

export interface DeliveryAddress {
  street: string
  area: string
  city: string
  zipCode: string
  phone: string
}

export interface Order {
  _id: string
  userId: string
  orderNumber: string
  items: CartItem[]
  totalAmount: number
  deliveryAddress: DeliveryAddress
  paymentMethod: "card" | "cash" | "wallet"
  paymentStatus: "pending" | "paid" | "failed"
  orderStatus: "pending" | "confirmed" | "preparing" | "delivered" | "cancelled"
  deliveryDate: string
  deliveryTime: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface CreateOrderRequest {
  items: CartItem[]
  deliveryAddress: DeliveryAddress
  paymentMethod: "card" | "cash" | "wallet"
  deliveryDate: string
  deliveryTime: string
  notes?: string
}

export interface OrderFilters {
  status?: string
  page?: number
  limit?: number
  startDate?: string
  endDate?: string
}

export const orderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Create order from cart
    createOrder: builder.mutation<{ status: boolean; data: Order }, CreateOrderRequest>({
      query: (orderData) => ({
        url: "/orders",
        method: "POST",
        body: orderData,
      }),
    }),

    // Get user's orders
    getOrders: builder.query<{ status: boolean; data: Order[]; pagination: any }, OrderFilters>({
      query: (filters = {}) => {
        const params = new URLSearchParams()
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined) {
            params.append(key, value.toString())
          }
        })
        return `/orders?${params.toString()}`
      },
      providesTags: ["Order"],
    }),

    // Get single order
    getOrder: builder.query<{ status: boolean; data: Order }, string>({
      query: (id) => `/orders/${id}`,
      providesTags: ["Order"],
    }),

    // Cancel order
    cancelOrder: builder.mutation<{ status: boolean; data: Order }, string>({
      query: (id) => ({
        url: `/orders/${id}/cancel`,
        method: "PUT",
      }),
      invalidatesTags: ["Order"],
    }),

    // Track order
    trackOrder: builder.query<{ status: boolean; data: any }, string>({
      query: (orderNumber) => `/orders/track/${orderNumber}`,
      providesTags: ["Order"],
    }),

    // Get order history
    getOrderHistory: builder.query<{ status: boolean; data: Order[] }, void>({
      query: () => "/orders/history",
      providesTags: ["Order"],
    }),

    // Reorder (create new order from previous order)
    reorder: builder.mutation<{ status: boolean; data: Order }, string>({
      query: (orderId) => ({
        url: `/orders/${orderId}/reorder`,
        method: "POST",
      }),
      invalidatesTags: ["Order", "Cart"],
    }),
  }),
})

export const {
  useCreateOrderMutation,
  useGetOrdersQuery,
  useGetOrderQuery,
  useCancelOrderMutation,
  useTrackOrderQuery,
  useGetOrderHistoryQuery,
  useReorderMutation,
} = orderApi
