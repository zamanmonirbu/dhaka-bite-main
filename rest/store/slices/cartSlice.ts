import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
  date: string
  mealType: "breakfast" | "lunch" | "dinner"
  menuType: "Basic" | "Standard" | "Premium"
  ingredients: Array<{
    name: string
    quantity: string
  }>
}

interface CartState {
  items: CartItem[]
  totalItems: number
  totalPrice: number
}

const getInitialCart = (): CartItem[] => {
  if (typeof window !== "undefined") {
    try {
      const savedCart = localStorage.getItem("cart")
      return savedCart ? JSON.parse(savedCart) : []
    } catch (error) {
      console.error("Error parsing cart from localStorage:", error)
      return []
    }
  }
  return []
}

const calculateTotals = (items: CartItem[]) => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  return { totalItems, totalPrice }
}

const initialState: CartState = {
  items: getInitialCart(),
  totalItems: 0,
  totalPrice: 0,
}

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    ...initialState,
    ...calculateTotals(initialState.items),
  },
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.items.find((item) => item.id === action.payload.id)

      if (existingItem) {
        existingItem.quantity += action.payload.quantity
      } else {
        state.items.push(action.payload)
      }

      const totals = calculateTotals(state.items)
      state.totalItems = totals.totalItems
      state.totalPrice = totals.totalPrice

      if (typeof window !== "undefined") {
        localStorage.setItem("cart", JSON.stringify(state.items))
      }
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload)

      const totals = calculateTotals(state.items)
      state.totalItems = totals.totalItems
      state.totalPrice = totals.totalPrice

      if (typeof window !== "undefined") {
        localStorage.setItem("cart", JSON.stringify(state.items))
      }
    },
    updateQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      const item = state.items.find((item) => item.id === action.payload.id)
      if (item) {
        if (action.payload.quantity <= 0) {
          state.items = state.items.filter((item) => item.id !== action.payload.id)
        } else {
          item.quantity = action.payload.quantity
        }

        const totals = calculateTotals(state.items)
        state.totalItems = totals.totalItems
        state.totalPrice = totals.totalPrice

        if (typeof window !== "undefined") {
          localStorage.setItem("cart", JSON.stringify(state.items))
        }
      }
    },
    clearCart: (state) => {
      state.items = []
      state.totalItems = 0
      state.totalPrice = 0

      if (typeof window !== "undefined") {
        localStorage.removeItem("cart")
      }
    },
    initializeCart: (state) => {
      const items = getInitialCart()
      state.items = items
      const totals = calculateTotals(items)
      state.totalItems = totals.totalItems
      state.totalPrice = totals.totalPrice
    },
  },
})

export const { addToCart, removeFromCart, updateQuantity, clearCart, initializeCart } = cartSlice.actions
export default cartSlice.reducer
