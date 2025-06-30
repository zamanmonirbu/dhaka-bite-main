import type { Metadata } from "next"
import DashboardLayout from "@/components/layouts/DashboardLayout"

export const metadata: Metadata = {
  title: "Dashboard",
  description: "User Dashboard",
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>
}
