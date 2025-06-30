// components/layouts/RootClientWrapper.tsx
'use client'

import { ReactNode, useEffect, useState } from "react"
import ReduxProvider from "@/components/providers/ReduxProvider"
import AuthProvider from "@/components/providers/AuthProvider"
import ClientLayout from "@/components/layouts/ClientLayout"

export default function RootClientWrapper({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false)

  // Prevent mismatches by ensuring rendering happens only on client
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <ReduxProvider>
      <AuthProvider>
        <ClientLayout>{children}</ClientLayout>
      </AuthProvider>
    </ReduxProvider>
  )
}
