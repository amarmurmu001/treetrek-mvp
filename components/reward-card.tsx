"use client"

import type React from "react"
import { Leaf } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface RewardCardProps {
  id: string
  title: string
  description: string
  cost: number
  image: string
  category: "cash" | "product" | "forest"
  icon: React.ReactNode
  onSelect?: () => void
}

export function RewardCard({ title, description, cost, image, category, icon, onSelect }: RewardCardProps) {
  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="relative h-36 sm:h-48">
        <img src={image || "/placeholder.svg"} alt={title} className="w-full h-full object-cover" />
        <Badge
          className={`absolute top-2 right-2 ${
            category === "cash" ? "bg-green-700" : category === "product" ? "bg-blue-600" : "bg-amber-600"
          }`}
        >
          {category === "cash" ? "Cash Reward" : category === "product" ? "Eco Product" : "Forest Upgrade"}
        </Badge>
      </div>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">{icon}</div>
          <CardTitle className="text-base font-bold">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pb-2 flex-grow">
        <p className="text-sm text-muted-foreground">{description}</p>
        <div className="flex items-center gap-2 mt-4">
          <Leaf className="h-4 w-4 text-green-700" />
          <span className="text-sm font-medium">{cost} Green Coins</span>
        </div>
      </CardContent>
      <CardFooter className="pt-2 mt-auto">
        <Button className="w-full bg-green-700 hover:bg-green-800" onClick={onSelect}>
          Redeem Reward
        </Button>
      </CardFooter>
    </Card>
  )
}
