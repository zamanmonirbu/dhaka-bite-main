import { baseApi } from "./baseApi"

export interface Ingredient {
  name: string
  quantity: string
  unit: string
  _id?: string
}

export interface ApiMeal {
  _id: string
  name: string
  time: "breakfast" | "lunch" | "dinner" | "snack"
  foodPackage: "basic" | "standard" | "premium"
  description: string
  image: string
  ingredients: Ingredient[]
  price: number
  availability: string
  deliveryCharges: number
  createdAt: string
  updatedAt: string
  __v: number
}

export interface ApiMealsResponse {
  status: boolean
  message: string
  data: {
    basic: {
      [day: string]: ApiMeal[]
    }
    standard: {
      [day: string]: ApiMeal[]
    }
    premium?: {
      [day: string]: ApiMeal[]
    }
  }
}

// Legacy interfaces for backward compatibility
export interface Meal {
  _id: string
  name: string
  type: "lunch" | "dinner"
  category: "basic" | "standard" | "premium"
  description: string
  image: string
  ingredients: Ingredient[]
  price: {
    basic: number
    standard: number
    premium: number
  }
  nutritionalInfo: {
    calories: number
    protein: number
    carbs: number
    fat: number
  }
  availability: {
    days: string[]
    startDate: string
    endDate: string
  }
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface MealFilters {
  category?: string
  type?: string
  search?: string
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: "asc" | "desc"
  today?: string
}

// Example definition
export interface MealFilters {
  today?: string
  foodPackage?: string // <-- Add this line
}


export interface WeeklyMenu {
  package: string
  days: {
    day: string
    date: string
    meals: {
      lunch: Meal
      dinner: Meal
    }
  }[]
}

export const mealApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get meals with today filter - Updated to match your API structure
    getMeals: builder.query<ApiMealsResponse, MealFilters>({
      query: (filters = {}) => {
        const params = new URLSearchParams()
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined) {
            params.append(key, value.toString())
          }
        })
        return `/meals?${params.toString()}`
      },
      providesTags: ["Meal"],
    }),

    // Get meals for today specifically
    getTodayMeals: builder.query<ApiMealsResponse, string>({
      query: (today) => `/meals?today=${today}`,
      providesTags: ["Meal"],
    }),

    // Get single meal
    getMeal: builder.query<{ success: boolean; data: Meal }, string>({
      query: (id) => `/meals/${id}`,
      providesTags: ["Meal"],
    }),


    getMainMealsThisMonth: builder.query<any, string>({
  query: (userId) => `/main-meal/user/${userId}/this-month`,
  providesTags: ["MainMeal"]
}),

getTodayMainMeals: builder.query<any, string>({
  query: (userId) => `/main-meal/user/${userId}/today`,
  providesTags: ["MainMeal"]
}),



    // Get weekly menu for specific package
    getWeeklyMenu: builder.query<{ success: boolean; data: WeeklyMenu }, string>({
      query: (packageType) => `/meals/weekly/${packageType}`,
      providesTags: ["Meal"],
    }),

    // Get meals for specific date
    getDailyMeals: builder.query<{ success: boolean; data: Meal[] }, string>({
      query: (date) => `/meals/daily/${date}`,
      providesTags: ["Meal"],
    }),

    // Get featured meals
    getFeaturedMeals: builder.query<{ success: boolean; data: Meal[] }, void>({
      query: () => "/meals/featured",
      providesTags: ["Meal"],
    }),

    // Get filter meals
    getFilterMeals: builder.query<{ success: boolean; data: Meal[] }, string>({
      query: (foodPackage) => `/meals?foodPackage=${encodeURIComponent(foodPackage)}`,
      providesTags: ["Meal"],
    }),

    // Search meals
    searchMeals: builder.query<{ success: boolean; data: Meal[] }, string>({
      query: (searchTerm) => `/meals/search?q=${encodeURIComponent(searchTerm)}`,
      providesTags: ["Meal"],
    }),

    // Admin endpoints (if user is admin)
    createMeal: builder.mutation<{ success: boolean; data: Meal }, Partial<Meal>>({
      query: (mealData) => ({
        url: "/meals",
        method: "POST",
        body: mealData,
      }),
      invalidatesTags: ["Meal"],
    }),

    updateMeal: builder.mutation<{ success: boolean; data: Meal }, { id: string; data: Partial<Meal> }>({
      query: ({ id, data }) => ({
        url: `/meals/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Meal"],
    }),

    deleteMeal: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({
        url: `/meals/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Meal"],
    }),
    createMainMeal: builder.mutation<{ success: boolean; data: ApiMeal }, { userId: string; mealId: string; date: string; status: 'active' | 'skipped' }>({
      query: ({ userId, mealId, date, status }) => ({
        url: "/main-meal/create",
        method: "POST",
        body: { userId, mealId, date, status },
      }),
      invalidatesTags: ['MainMeal'],
    }),
    updateMainMeal: builder.mutation<{ success: boolean; data: ApiMeal }, { id: string; status: 'active' | 'skipped' }>({
      query: ({ id, status }) => ({
        url: `/main-meal/${id}`,
        method: "PUT",
        body: { status },
      }),
      invalidatesTags: ['MainMeal'],
    }),

  }),
})

export const {
  useGetMealsQuery,
  useGetTodayMealsQuery,
  useGetMealQuery,
  useGetWeeklyMenuQuery,
  useGetDailyMealsQuery,
  useGetFeaturedMealsQuery,
  useSearchMealsQuery,
  useCreateMealMutation,
  useUpdateMealMutation,
  useDeleteMealMutation,
  useCreateMainMealMutation,
  useUpdateMainMealMutation,
  useGetFilterMealsQuery,
  useGetMainMealsThisMonthQuery,
  useGetTodayMainMealsQuery,

} = mealApi