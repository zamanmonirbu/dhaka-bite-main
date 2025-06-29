import { baseApi } from "./baseApi"

export interface Payment {
  amount: number;
  lastFourDigits: string;
  reference: string;
  mobileNumber: string;
  userId: string;
  paymentMethod: 'bKash' | 'Nagad' | 'Rocket' | 'Card';
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
}


export const paymentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPayments: builder.query<{ success: boolean; data: Payment[] }, void>({
      query: () => "/payment",
      providesTags: ["MenualPayment"],
    }),
    createPayment: builder.mutation<{ success: boolean; data: Payment }, Partial<Payment>>({
      query: (payment) => ({
        url: "/payment",
        method: "POST",
        body: payment,
      }),
      invalidatesTags: ["MenualPayment"],
    }),
  }),
})


export const {
  useGetPaymentsQuery,
  useCreatePaymentMutation,
} = paymentApi
