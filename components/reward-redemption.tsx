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
import { useFirebase } from "@/lib/firebase-context"
import { redeemReward } from "@/lib/firebase-service"
import { collection, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"

interface Reward {
  id: string
  name: string
  description: string
  cost: number
  type: "cash" | "product" | "virtual"
  icon: React.ReactNode
}

export function RewardRedemption() {
  const { user, userData } = useFirebase()
  const [rewards, setRewards] = useState<Reward[]>([])
  const [selectedReward, setSelectedReward] = useState<string>("")
  const [quantity, setQuantity] = useState<number>(1)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const fetchRewards = async () => {
      try {
        const rewardsSnapshot = await getDocs(collection(db, 'rewards'))
        const rewardsData = rewardsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          icon: getRewardIcon(doc.data().type)
        }))
        setRewards(rewardsData as Reward[])
      } catch (error) {
        console.error("Error fetching rewards:", error)
        toast({
          title: "Error",
          description: "Could not load rewards. Please try again.",
          variant: "destructive"
        })
      }
    }

    fetchRewards()
  }, [toast])

  const getRewardIcon = (type: string) => {
    switch (type) {
      case "cash":
        return <Leaf className="h-6 w-6 text-green-700" />
      case "product":
        return <Package className="h-6 w-6 text-green-700" />
      case "virtual":
        return <Gift className="h-6 w-6 text-green-700" />
      default:
        return <Gift className="h-6 w-6 text-green-700" />
    }
  }

  const handleRedeem = async () => {
    if (!user || !selectedReward) return

    const reward = rewards.find(r => r.id === selectedReward)
    if (!reward) return

    const totalCost = reward.cost * quantity
    if (totalCost > (userData?.coins || 0)) {
      toast({
        title: "Insufficient Balance",
        description: "You don't have enough Green Coins for this reward.",
        variant: "destructive"
      })
      return
    }

    try {
      setLoading(true)
      await redeemReward(user.uid, selectedReward, quantity)
      toast({
        title: "Reward Redeemed",
        description: `Successfully redeemed ${quantity}x ${reward.name}!`
      })
      // Reset selection
      setSelectedReward("")
      setQuantity(1)
    } catch (error) {
      console.error("Error redeeming reward:", error)
      toast({
        title: "Error",
        description: "Could not redeem reward. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const selectedRewardData = rewards.find(r => r.id === selectedReward)
  const totalCost = selectedRewardData ? selectedRewardData.cost * quantity : 0
  const balance = userData?.coins || 0

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gift className="h-5 w-5 text-green-700" />
          Redeem Your Rewards
        </CardTitle>
        <CardDescription>
          Exchange your Green Coins for exciting rewards
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <Label>Available Balance</Label>
            <div className="flex items-center gap-2 text-2xl font-bold text-green-700">
              <Leaf className="h-6 w-6" />
              {balance} Green Coins
            </div>
          </div>

          <div className="space-y-4">
            <Label>Select Reward</Label>
            <RadioGroup
              value={selectedReward}
              onValueChange={setSelectedReward}
              className="grid gap-4"
            >
              {rewards.map((reward) => (
                <div key={reward.id}>
                  <RadioGroupItem
                    value={reward.id}
                    id={reward.id}
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor={reward.id}
                    className="flex items-center gap-4 rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-green-700 [&:has([data-state=checked])]:border-green-700"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                      {reward.icon}
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {reward.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {reward.description}
                      </p>
                    </div>
                    <div className="text-sm font-medium text-green-700">
                      {reward.cost} Coins
                    </div>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {selectedReward && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                />
              </div>

              <div className="space-y-2">
                <Label>Total Cost</Label>
                <div className="flex items-center gap-2 text-xl font-bold text-green-700">
                  <Leaf className="h-5 w-5" />
                  {totalCost} Green Coins
                </div>
              </div>

              <Progress
                value={(totalCost / balance) * 100}
                className="h-2"
              />
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleRedeem}
          disabled={!selectedReward || totalCost > balance || loading}
          className="w-full bg-green-700 hover:bg-green-800"
        >
          {loading ? "Processing..." : "Redeem Reward"}
        </Button>
      </CardFooter>
    </Card>
  )
}
