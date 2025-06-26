import { baseApi } from "./baseApi"

export interface DeliveryArea {
  _id: string
  name: string
  city: string
  zipCodes: string[]
  deliveryFee: number
  estimatedTime: string
  isActive: boolean
  createdAt: string
}

export interface DeliveryAvailability {
  available: boolean
  area?: DeliveryArea
  estimatedTime?: string
  deliveryFee?: number
  message?: string
}

export const deliveryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all delivery areas
    getDeliveryAreas: builder.query<{ success: boolean; data: DeliveryArea[] }, void>({
      query: () => "/delivery/areas",
      providesTags: ["Delivery"],
    }),

    // Check delivery availability
    checkDeliveryAvailability: builder.mutation<
      { success: boolean; data: DeliveryAvailability },
      { address: string; zipCode: string }
    >({
      query: (locationData) => ({
        url: "/delivery/check",
        method: "POST",
        body: locationData,
      }),
    }),

    // Get delivery fee for area
    getDeliveryFee: builder.query<{ success: boolean; data: { fee: number } }, string>({
      query: (areaId) => `/delivery/fee/${areaId}`,
      providesTags: ["Delivery"],
    }),

    // Get delivery time slots
    getDeliveryTimeSlots: builder.query<{ success: boolean; data: string[] }, string>({
      query: (date) => `/delivery/time-slots?date=${date}`,
      providesTags: ["Delivery"],
    }),
  }),
})

export const {
  useGetDeliveryAreasQuery,
  useCheckDeliveryAvailabilityMutation,
  useGetDeliveryFeeQuery,
  useGetDeliveryTimeSlotsQuery,
} = deliveryApi
