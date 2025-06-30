"use client"

import Image from "next/image"
import { useSelector } from "react-redux"
import { RootState } from "@/store/store"
import { useGetUserByIdQuery } from "@/store/api/authApi"
import { useGetTodayMainMealsQuery } from "@/store/api/mealApi"

export default function DashboardPage() {
  const userId = useSelector((state: RootState) => state.auth.user?._id)
  const { data: profileData, isLoading: loadingUser } = useGetUserByIdQuery(userId!, { skip: !userId })
  const { data: mealsData, isLoading: loadingMeals } = useGetTodayMainMealsQuery(userId!, { skip: !userId })

  const user = profileData?.data
  const upcomingMeals = mealsData?.data.upcomingMeals || []
  const previousMeals = mealsData?.data.previousMeals || []

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-gray-500 text-sm mb-2">Total Balance</h3>
          <p className="text-3xl font-bold text-gray-900">
            {loadingUser ? "Loading..." : `${user?.balance?.toFixed(2) || "0.00"}/-`}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-gray-500 text-sm mb-2">Total Meal</h3>
          <p className="text-3xl font-bold text-gray-900">{loadingMeals ? "Loading..." : previousMeals.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-gray-500 text-sm mb-2">Total Reference</h3>
          <p className="text-3xl font-bold text-gray-900">2</p>
        </div>
      </div>

      {/* Upcoming Meals */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Upcoming Meals</h2>
        </div>
        {loadingMeals ? (
          <p className="p-6 text-gray-500">Loading upcoming meals...</p>
        ) : upcomingMeals.length === 0 ? (
          <p className="p-6 text-gray-500">No upcoming meals found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
            {upcomingMeals.map((meal) => (
              <div key={meal._id} className="bg-gray-50 rounded-lg shadow-sm overflow-hidden">
                <Image
                  src={meal.mealId.image}
                  alt={meal.mealId.name}
                  width={400}
                  height={250}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold">{meal.mealId.name}</h3>
                  <p className="text-sm text-gray-500">Time: {meal.mealId.time}</p>
                  <p className="text-sm text-gray-500">Package: {meal.mealId.foodPackage}</p>
                  <p className="text-sm text-gray-500">Price: {meal.mealId.price}/-</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Date: {new Date(meal.date).toLocaleDateString("en-GB")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Previous Meals */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Previous Meal History</h2>
        </div>
        {loadingMeals ? (
          <p className="p-6 text-gray-500">Loading previous meals...</p>
        ) : previousMeals.length === 0 ? (
          <p className="p-6 text-gray-500">No previous meals found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
            {previousMeals.map((meal) => (
              <div key={meal._id} className="bg-gray-50 rounded-lg shadow-sm overflow-hidden">
                <Image
                  src={meal.mealId.image}
                  alt={meal.mealId.name}
                  width={400}
                  height={250}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold">{meal.mealId.name}</h3>
                  <p className="text-sm text-gray-500">Time: {meal.mealId.time}</p>
                  <p className="text-sm text-gray-500">Package: {meal.mealId.foodPackage}</p>
                  <p className="text-sm text-gray-500">Price: {meal.mealId.price}/-</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Date: {new Date(meal.date).toLocaleDateString("en-GB")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

