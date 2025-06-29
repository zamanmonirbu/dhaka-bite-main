import { baseApi } from "./baseApi";

export const locationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getLocation: builder.query<{ success: boolean; data: Location }, void>({
      query: () => "/delivery-area",
      providesTags: ["Location"],
    }),

    updateLocation: builder.mutation<{ success: boolean; message: string }, { id: string; data: Partial<Location> }>({
      query: ({ id, data }) => ({
        url: `/delivery-area/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Location"],
    }),

    deleteLocation: builder.mutation<{ success: boolean; message: string }, { id: string }>({
      query: ({ id }) => ({
        url: `/delivery-area/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Location"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetLocationQuery,
  useUpdateLocationMutation,
  useDeleteLocationMutation,
} = locationApi;

