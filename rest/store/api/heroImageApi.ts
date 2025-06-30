// src/redux/api/heroImageApi.ts
import { baseApi } from './baseApi'

interface HeroImage {
  _id: string
  title: string
  image: string
}

export const heroImageApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getHeroImages: builder.query<{ success: boolean; data: HeroImage[] }, void>({
      query: () => '/hero-image',
      providesTags: ['HeroImage'],
    }),
  }),
})

export const { useGetHeroImagesQuery } = heroImageApi
