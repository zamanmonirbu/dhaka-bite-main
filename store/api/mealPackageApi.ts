// src/redux/apis/mealPackageApi.ts
import { baseApi } from "./baseApi"

export interface MealPackage {
  _id: string
  packageName: string
  image: string
  actualPrice: number
  discountedPrice: number
  savings?: number
  save?: number
}

export const mealPackageApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllMealPackages: builder.query<{ status: boolean; data: MealPackage[] }, void>({
      query: () => "/meal-package",
      providesTags: ["MealPackage"],
    }),
  }),
  overrideExisting: false,
})

export const { useGetAllMealPackagesQuery } = mealPackageApi
