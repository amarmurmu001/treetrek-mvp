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
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface Reward {
  id: string
  name: string
  description: string
  cost: number
  image_url: string
}

interface RewardRedemptionProps {
  reward: Reward
  userCoins: number
  onClose: () => void
  onComplete: () => void
}

export function RewardRedemption({ reward, userCoins, onClose, onComplete }: RewardRedemptionProps) {
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()
  const { toast } = useToast()

  const handleRedeem = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "Please sign in to redeem rewards.",
        variant: "destructive"
      })
      return
    }

    if (userCoins < reward.cost * quantity) {
      toast({
        title: "Insufficient Coins",
        description: "You don't have enough coins to redeem this reward.",
        variant: "destructive"
      })
      return
    }

    try {
      setLoading(true)
      await redeemReward(user.id, reward.id, quantity)
      onComplete()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to redeem reward. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Redeem {reward.name}</DialogTitle>
          <DialogDescription>
            {reward.description}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex items-center justify-between">
            <Label>Quantity</Label>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                -
              </Button>
              <Input
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-16 text-center"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(quantity + 1)}
              >
                +
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <Label>Total Cost</Label>
            <span className="font-medium">{reward.cost * quantity} Green Coins</span>
          </div>
          <div className="flex items-center justify-between">
            <Label>Your Balance</Label>
            <span className="font-medium">{userCoins} Green Coins</span>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleRedeem}
            disabled={loading || userCoins < reward.cost * quantity}
          >
            {loading ? "Redeeming..." : "Redeem Reward"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
