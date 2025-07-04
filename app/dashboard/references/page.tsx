"use client"

import { useState, useMemo } from "react"
import {
  Search,
  Users,
  Gift,
  Copy,
  Share2,
  CheckCircle,
  Clock,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useGetReferredUsersQuery } from "@/rest/store/api/authApi"
import { useAuth } from "@/hooks/useAuth"

/* -------------------------------------------------------------------------- */
/*                               Helper utils                                 */
/* -------------------------------------------------------------------------- */

/** How many completed meals unlock the reward? */
const COMPLETION_TARGET = 60

const getProgressColor = (orders: number) => {
  if (orders >= 60) return "bg-green-500"
  if (orders >= 40) return "bg-yellow-500"
  if (orders >= 20) return "bg-blue-500"
  return "bg-gray-300"
}

const getStatus = (orders: number) => (orders >= COMPLETION_TARGET ? "completed" : "active")

/* -------------------------------------------------------------------------- */
/*                               Component                                    */
/* -------------------------------------------------------------------------- */

export default function ReferencesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()
  const { user } = useAuth()

  /* --------------------------- Fetch referred data -------------------------- */
  const { data, isLoading, isError, error } = useGetReferredUsersQuery();

  const { data: referredUsersData } = data || {};

  console.log("Referred users data:", referredUsersData)
  console.log("Loading:", isLoading)
  console.log("Error:", isError, error)

  // Handle loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading referral data...</p>
          </div>
        </div>
      </div>
    )
  }

  // Handle error state
  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="text-red-600">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error Loading Data</h3>
              <p className="text-sm text-red-700 mt-1">
                Failed to load referral data. Please try refreshing the page.
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Extract data safely
  const referredUsers = data?.data?.referedUsersWithStats ?? []
  const totalReferrals = data?.data?.totalReference ?? 0
  const referralCode = data?.data?.referenceCode ?? user?.referenceCode ?? ""
  const referralLink = `https://dhakabite.com/signup?ref=${referralCode}`

  /* ------------------------ Derived statistics ----------------------------- */
  const completedReferrals = referredUsers.filter(
    (u: any) => u.ordersCount >= COMPLETION_TARGET
  ).length
  const activeReferrals = totalReferrals - completedReferrals
  const totalMealsFromReferrals = referredUsers.reduce(
    (sum: number, u: any) => sum + u.ordersCount,
    0
  )

  /* ---------------------------- Search filter ------------------------------ */
  const filteredUsers = useMemo(() => {
    const term = searchTerm.toLowerCase()
    return referredUsers.filter(
      (u: any) =>
        u.name.toLowerCase().includes(term) ||
        u.email.toLowerCase().includes(term) ||
        u.phone.toLowerCase().includes(term)
    )
  }, [referredUsers, searchTerm])

  /* ---------------------------- Copy / Share ------------------------------- */
  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink)
    toast({
      title: "Copied!",
      description: "Referral link copied to clipboard.",
    })
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

  /* ------------------------------------------------------------------------ */

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* ───────────────────── Stats cards ───────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Referrals"
          value={totalReferrals}
          icon={<Users className="text-blue-600" size={24} />}
          bg="bg-blue-100"
        />
        <StatsCard
          title={`Completed (${COMPLETION_TARGET} meals)`}
          value={completedReferrals}
          icon={<CheckCircle className="text-green-600" size={24} />}
          bg="bg-green-100"
        />
        <StatsCard
          title="Active Referrals"
          value={activeReferrals}
          icon={<Clock className="text-yellow-600" size={24} />}
          bg="bg-yellow-100"
        />
        <StatsCard
          title="Free Delivery Months"
          value={completedReferrals}
          icon={<Gift className="text-purple-600" size={24} />}
          bg="bg-purple-100"
        />
      </div>

      {/* ───────────────────── Referral code ──────────────────── */}
      <div className="bg-white rounded-lg p-6 shadow-sm mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Your Referral Code
        </h2>
        <div className="flex items-center gap-4">
          <div className="flex-1 flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
            <span className="text-sm font-mono text-gray-700">{referralCode}</span>
            <button
              onClick={copyReferralLink}
              className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
              title="Copy link"
            >
              <Copy size={16} />
            </button>
          </div>
          <button
            onClick={shareReferralLink}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
          >
            <Share2 size={16} /> Share
          </button>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Share this link with friends. When they complete {COMPLETION_TARGET} meals,
          you&apos;ll get 1 month of free delivery!
        </p>
      </div>

      {/* ───────────────────── Referred users table ──────────────────── */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            Referred Users ({referredUsers.length})
          </h2>

          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={16}
            />
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
          {filteredUsers.length === 0 ? (
            <div className="text-center py-12">
              <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm ? "No matching users found" : "No referrals yet"}
              </h3>
              <p className="text-gray-500">
                {searchTerm 
                  ? "Try adjusting your search terms" 
                  : "Start sharing your referral code to see your referred users here"}
              </p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <Th>User</Th>
                  <Th>Phone</Th>
                  <Th>Progress</Th>
                  <Th>Status</Th>
                  <Th>Reward</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUsers.map((u: any) => {
                  const status = getStatus(u.ordersCount)
                  const percentage = Math.min(
                    Math.round((u.ordersCount / COMPLETION_TARGET) * 100),
                    100
                  )

                  return (
                    <tr key={u._id}>
                      {/* User */}
                      <Td>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{u.name}</div>
                          <div className="text-sm text-gray-500">{u.email}</div>
                        </div>
                      </Td>

                      {/* Phone */}
                      <Td className="text-sm text-gray-900">{u.phone}</Td>

                      {/* Progress */}
                      <Td>
                        <div className="text-sm text-gray-900 mb-1">
                          {u.ordersCount}/{COMPLETION_TARGET} meals
                        </div>
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(
                              u.ordersCount
                            )}`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {percentage}% complete
                        </div>
                      </Td>

                      {/* Status */}
                      <Td>
                        {status === "completed" ? (
                          <Badge color="green" icon={CheckCircle}>
                            Completed
                          </Badge>
                        ) : (
                          <Badge color="blue" icon={Clock}>
                            Active
                          </Badge>
                        )}
                      </Td>

                      {/* Reward */}
                      <Td>
                        {status === "completed" ? (
                          <span className="inline-flex items-center gap-1 text-green-600 text-sm font-medium">
                            <Gift size={14} />
                            1 Month Free
                          </span>
                        ) : (
                          <span className="text-gray-400 text-sm">Pending</span>
                        )}
                      </Td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}

function StatsCard({
  title,
  value,
  icon,
  bg,
}: {
  title: string
  value: number | string
  icon: React.ReactNode
  bg: string
}) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-gray-500 text-sm mb-2">{title}</h3>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`w-12 h-12 ${bg} rounded-lg flex items-center justify-center`}>
          {icon}
        </div>
      </div>
    </div>
  )
}

const Th = ({ children }: { children: React.ReactNode }) => (
  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">{children}</th>
)

const Td = ({
  children,
  className = "",
}: {
  children: React.ReactNode
  className?: string
}) => <td className={`px-6 py-4 ${className}`}>{children}</td>

function Badge({
  color,
  icon: Icon,
  children,
}: {
  color: "green" | "blue"
  icon: typeof CheckCircle
  children: React.ReactNode
}) {
  const palette =
    color === "green"
      ? "bg-green-100 text-green-800"
      : "bg-blue-100 text-blue-800"
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${palette}`}>
      <Icon size={12} />
      {children}
    </span>
  )
}