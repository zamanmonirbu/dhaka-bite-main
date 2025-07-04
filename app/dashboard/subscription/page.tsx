"use client"

import { useEffect } from "react"
import { useSelector } from "react-redux"
import { RootState } from "@/store/store"
import { useRouter } from "next/navigation"
import { useGetSubscriptionsQuery } from "@/store/api/subscriptionApi"

export default function SubscriptionPage() {
  const user = useSelector((state: RootState) => state.auth.user)
  const router = useRouter()

  const { data, isLoading, isError } = useGetSubscriptionsQuery()

  // API returns `subcriptions` (note the typo) and `recharges`
  const subscriptions = data?.data?.subcriptions ?? []
  const recharges = data?.data?.recharges ?? []

  useEffect(() => {
    if (!user?._id) router.push("/")
  }, [user, router])

  if (isLoading) return <div className="p-8">Loading...</div>
  if (isError) return <div className="p-8">Failed to load subscription data.</div>

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">
        📄 Subscription Summary
      </h2>

      {/* Subscription History */}
      <section className="mb-12">
        <h3 className="text-xl font-semibold text-blue-600 mb-4">
          Subscription History
        </h3>
        <div className="overflow-x-auto border rounded-lg shadow">
          <table className="w-full text-left">
            <thead className="bg-blue-50">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {subscriptions.map((item: any) => (
                <tr key={item._id} className="border-t">
                  <td className="px-4 py-2">{item.userId?.name || "N/A"}</td>
                  <td className="px-4 py-2">৳ {item.amount.toFixed(2)}</td>
                  <td className="px-4 py-2 capitalize">{item.payType}</td>
                  <td className="px-4 py-2 capitalize">{item.status}</td>
                  <td className="px-4 py-2">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {subscriptions.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-3 text-center text-gray-500"
                  >
                    No subscription history found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Cash In History */}
      <section>
        <h3 className="text-xl font-semibold text-green-600 mb-4">
          Cash In (Recharge) History
        </h3>
        <div className="overflow-x-auto border rounded-lg shadow">
          <table className="w-full text-left">
            <thead className="bg-green-50">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {recharges.map((item: any) => (
                <tr key={item._id} className="border-t">
                  <td className="px-4 py-2">{item.userId?.name || "N/A"}</td>
                  <td className="px-4 py-2">৳ {item.amount.toFixed(2)}</td>
                  <td className="px-4 py-2 capitalize">{item.payType}</td>
                  <td className="px-4 py-2 capitalize">{item.status}</td>
                  <td className="px-4 py-2">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {recharges.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-3 text-center text-gray-500"
                  >
                    No recharge history found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
