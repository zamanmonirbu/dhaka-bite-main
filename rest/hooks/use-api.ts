"use client"

import { useState, useEffect } from "react"

// Define the base URL for your API
const API_BASE_URL =process.env.NEXT_PUBLIC_API_BASE_URL

// Generic type for API responses
interface ApiResponse<T> {
  data: T | null
  loading: boolean
  error: Error | null
  refetch: () => Promise<void>
}

// Function to fetch data from the API
export function useFetch<T>(endpoint: string): ApiResponse<T> {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_BASE_URL}${endpoint}`)

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const result = await response.json()
      setData(result)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err : new Error("An unknown error occurred"))
      setData(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [endpoint])

  return { data, loading, error, refetch: fetchData }
}

// Function to post data to the API
export async function postData<T, R>(endpoint: string, data: T): Promise<R> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`)
  }

  return response.json()
}

// Function to update data in the API
export async function updateData<T, R>(endpoint: string, data: T): Promise<R> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`)
  }

  return response.json()
}

// Function to delete data from the API
export async function deleteData<R>(endpoint: string): Promise<R> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "DELETE",
  })

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`)
  }

  return response.json()
}
