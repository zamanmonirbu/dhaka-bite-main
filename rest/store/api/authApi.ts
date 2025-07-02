import { baseApi } from "./baseApi"

export interface User {
  _id: string
  name: string
  email: string
  phone?: string
  avatar?: string
  address?: {
    street: string
    area: string
    city: string
    zipCode: string
  }
  balance: number

  subscription?: string
  subscriptionEndDate?: string
  subscriptionStartDate?: string
  subscriptionStatus?: string
  role: string
  isVerified: boolean
  createdAt: string
  updatedAt: string,
  profileImage?: string
  referenceCode?: string
  referredBy?: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
  confirmPassword: string
  phone?: string
  area?: string
  address?: string
  referenceCode?: string
}

export interface LoginResponse {
  success: boolean
  message: string
  data: {
    message: string
    accessToken: string
    user: User
    token: string
  }
}

export interface RegisterResponse {
  success: boolean
  message: string
  data: {
    user: User
    token: string
  }
}

export interface ProfileUpdateRequest {
  name?: string
  phone?: string
  address?: {
    street: string
    area: string
    city: string
    zipCode: string
  }
}

export interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export interface ForgotPasswordRequest {
  email: string
}

export interface ResetPasswordRequest {
  token: string
  password: string
  confirmPassword: string
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Authentication endpoints
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["User"],
    }),

    register: builder.mutation<RegisterResponse, RegisterRequest>({
      query: (userData) => ({
        url: "/auth/register",
        method: "POST",
        body: userData,
      }),
      invalidatesTags: ["User"],
    }),

    logout: builder.mutation<{ success: boolean; message: string }, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      invalidatesTags: ["User", "Cart", "Order", "Subscription"],
    }),



    getProfile: builder.query<{ success: boolean; data: User }, void>({
      query: () => "/auth/profile",
      providesTags: ["User"],
    }),

   
    getUserById: builder.query<{ success: boolean; data: User }, string>({
      query: (id) => `/user/${id}`,
      providesTags: ["User"],
    }),

    updateProfile: builder.mutation<{ success: boolean; data: User }, ProfileUpdateRequest>({
      query: (profileData) => ({
        url: "/auth/profile",
        method: "PUT",
        body: profileData,
      }),
      invalidatesTags: ["User"],
    }),

    changePassword: builder.mutation<{ success: boolean; message: string }, ChangePasswordRequest>({
      query: (passwordData) => ({
        url: "/auth/change-password",
        method: "POST",
        body: passwordData,
      }),
    }),

    forgotPassword: builder.mutation<{ success: boolean; message: string }, ForgotPasswordRequest>({
      query: (emailData) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body: emailData,
      }),
    }),

    resetPassword: builder.mutation<{ success: boolean; message: string }, ResetPasswordRequest>({
      query: (resetData) => ({
        url: "/auth/reset-password",
        method: "POST",
        body: resetData,
      }),
    }),

    verifyEmail: builder.mutation<{ success: boolean; message: string }, { otp: string; email: string }>({
      query: (verificationData) => ({
        url: '/auth/verify-email',
        method: 'POST',
        body: verificationData,
      }),
      invalidatesTags: ['User'],
    }),
    // Balance management
    addBalance: builder.mutation<{ success: boolean; data: User }, { amount: number; paymentMethod: string }>({
      query: (balanceData) => ({
        url: "/auth/add-balance",
        method: "POST",
        body: balanceData,
      }),
      invalidatesTags: ["User"],
    }),
  }),
})

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useGetProfileQuery,
  useGetUserByIdQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useVerifyEmailMutation,
  useAddBalanceMutation,
} = authApi
