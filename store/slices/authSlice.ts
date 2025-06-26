import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export interface User {
  subscription: any
  _id: string
  email: string
  name?: string
  phone?: string
  profileImage?: string
  isVerified: boolean
  role: string
  balance: number
}


interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user
      state.token = action.payload.token
      state.isAuthenticated = true
      state.isLoading = false

      if (typeof window !== "undefined") {
        localStorage.setItem("token", action.payload.token)
        localStorage.setItem("user", JSON.stringify(action.payload.user))
      }
    },
    logout: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      state.isLoading = false

      if (typeof window !== "undefined") {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        localStorage.removeItem("cart")
      }
    },
    initializeAuth: (state) => {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("token")
        const userStr = localStorage.getItem("user")

        if (token && userStr) {
          try {
            const user = JSON.parse(userStr)
            state.user = user
            state.token = token
            state.isAuthenticated = true
          } catch (error) {
            console.error("Error parsing user data:", error)
            localStorage.removeItem("token")
            localStorage.removeItem("user")
          }
        }
      }
      state.isLoading = false
    },
    updateBalance: (state, action: PayloadAction<number>) => {
      if (state.user) {
        state.user.balance = action.payload
        if (typeof window !== "undefined") {
          localStorage.setItem("user", JSON.stringify(state.user))
        }
      }
    },
  },
})

export const { setCredentials, logout, initializeAuth, updateBalance } = authSlice.actions
export default authSlice.reducer
