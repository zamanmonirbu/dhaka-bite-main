import { baseApi } from "./baseApi"

export interface CartItem {
  _id?: string
  mealId: string
  name: string
  type: "lunch" | "dinner"
  category: "basic" | "standard" | "premium"
  price: number
  quantity: number
  date: string
  ingredients: string[]
  image?: string
}

export interface Cart {
  _id: string
  userId: string
  items: CartItem[]
  totalAmount: number
  createdAt: string
  updatedAt: string
}

export interface AddToCartRequest {
  mealId: string
  name: string
  type: "lunch" | "dinner"
  category: "basic" | "standard" | "premium"
  price: number
  quantity: number
  date: string
  ingredients: string[]
  image?: string
}

export interface UpdateCartItemRequest {
  itemId: string
  quantity: number
}

export const cartApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get user's cart
    getCart: builder.query<{ success: boolean; data: Cart }, void>({
      query: () => "/cart",
      providesTags: ["Cart"],
    }),

    // Add item to cart
    addToCart: builder.mutation<{ success: boolean; data: Cart }, AddToCartRequest>({
      query: (item) => ({
        url: "/cart",
        method: "POST",
        body: item,
      }),
      invalidatesTags: ["Cart"],
    }),

    // Update cart item quantity
    updateCartItem: builder.mutation<{ success: boolean; data: Cart }, UpdateCartItemRequest>({
      query: ({ itemId, quantity }) => ({
        url: `/cart/${itemId}`,
        method: "PUT",
        body: { quantity },
      }),
      invalidatesTags: ["Cart"],
    }),

    // Remove item from cart
    removeCartItem: builder.mutation<{ success: boolean; data: Cart }, string>({
      query: (itemId) => ({
        url: `/cart/${itemId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
    }),

    // Clear entire cart
    clearCart: builder.mutation<{ success: boolean; message: string }, void>({
      query: () => ({
        url: "/cart",
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
    }),

    // Sync local cart with server
    syncCart: builder.mutation<{ success: boolean; data: Cart }, CartItem[]>({
      query: (items) => ({
        url: "/cart/sync",
        method: "POST",
        body: { items },
      }),
      invalidatesTags: ["Cart"],
    }),
  }),
})

export const {
  useGetCartQuery,
  useAddToCartMutation,
  useUpdateCartItemMutation,
  useRemoveCartItemMutation,
  useClearCartMutation,
  useSyncCartMutation,
} = cartApi
