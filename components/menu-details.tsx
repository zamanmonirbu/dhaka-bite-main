"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"

// This would come from your API in a real application
const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

interface MenuItem {
  id: number
  name: string
  description: string
  image: string
}

interface MenuDay {
  day: string
  items: MenuItem[]
}

// Sample data - in a real app, this would come from your API
const generateSampleMenu = (packageType: string): MenuDay[] => {
  return weekdays.map((day, index) => ({
    day,
    items: [
      {
        id: index * 3 + 1,
        name: `${packageType} Rice Dish`,
        description: "Freshly cooked rice with seasonal vegetables and protein",
        image: `/placeholder.svg?height=200&width=200&query=delicious ${packageType} rice dish`,
      },
      {
        id: index * 3 + 2,
        name: `${packageType} Protein Option`,
        description: "High-quality protein prepared with special spices",
        image: `/placeholder.svg?height=200&width=200&query=tasty ${packageType} protein dish`,
      },
      {
        id: index * 3 + 3,
        name: `${packageType} Side Dish`,
        description: "Complementary side dish to complete your meal",
        image: `/placeholder.svg?height=200&width=200&query=healthy ${packageType} side dish`,
      },
    ],
  }))
}

interface MenuDetailsProps {
  packageType: "Basic" | "Standard" | "Premium"
}

export default function MenuDetails({ packageType }: MenuDetailsProps) {
  const [menuData, setMenuData] = useState<MenuDay[]>(generateSampleMenu(packageType))

  return (
    <div className="container-custom py-8">
      <h2 className="text-3xl font-bold mb-6">{packageType} Menu</h2>
      <p className="mb-8">
        Our {packageType.toLowerCase()} menu offers delicious, nutritious meals for every day of the week. Each meal is
        freshly prepared and delivered to your doorstep.
      </p>

      <Tabs defaultValue={weekdays[0].toLowerCase()}>
        <TabsList className="grid grid-cols-7 mb-8">
          {weekdays.map((day) => (
            <TabsTrigger key={day} value={day.toLowerCase()}>
              {day}
            </TabsTrigger>
          ))}
        </TabsList>

        {menuData.map((menuDay) => (
          <TabsContent key={menuDay.day} value={menuDay.day.toLowerCase()}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {menuDay.items.map((item) => (
                <Card key={item.id}>
                  <CardHeader className="p-0">
                    <div className="relative h-48 w-full">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        fill
                        className="object-cover rounded-t-lg"
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <CardTitle>{item.name}</CardTitle>
                    <CardDescription className="mt-2">{item.description}</CardDescription>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full bg-primary hover:bg-primary/90">Add to Order</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
