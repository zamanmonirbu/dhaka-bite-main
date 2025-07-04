"use client"

import { useState, useMemo, useCallback, useEffect } from "react"
import Image from "next/image"
import { useSelector } from "react-redux"
import { skipToken } from "@reduxjs/toolkit/query"
import { RootState } from "@/store/store"
import {
  useGetMealQuery,
  useCreateMainMealMutation,
  useGetMainMealsThisMonthQuery,
} from "@/store/api/mealApi"

/* -------------------------------------------------------------------------- */
/*                               Helper utils                                 */
/* -------------------------------------------------------------------------- */

const WEEK_DAYS = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
] as const

type WeekDay = (typeof WEEK_DAYS)[number]
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

/**‑ return the calendar date (midnight) for the next occurrence of that day */
function dateForDay(day: WeekDay) {
  const today = new Date()
  const diff = (WEEK_DAYS.indexOf(day) - today.getDay() + 7) % 7
  const d = new Date(today)
  d.setHours(0, 0, 0, 0)
  d.setDate(today.getDate() + diff)
  return d
}
const dateKey = (d: Date) => d.toISOString().slice(0, 10) // "YYYY‑MM‑DD"
const fmt = (d: Date) =>
  d.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })

/* -------------------------------------------------------------------------- */
/*                               Component                                    */
/* -------------------------------------------------------------------------- */

export default function MealPlanPage() {
  /* -------------------------------------------------------------------- */
  /*                             Data fetches                              */
  /* -------------------------------------------------------------------- */
  const user = useSelector((s: RootState) => s.auth.user)

  const { data: mealsData, isFetching } = useGetMealQuery(
    user?.subscription ? user.subscription : skipToken
  )

  const { data: mainMealsData, isLoading: isLoadingMain } =
    useGetMainMealsThisMonthQuery(user?._id ? user._id : skipToken)

  const [createMainMeal] = useCreateMainMealMutation()

  /* -------------------------------------------------------------------- */
  /*                      Local cache of chosen status                     */
  /* -------------------------------------------------------------------- */
  const [statusMap, setStatusMap] = useState<
    Record<string, { status: "active" | "skipped" | "none"; mainId?: string }>
  >({})

  /* hydrate the map with data from the API once it arrives */
  useEffect(() => {
    if (!mainMealsData?.data) return
    const map: typeof statusMap = {}
    mainMealsData.data.forEach((entry: any) => {
      const key = `${entry.mealId}-${entry.date.slice(0, 10)}`
      map[key] = { status: entry.status as any, mainId: entry._id }
    })
    setStatusMap(map)
  }, [mainMealsData])

  /* -------------------------------------------------------------------- */
  /*               Group meals → { monday: { lunch,dinner } }              */
  /* -------------------------------------------------------------------- */
  const mealsByDay = useMemo(() => {
    const g: Record<WeekDay, { lunch?: any; dinner?: any }> = {
      sunday: {},
      monday: {},
      tuesday: {},
      wednesday: {},
      thursday: {},
      friday: {},
      saturday: {},
    }
    mealsData?.data?.forEach((m: any) => {
      const d = m.availability as WeekDay
      if (d in g) g[d][m.time] = m
    })
    return g
  }, [mealsData])

  /* -------------------------------------------------------------------- */
  /*                        Status‑change handler                          */
  /* -------------------------------------------------------------------- */
  const onStatusChange = useCallback(
    async (
      newStatus: "active" | "skipped" | "none",
      meal: any,
      mealDate: Date,
      slotKey: string
    ) => {
      /* no network call when flipping back to "none" */
      if (newStatus === "none") {
        setStatusMap((p) => ({ ...p, [slotKey]: { status: "none" } }))
        return
      }

      try {
        const res = await createMainMeal({
          userId: user._id,
          mealId: meal._id,
          date: mealDate.toISOString(),
          status: newStatus,
        }).unwrap()

        setStatusMap((p) => ({
          ...p,
          [slotKey]: { status: newStatus, mainId: res.data._id },
        }))
      } catch (err) {
        console.error("Status update failed", err)
      }
    },
    [createMainMeal, user?._id]
  )

  if (isFetching || isLoadingMain) return <div className="p-8">Loading…</div>

  /* -------------------------------------------------------------------- */
  /*                               JSX                                     */
  /* -------------------------------------------------------------------- */
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">
        🍽️ You are under{" "}
        <span className="text-green-600">{capitalize(user?.subscription ?? "")}</span>{" "}
        package.
      </h1>

      <div className="overflow-x-auto">
        <table className="min-w-[700px] w-full text-left border">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-3 w-56">📅 Day & Date</th>
              <th className="px-4 py-3 w-96">🍱 Lunch</th>
              <th className="px-4 py-3 w-96">🌙 Dinner</th>
            </tr>
          </thead>

          <tbody>
            {WEEK_DAYS.map((day) => {
              const { lunch, dinner } = mealsByDay[day]
              const dateObj = dateForDay(day)
              const today = new Date().toDateString() === dateObj.toDateString()

              return (
                <tr key={day} className="border-t">
                  {/* Day column */}
                  <td className="px-4 py-4 font-medium align-top">
                    <div>{capitalize(day)}</div>
                    <div className="text-sm text-gray-500">{fmt(dateObj)}</div>
                  </td>

                  {/* Lunch */}
                  <td className="px-4 py-4 align-top">
                    {lunch ? (
                      <MealCell
                        meal={lunch}
                        dateObj={dateObj}
                        disabled={today}
                        slotKey={`${lunch._id}-${dateKey(dateObj)}`}
                        statusMap={statusMap}
                        onStatusChange={onStatusChange}
                      />
                    ) : (
                      "—"
                    )}
                  </td>

                  {/* Dinner */}
                  <td className="px-4 py-4 align-top">
                    {dinner ? (
                      <MealCell
                        meal={dinner}
                        dateObj={dateObj}
                        disabled={today}
                        slotKey={`${dinner._id}-${dateKey(dateObj)}`}
                        statusMap={statusMap}
                        onStatusChange={onStatusChange}
                      />
                    ) : (
                      "—"
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*                                Meal cell                                   */
/* -------------------------------------------------------------------------- */

interface MealCellProps {
  meal: any
  dateObj: Date
  disabled: boolean
  slotKey: string
  statusMap: Record<string, { status: "active" | "skipped" | "none" }>
  onStatusChange: (
    status: "active" | "skipped" | "none",
    meal: any,
    dateObj: Date,
    slotKey: string
  ) => void
}

function MealCell({
  meal,
  dateObj,
  disabled,
  slotKey,
  statusMap,
  onStatusChange,
}: MealCellProps) {
  const current = statusMap[slotKey]?.status ?? "none"

  /* colour according to status */
  const bg =
    current === "active"
      ? "bg-green-50 ring-1 ring-green-200"
      : current === "skipped"
      ? "bg-red-50 ring-1 ring-red-200"
      : "bg-white"

  return (
    <div className={`flex gap-3 p-2 rounded-md ${bg}`}>
      {/* img */}
      <div className="relative w-16 h-16 shrink-0 rounded overflow-hidden">
        <Image
          src={meal.image}
          alt={meal.name}
          fill
          sizes="64px"
          className="object-cover"
        />
      </div>

      {/* info + selector */}
      <div className="flex-1">
        <h4 className="font-semibold mb-1">{meal.name}</h4>
        <ul className="flex flex-wrap gap-2 text-sm text-gray-600">
          {meal.ingredients.map((ing: any) => (
            <li key={ing._id}>
              {ing.name.trim()}{" "}
              <span className="text-xs text-gray-400">
                ({ing.quantity}
                {ing.unit})
              </span>
            </li>
          ))}
        </ul>
        <p className="text-sm mt-1">৳ {meal.price}</p>

        <select
          value={current}
          disabled={disabled}
          onChange={(e) =>
            onStatusChange(
              e.target.value as "active" | "skipped" | "none",
              meal,
              dateObj,
              slotKey
            )
          }
          className={`mt-2 border rounded px-2 py-1 text-sm ${
            disabled ? "bg-gray-200 text-gray-500 cursor-not-allowed" : ""
          }`}
        >
          <option value="none">None</option>
          <option value="active">Active</option>
          <option value="skipped">Skipped</option>
        </select>
      </div>
    </div>
  )
}
