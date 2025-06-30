import { baseApi } from "./baseApi";


interface IMealPackage extends Document {
  packageName: string;
  image: string;
  actualPrice: number;
  discountedPrice: number;
  savings: number;
  createdAt: string;
  updatedAt: string;
}


export const packageApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPackages: builder.query<IMealPackage[], void>({
      query: () => "/meal-package",
      providesTags: ["Package"],
    }),
    createPackage: builder.mutation<any, Partial<IMealPackage>>({
      query: (newPackage) => ({
        url: "/meal-package",
        method: "POST",
        body: newPackage,
      }),
      invalidatesTags: ["Package"],
    }),
    updatePackage: builder.mutation<any, { id: string; data: Partial<IMealPackage> }>({
      query: ({ id, data }) => ({
        url: `/meal-package/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Package"],
    }),
    deletePackage: builder.mutation<any, string>({
      query: (id) => ({
        url: `/meal-package/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Package"],
    }),
  }),
});

export const {
  useGetPackagesQuery,
  useCreatePackageMutation,
  useUpdatePackageMutation,
  useDeletePackageMutation,
} = packageApi;

