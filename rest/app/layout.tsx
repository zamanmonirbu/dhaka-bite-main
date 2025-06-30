// app/layout.tsx
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import RootClientWrapper from "@/components/layouts/RootClientWrapper"
import "leaflet/dist/leaflet.css"

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
        <link rel="icon" href="/dhaka-bite-logo.svg" type="image/svg+xml" />
      </head>
      <body className={inter.className}>
        <RootClientWrapper>
          {children}
        </RootClientWrapper>
      </body>
    </html>
  )
}
