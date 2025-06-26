"use client"

import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import { useDispatch } from "react-redux"
import { useEffect, useState } from "react"
import { logout } from "@/store/slices/authSlice"
import { useAuth } from "@/hooks/useAuth"
import ProtectedRoute from "@/components/auth/ProtectedRoute"
import {
  Home,
  Calendar,
  Utensils,
  Settings,
  Users,
  LogOut,
  Search,
  Plus,
  HomeIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const sidebarItems = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/dashboard/subscription", label: "Subscription", icon: Calendar },
  { href: "/dashboard/meal", label: "Meal Plan", icon: Utensils },
  { href: "/dashboard/references", label: "References", icon: Users },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const dispatch = useDispatch()
  const router = useRouter()
  const { user } = useAuth()

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLogout = () => {
    dispatch(logout())
    router.push("/")
  }

  if (!mounted) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg">
          <div className="p-6">
            <div className="flex items-center space-x-3">
              {/* <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </div> */}
              <Link href="/" className="flex items-center space-x-2">
                <HomeIcon className="h-5 w-5 text-gray-500 hover:text-gray-700" />
                <span className="text-sm font-semibold text-gray-700 hover:text-gray-900">Home</span>
              </Link>
            </div>
          </div>

          <nav className="px-4 pb-4">
            {sidebarItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className={`w-full justify-start mb-2 ${
                      isActive ? "bg-green-600 text-white" : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <Icon className="mr-3 h-4 w-4" />
                    {item.label}
                  </Button>
                </Link>
              )
            })}
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="w-full justify-start mt-4 text-red-600 hover:bg-red-50"
            >
              <LogOut className="mr-3 h-4 w-4" />
              Logout
            </Button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="bg-white shadow-sm px-8 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-500">{pathname.split("/")[2]?.toUpperCase() || "HOME"}</p>
            </div>

           <div className="flex items-center gap-6">
  {/* Search bar */}
  <div className="relative">
    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
    <input
      type="text"
      placeholder="Search"
      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 w-80"
    />
  </div>

  {/* User Profile */}
  <div className="flex items-center gap-3">
    {user?.profileImage ? (
      <div className="w-10 h-10 rounded-full overflow-hidden">
        <img src={user.profileImage} alt="User" className="w-full h-full object-cover" />
      </div>
    ) : (
      <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">
        {user?.name?.charAt(0).toUpperCase() || "U"}
      </div>
    )}
    <div>
      <p className="font-medium text-gray-900">{user?.name || "User"}</p>
      <p className="text-sm text-gray-500">{user?.role || "Customer"}</p>
    </div>
  </div>

  {/* Wallet */}
  <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg shadow-sm">
    <span className="text-gray-700 font-medium">৳{user?.balance || 0}</span>
    <button className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 text-sm flex items-center gap-1">
      <Plus size={14} />
      <span>Add</span>
    </button>
  </div>
</div>

          </header>

          {/* Page content */}
          <div className="p-8">
            <Card>
              <CardContent className="p-6">{children}</CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
