import { baseApi } from "./baseApi"

export interface Testimonial {
  _id: string
  userId: {
    _id: string
    name: string
    profileImage: string
  }
  review: string
  rating: number
}

export const testimonialsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTestimonials: builder.query<Testimonial[], void>({
      query: () => "/review-rating/latest-accepted",
      transformResponse: (response: any) => response.data,
    }),
    createTestimonial: builder.mutation<void, Partial<Testimonial>>({
      query: (testimonial) => ({
        url: "/review-rating",
        method: "POST",
        body: testimonial,
      }),
    }),
  }),
})

export const { useGetTestimonialsQuery, useCreateTestimonialMutation } = testimonialsApi

