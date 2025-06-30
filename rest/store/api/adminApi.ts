import { baseApi } from "./baseApi"
import type { User } from "./authApi"
import type { Order } from "./orderApi"
import type { Subscription } from "./subscriptionApi"

export interface DashboardStats {
  totalUsers: number
  totalOrders: number
  totalRevenue: number
  activeSubscriptions: number
  todayOrders: number
  pendingOrders: number
  recentOrders: Order[]
  recentUsers: User[]
}

export interface Analytics {
  revenue: {
    daily: number[]
    monthly: number[]
    yearly: number[]
  }
  orders: {
    total: number
    completed: number
    cancelled: number
    pending: number
  }
  users: {
    total: number
    active: number
    new: number
  }
  popularMeals: Array<{
    mealId: string
    name: string
    orderCount: number
  }>
}

export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Dashboard statistics
    getDashboardStats: builder.query<{ success: boolean; data: DashboardStats }, void>({
      query: () => "/admin/dashboard",
      providesTags: ["Admin"],
    }),

    // Get all users (admin only)
    getAllUsers: builder.query<
      { success: boolean; data: User[]; pagination: any },
      { page?: number; limit?: number; search?: string }
    >({
      query: (params = {}) => {
        const searchParams = new URLSearchParams()
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined) {
            searchParams.append(key, value.toString())
          }
        })
        return `/admin/users?${searchParams.toString()}`
      },
      providesTags: ["Admin", "User"],
    }),

    // Get all orders (admin only)
    getAllOrders: builder.query<
      { success: boolean; data: Order[]; pagination: any },
      { page?: number; limit?: number; status?: string }
    >({
      query: (params = {}) => {
        const searchParams = new URLSearchParams()
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined) {
            searchParams.append(key, value.toString())
          }
        })
        return `/admin/orders?${searchParams.toString()}`
      },
      providesTags: ["Admin", "Order"],
    }),

    // Get all subscriptions (admin only)
    getAllSubscriptions: builder.query<
      { success: boolean; data: Subscription[]; pagination: any },
      { page?: number; limit?: number }
    >({
      query: (params = {}) => {
        const searchParams = new URLSearchParams()
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined) {
            searchParams.append(key, value.toString())
          }
        })
        return `/admin/subscriptions?${searchParams.toString()}`
      },
      providesTags: ["Admin", "Subscription"],
    }),

    // Update user status
    updateUserStatus: builder.mutation<{ success: boolean; data: User }, { userId: string; status: string }>({
      query: ({ userId, status }) => ({
        url: `/admin/users/${userId}/status`,
        method: "PUT",
        body: { status },
      }),
      invalidatesTags: ["Admin", "User"],
    }),

    // Update order status
    updateOrderStatus: builder.mutation<{ success: boolean; data: Order }, { orderId: string; status: string }>({
      query: ({ orderId, status }) => ({
        url: `/admin/orders/${orderId}/status`,
        method: "PUT",
        body: { status },
      }),
      invalidatesTags: ["Admin", "Order"],
    }),

    // Get analytics data
    getAnalytics: builder.query<{ success: boolean; data: Analytics }, { period?: string }>({
      query: (params = {}) => {
        const searchParams = new URLSearchParams()
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined) {
            searchParams.append(key, value.toString())
          }
        })
        return `/admin/analytics?${searchParams.toString()}`
      },
      providesTags: ["Admin"],
    }),
  }),
})

export const {
  useGetDashboardStatsQuery,
  useGetAllUsersQuery,
  useGetAllOrdersQuery,
  useGetAllSubscriptionsQuery,
  useUpdateUserStatusMutation,
  useUpdateOrderStatusMutation,
  useGetAnalyticsQuery,
} = adminApi
