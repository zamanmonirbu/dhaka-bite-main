import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../store';

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

export const baseApi = createApi({
  baseQuery,
  endpoints: () => ({}),
  reducerPath: 'baseApi',
  tagTypes: ['Meal', 'MainMeal', 'Subscription', 'HeroImage', 'Location', 'User', 'Cart', 'Order', 'Testimonial', 'OtherService'],
});
