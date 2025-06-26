import { baseApi } from "./baseApi"

export interface OtherService {
  packageName: string
  image: string
  description: string
  createdAt: Date
  updatedAt: Date
}

export const otherServiceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOtherServices: builder.query<OtherService[], void>({
      query: () => "/other-package",
    }),
  }),
  overrideExisting: false,
})

export const { useGetOtherServicesQuery } = otherServiceApi
