"use client"

import { useState } from "react"
import { Leaf, ShoppingBag, TreePine, Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardShell } from "@/components/dashboard-shell"
import { RewardCard } from "@/components/reward-card"
import { RewardRedemption } from "@/components/reward-redemption"
import { useToast } from "@/hooks/use-toast"

export default function RewardsPage() {
  const [userCoins, setUserCoins] = useState(1250)
  const [selectedReward, setSelectedReward] = useState<any>(null)
  const { toast } = useToast()

  const handleRewardSelect = (reward: any) => {
    setSelectedReward(reward)
  }

  const handleRedemptionComplete = () => {
    setUserCoins(userCoins - selectedReward.cost)
    setSelectedReward(null)
    toast({
      title: "Reward Redeemed",
      description: `You have successfully redeemed ${selectedReward.title}!`,
      variant: "success",
    })
  }

  const rewards = {
    cash: [
      {
        id: "cash1",
        title: "$10 Cash Reward",
        description: "Redeem your Green Coins for real cash",
        cost: 1000,
        image: "/placeholder.svg?height=200&width=300",
        category: "cash",
        icon: <Wallet className="h-5 w-5" />,
      },
      {
        id: "cash2",
        title: "$25 Cash Reward",
        description: "Redeem your Green Coins for real cash",
        cost: 2500,
        image: "/placeholder.svg?height=200&width=300",
        category: "cash",
        icon: <Wallet className="h-5 w-5" />,
      },
      {
        id: "cash3",
        title: "$50 Cash Reward",
        description: "Redeem your Green Coins for real cash",
        cost: 5000,
        image: "/placeholder.svg?height=200&width=300",
        category: "cash",
        icon: <Wallet className="h-5 w-5" />,
      },
    ],
    products: [
      {
        id: "product1",
        title: "Eco-Friendly Water Bottle",
        description: "Sustainable stainless steel water bottle",
        cost: 750,
        image: "/placeholder.svg?height=200&width=300",
        category: "product",
        icon: <ShoppingBag className="h-5 w-5" />,
      },
      {
        id: "product2",
        title: "Organic Plant Seeds",
        description: "Start your own garden with these organic seeds",
        cost: 350,
        image: "/placeholder.svg?height=200&width=300",
        category: "product",
        icon: <ShoppingBag className="h-5 w-5" />,
      },
      {
        id: "product3",
        title: "Bamboo Cutlery Set",
        description: "Portable and reusable bamboo cutlery",
        cost: 600,
        image: "/placeholder.svg?height=200&width=300",
        category: "product",
        icon: <ShoppingBag className="h-5 w-5" />,
      },
    ],
    forest: [
      {
        id: "forest1",
        title: "Rare Oak Tree",
        description: "Add a majestic oak tree to your virtual forest",
        cost: 500,
        image: "/placeholder.svg?height=200&width=300",
        category: "forest",
        icon: <TreePine className="h-5 w-5" />,
      },
      {
        id: "forest2",
        title: "Forest Waterfall",
        description: "Add a beautiful waterfall to your virtual forest",
        cost: 1200,
        image: "/placeholder.svg?height=200&width=300",
        category: "forest",
        icon: <TreePine className="h-5 w-5" />,
      },
      {
        id: "forest3",
        title: "Wildlife Pack",
        description: "Add various animals to your virtual forest ecosystem",
        cost: 800,
        image: "/placeholder.svg?height=200&width=300",
        category: "forest",
        icon: <TreePine className="h-5 w-5" />,
      },
    ],
  }

  const allRewards = [...rewards.cash, ...rewards.products, ...rewards.forest]

  return (
    <DashboardShell>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-primary">Rewards</h1>
        <div className="flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-lg">
          <Leaf className="h-5 w-5 text-primary" />
          <span className="font-bold text-primary">{userCoins} Green Coins</span>
        </div>
      </div>

      <Tabs defaultValue="all" className="mt-6">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="cash">Cash</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="forest">Forest</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4">
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {allRewards.map((reward) => (
              <RewardCard key={reward.id} {...reward} onSelect={() => handleRewardSelect(reward)} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="cash" className="mt-4">
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {rewards.cash.map((reward) => (
              <RewardCard key={reward.id} {...reward} onSelect={() => handleRewardSelect(reward)} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="products" className="mt-4">
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {rewards.products.map((reward) => (
              <RewardCard key={reward.id} {...reward} onSelect={() => handleRewardSelect(reward)} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="forest" className="mt-4">
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {rewards.forest.map((reward) => (
              <RewardCard key={reward.id} {...reward} onSelect={() => handleRewardSelect(reward)} />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* How Rewards Work */}
      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl font-bold text-primary">How Rewards Work</CardTitle>
            <CardDescription>Learn how to earn and redeem Green Coins</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-3">
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <TreePine className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-medium">Plant Trees</h3>
                <p className="text-sm text-muted-foreground">
                  Earn Green Coins for every verified tree you plant in the real world
                </p>
              </div>
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Leaf className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-medium">Complete Quests</h3>
                <p className="text-sm text-muted-foreground">
                  Earn bonus coins by completing eco-challenges and missions
                </p>
              </div>
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Wallet className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-medium">Redeem Rewards</h3>
                <p className="text-sm text-muted-foreground">
                  Exchange your coins for cash, products, or virtual forest upgrades
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {selectedReward && (
        <RewardRedemption
          reward={selectedReward}
          userCoins={userCoins}
          onClose={() => setSelectedReward(null)}
          onComplete={handleRedemptionComplete}
        />
      )}
    </DashboardShell>
  )
}
