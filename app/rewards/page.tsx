"use client"

import { useState, useEffect } from "react"
import { Leaf, ShoppingBag, TreePine, Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardShell } from "@/components/dashboard-shell"
import { RewardCard } from "@/components/reward-card"
import { RewardRedemption } from "@/components/reward-redemption"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/lib/auth-context"
import { getRewards } from "@/lib/supabase-service"

interface Reward {
  id: string
  name: string
  description: string
  cost: number
  image_url: string
  category: 'cash' | 'product' | 'forest'
}

export default function RewardsPage() {
  const [rewards, setRewards] = useState<Reward[]>([])
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null)
  const [loading, setLoading] = useState(true)
  const { userData } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    fetchRewards()
  }, [])

  const fetchRewards = async () => {
    try {
      setLoading(true)
      const data = await getRewards()
      setRewards(data as Reward[])
    } catch (error) {
      console.error('Error fetching rewards:', error)
      toast({
        title: "Error",
        description: "Failed to load rewards. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleRewardSelect = (reward: Reward) => {
    setSelectedReward(reward)
  }

  const handleRedemptionComplete = () => {
    if (selectedReward) {
      toast({
        title: "Reward Redeemed",
        description: `You have successfully redeemed ${selectedReward.name}!`,
        variant: "success",
      })
      setSelectedReward(null)
      // Refresh user data to update coin balance
      window.location.reload()
    }
  }

  const filteredRewards = {
    cash: rewards.filter(reward => reward.category === 'cash'),
    products: rewards.filter(reward => reward.category === 'product'),
    forest: rewards.filter(reward => reward.category === 'forest')
  }

  if (loading) {
    return (
      <DashboardShell>
        <div className="flex items-center justify-center h-64">
          Loading rewards...
        </div>
      </DashboardShell>
    )
  }

  return (
    <DashboardShell>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-primary">Rewards</h1>
        <div className="flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-lg">
          <Leaf className="h-5 w-5 text-primary" />
          <span className="font-bold text-primary">{userData?.coins || 0} Green Coins</span>
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
            {rewards.map((reward) => (
              <RewardCard key={reward.id} {...reward} onSelect={() => handleRewardSelect(reward)} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="cash" className="mt-4">
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {filteredRewards.cash.map((reward) => (
              <RewardCard key={reward.id} {...reward} onSelect={() => handleRewardSelect(reward)} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="products" className="mt-4">
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {filteredRewards.products.map((reward) => (
              <RewardCard key={reward.id} {...reward} onSelect={() => handleRewardSelect(reward)} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="forest" className="mt-4">
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {filteredRewards.forest.map((reward) => (
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
          userCoins={userData?.coins || 0}
          onClose={() => setSelectedReward(null)}
          onComplete={handleRedemptionComplete}
        />
      )}
    </DashboardShell>
  )
}
