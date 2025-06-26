"use client"

import { useEffect, useState } from "react"
import { useGetMealsQuery, useCreateMainMealMutation, useGetMainMealsThisMonthQuery } from "@/store/api/mealApi"
import { useSelector } from "react-redux"
import { RootState } from "@/store/store"
import { skipToken } from "@reduxjs/toolkit/query"

const getFullDateFromDay = (day: string) => {
  const dayOfWeekMap: { [key: string]: number } = {
    sunday: 0,
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6,
  }

  const today = new Date()
  const currentDay = today.getDay()
  const targetDay = dayOfWeekMap[day.toLowerCase()]
  const diff = (targetDay - currentDay + 7) % 7
  const resultDate = new Date(today)
  resultDate.setDate(today.getDate() + diff)

  return {
    formatted: resultDate.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "short",
      day: "numeric",
    }),
    dateKey: resultDate.toISOString().split("T")[0], // for lookup
  }
}

export default function MealPage() {
  const user = useSelector((state: RootState) => state.auth.user)
  const today = new Date().toISOString().split("T")[0]

  const { data: mealsData } = useGetMealsQuery(
    user?.subscription ? { foodPackage: user.subscription, today } : skipToken
  )

  const { data: mainMealsData } = useGetMainMealsThisMonthQuery(
    user?._id ? user._id : skipToken
  )

  const [createMainMeal] = useCreateMainMealMutation()
  const [statusMap, setStatusMap] = useState<{ [key: string]: { status: string; mainId: string } }>({})

  // Build statusMap from mainMeals data
  useEffect(() => {
    if (!mainMealsData?.data) return

    const map: { [key: string]: { status: string; mainId: string } } = {}
    mainMealsData.data.forEach((entry) => {
      const key = `${entry.mealId}-${entry.date.slice(0, 10)}`
      map[key] = { status: entry.status, mainId: entry._id }
    })
    setStatusMap(map)
  }, [mainMealsData])

  const handleStatusChange = async (
    mealId: string,
    dateKey: string,
    newStatus: "active" | "skipped"
  ) => {
    if (!user?._id) return

    const key = `${mealId}-${dateKey}`

    try {
      const res = await createMainMeal({
        userId: user._id,
        mealId,
        date: dateKey,
        status: newStatus,
      }).unwrap()

      setStatusMap({ ...statusMap, [key]: { status: newStatus, mainId: res.data._id } })
    } catch (error) {
      console.error("Error updating status:", error)
    }
  }

  const getBgColor = (status: string) => {
    if (status === "active") return "bg-green-100 border-green-300"
    if (status === "skipped") return "bg-red-100 border-red-300"
    return "bg-gray-100 border-gray-300"
  }

  const renderMeals = (mealList: any[], dateKey: string) =>
    mealList.length > 0 ? (
      mealList.map((meal) => {
        const key = `${meal._id}-${dateKey}`
        const status = statusMap[key]?.status || "unselected"

        return (
          <div
            key={meal._id}
            className={`p-3 mb-2 border rounded shadow-sm text-sm ${getBgColor(status)}`}
          >
            <div className="flex justify-between items-center">
              <div>
                <div className="font-semibold">{meal.name}</div>
                <p className="text-gray-600 text-xs">{meal.description}</p>
              </div>
              <select
                className="ml-2 border rounded px-2 py-1 text-sm"
                value={status === "unselected" ? "" : status}
                onChange={(e) =>
                  handleStatusChange(meal._id, dateKey, e.target.value as "active" | "skipped")
                }
              >
                <option value="">Select</option>
                <option value="active">Active</option>
                <option value="skipped">Inactive</option>
              </select>
            </div>
          </div>
        )
      })
    ) : (
      <p className="text-gray-400 text-sm italic">No meals</p>
    )

  return (
    <div className="min-h-screen bg-white p-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">
        🍽️ You are under <span className="text-green-500">{user?.subscription}</span> package.
      </h2>

      <div className="grid grid-cols-3 gap-6 font-semibold text-lg text-gray-700 mb-4">
        <div>📅 Day & Date</div>
        <div>🍱 Lunch</div>
        <div>🌙 Dinner</div>
      </div>

      <div className="space-y-6">
        {mealsData?.data?.basic &&
          Object.entries(mealsData.data.basic).map(([day, meals]) => {
            const { formatted, dateKey } = getFullDateFromDay(day)
            const lunchMeals = meals.filter((m) => m.time === "lunch")
            const dinnerMeals = meals.filter((m) => m.time === "dinner")

            return (
              <div key={day} className="grid grid-cols-3 gap-6 border-t pt-4">
                <div className="text-base text-gray-800 capitalize">{formatted}</div>
                <div>{renderMeals(lunchMeals, dateKey)}</div>
                <div>{renderMeals(dinnerMeals, dateKey)}</div>
              </div>
            )
          })}
      </div>
    </div>
  )
}
