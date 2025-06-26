"use client"

import type React from "react"
import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { initializeAuth } from "@/store/slices/authSlice"
import { initializeCart } from "@/store/slices/cartSlice"

interface AuthProviderProps {
  children: React.ReactNode
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initializeAuth())
    dispatch(initializeCart())
  }, [dispatch])

  return <>{children}</>
}
