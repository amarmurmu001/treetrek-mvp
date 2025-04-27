"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/hooks/use-toast"
import { Progress } from "@/components/ui/progress"
import { Gift, Leaf, Package, Truck } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { redeemReward } from "@/lib/supabase-service"
import { supabase } from "@/lib/supabase"

interface Reward {
  id: string
  name: string
  description: string
  cost: number
  image_url: string
}

export function RewardRedemption() {
  const [rewards, setRewards] = useState<Reward[]>([])
  const [selectedReward, setSelectedReward] = useState<string>("")
  const [quantity, setQuantity] = useState<number>(1)
  const [loading, setLoading] = useState(true)
  const { user, userData } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    fetchRewards()
  }, [])

  const fetchRewards = async () => {
    try {
      const { data, error } = await supabase
        .from('rewards')
        .select('*')
        .order('cost', { ascending: true })

      if (error) throw error
      setRewards(data || [])
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

  const handleRedeem = async (rewardId: string, cost: number) => {
    if (!user || !userData) {
      toast({
        title: "Error",
        description: "Please sign in to redeem rewards.",
        variant: "destructive"
      })
      return
    }

    if (userData.coins < cost) {
      toast({
        title: "Insufficient Coins",
        description: "You don't have enough coins to redeem this reward.",
        variant: "destructive"
      })
      return
    }

    try {
      await redeemReward(user.id, rewardId, 1)
      toast({
        title: "Success",
        description: "Reward redeemed successfully!"
      })
      // Refresh user data to update coin balance
      window.location.reload()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to redeem reward. Please try again.",
        variant: "destructive"
      })
    }
  }

  if (loading) {
    return <div>Loading rewards...</div>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {rewards.map((reward) => (
        <Card key={reward.id}>
          <CardHeader>
            <CardTitle>{reward.name}</CardTitle>
            <CardDescription>{reward.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <img
              src={reward.image_url}
              alt={reward.name}
              className="w-full h-48 object-cover rounded-md"
            />
          </CardContent>
          <CardFooter className="flex justify-between items-center">
            <div className="text-sm font-medium">
              {reward.cost} coins
            </div>
            <Button
              onClick={() => handleRedeem(reward.id, reward.cost)}
              disabled={!user || !userData || userData.coins < reward.cost}
            >
              Redeem
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
