// store/api/paymentApi.ts
// import { baseApi } from "./baseApi"

import { baseApi } from "./baseApi"



export const paymentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBalance: builder.query<{ balance: number }, void>({
      query: () => ({
        url: "/payment/balance",
        method: "GET",
      }),
    }),
  }),
  overrideExisting: true, // ✅ Add this line
})

export const { useLazyGetBalanceQuery } = paymentApi
