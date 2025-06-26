import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import ReduxProvider from "@/components/providers/ReduxProvider"
import AuthProvider from "@/components/providers/AuthProvider"
import ClientLayout from "@/components/layouts/ClientLayout"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Dhaka Bite - Daily Meal System",
  description: "Fresh, home-style meals delivered daily in Dhaka",
  generator: 'Md. Moniruzzaman'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/fav.png" type="image/png" />
      </head>
      <body className={inter.className}>
        <ReduxProvider>
          <AuthProvider>
            <ClientLayout>{children}</ClientLayout>
          </AuthProvider>
        </ReduxProvider>
      </body>
    </html>
  )
}
