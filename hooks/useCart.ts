"use client"

import { useSelector, useDispatch } from "react-redux"
import type { RootState } from "@/store/store"
import { addToCart, removeFromCart, updateQuantity, clearCart, type CartItem } from "@/store/slices/cartSlice"
import { useAuth } from "./useAuth"

export const useCart = () => {
  const dispatch = useDispatch()
  const { items, totalItems, totalPrice } = useSelector((state: RootState) => state.cart)
  const { isAuthenticated } = useAuth()

  const handleAddToCart = (item: CartItem) => {
    dispatch(addToCart(item))
  }

  const handleRemoveFromCart = (itemId: string) => {
    dispatch(removeFromCart(itemId))
  }

  const handleUpdateQuantity = (itemId: string, quantity: number) => {
    dispatch(updateQuantity({ id: itemId, quantity }))
  }

  const handleClearCart = () => {
    dispatch(clearCart())
  }

  const getItemQuantity = (itemId: string) => {
    const item = items.find((item) => item.id === itemId)
    return item ? item.quantity : 0
  }

  return {
    items,
    totalItems,
    totalPrice,
    addToCart: handleAddToCart,
    removeFromCart: handleRemoveFromCart,
    updateQuantity: handleUpdateQuantity,
    clearCart: handleClearCart,
    getItemQuantity,
  }
}
