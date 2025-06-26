"use client"

import { useState } from "react"
import {
  Search,
  LayoutDashboard,
  CreditCard,
  Utensils,
  Settings,
  LogOut,
  Plus,
  User,
  Users,
  Gift,
  Copy,
  Share2,
  CheckCircle,
  Clock,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

// Mock data for referred users
const referredUsers = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah.j@email.com",
    joinDate: "2024-01-15",
    mealsCompleted: 45,
    status: "active",
  },
  {
    id: 2,
    name: "Mike Chen",
    email: "mike.chen@email.com",
    joinDate: "2024-02-03",
    mealsCompleted: 60,
    status: "completed",
  },
  {
    id: 3,
    name: "Emily Davis",
    email: "emily.d@email.com",
    joinDate: "2024-02-20",
    mealsCompleted: 23,
    status: "active",
  },
  {
    id: 4,
    name: "Alex Rodriguez",
    email: "alex.r@email.com",
    joinDate: "2024-03-01",
    mealsCompleted: 60,
    status: "completed",
  },
  {
    id: 5,
    name: "Lisa Wang",
    email: "lisa.w@email.com",
    joinDate: "2024-03-10",
    mealsCompleted: 12,
    status: "active",
  },
]

export default function ReferencesPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()

  const referralCode = "RAJA2024"
  const referralLink = `https://dhakabite.com/signup?ref=${referralCode}`

  const completedReferrals = referredUsers.filter((user) => user.status === "completed").length
  const activeReferrals = referredUsers.filter((user) => user.status === "active").length
  const totalMealsFromReferrals = referredUsers.reduce((sum, user) => sum + user.mealsCompleted, 0)

  const filteredUsers = referredUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink)
    alert("Referral link copied to clipboard!")
  }

  const shareReferralLink = () => {
    if (navigator.share) {
      navigator.share({
        title: "Join Dhaka Bite",
        text: "Get delicious meals delivered to your door!",
        url: referralLink,
      })
    } else {
      copyReferralLink()
    }
  }

  const getProgressColor = (meals: number) => {
    if (meals >= 60) return "bg-green-500"
    if (meals >= 40) return "bg-yellow-500"
    if (meals >= 20) return "bg-blue-500"
    return "bg-gray-300"
  }

  const getStatusBadge = (status: string, meals: number) => {
    if (status === "completed") {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle size={12} />
          Completed
        </span>
      )
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
        <Clock size={12} />
        Active
      </span>
    )
  }

  const handleLogout = () => {
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
     
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        

        {/* Dashboard Content */}
        <main className="flex-1 p-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-gray-500 text-sm mb-2">Total Referrals</h3>
                  <p className="text-3xl font-bold text-gray-900">{referredUsers.length}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="text-blue-600" size={24} />
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-gray-500 text-sm mb-2">Completed (60 meals)</h3>
                  <p className="text-3xl font-bold text-green-600">{completedReferrals}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="text-green-600" size={24} />
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-gray-500 text-sm mb-2">Active Referrals</h3>
                  <p className="text-3xl font-bold text-blue-600">{activeReferrals}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Clock className="text-yellow-600" size={24} />
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-gray-500 text-sm mb-2">Free Delivery Months</h3>
                  <p className="text-3xl font-bold text-purple-600">{completedReferrals}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Gift className="text-purple-600" size={24} />
                </div>
              </div>
            </div>
          </div>

          {/* Referral Link Section */}
          <div className="bg-white rounded-lg p-6 shadow-sm mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Referral Code</h2>
            <div className="flex items-center gap-4">
              <div className="flex-1 flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                {/* <span className="text-sm text-gray-600 flex-1">{referralLink}</span> */}
                <button
                  onClick={copyReferralLink}
                  className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                  title="Copy link"
                >
                  <Copy size={16} />
                </button>
              </div>
              {/* <button
                onClick={copyReferralLink}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
              >
                <Share2 size={16} />
                Share
              </button> */}
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Share this link with friends. When they complete 60 meals, you'll get 1 month of free delivery!
            </p>
          </div>

          {/* Referred Users List */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Referred Users</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 w-64"
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">User</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Join Date</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Progress</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Reward</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {new Date(user.joinDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 mb-1">{user.mealsCompleted}/60 meals</div>
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(user.mealsCompleted)}`}
                            style={{ width: `${Math.min((user.mealsCompleted / 60) * 100, 100)}%` }}
                          ></div>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {Math.round((user.mealsCompleted / 60) * 100)}% complete
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                            user.status === "completed" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {user.status === "completed" ? <CheckCircle size={12} /> : <Clock size={12} />}
                          {user.status === "completed" ? "Completed" : "Active"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {user.status === "completed" ? (
                          <span className="inline-flex items-center gap-1 text-green-600 text-sm font-medium">
                            <Gift size={14} />1 Month Free
                          </span>
                        ) : (
                          <span className="text-gray-400 text-sm">Pending</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
