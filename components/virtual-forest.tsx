"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TreePlantingWizard } from "@/components/tree-planting-wizard"
import { TreePine, Plus, Leaf } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"

interface VirtualForestProps {
  trees: number
  goal: number
  onPlantTree: () => void
}

export function VirtualForest({ trees, goal, onPlantTree }: VirtualForestProps) {
  const [showWizard, setShowWizard] = useState(false)
  const { toast } = useToast()

  const progress = (trees / goal) * 100

  const handleComplete = () => {
    setShowWizard(false)
    onPlantTree()
    toast({
      title: "Tree Planted!",
      description: "Your tree has been added to your virtual forest.",
      variant: "success",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TreePine className="h-5 w-5 text-primary" />
          Your Virtual Forest
        </CardTitle>
        <CardDescription>
          Track your tree planting progress and impact
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Progress to Goal</span>
              <span className="text-sm text-muted-foreground">
                {trees} / {goal} trees
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <div className="grid gap-4">
            <div className="flex items-center justify-between p-4 bg-primary/5 rounded-lg">
              <div className="space-y-1">
                <p className="text-sm font-medium">Trees Planted</p>
                <p className="text-2xl font-bold">{trees}</p>
              </div>
              <TreePine className="h-8 w-8 text-primary" />
            </div>

            <div className="flex items-center justify-between p-4 bg-primary/5 rounded-lg">
              <div className="space-y-1">
                <p className="text-sm font-medium">Carbon Offset</p>
                <p className="text-2xl font-bold">{trees * 48} kg</p>
              </div>
              <Leaf className="h-8 w-8 text-primary" />
            </div>
          </div>

          <Button
            onClick={() => setShowWizard(true)}
            className="w-full bg-primary hover:bg-primary/90"
          >
            <Plus className="mr-2 h-4 w-4" />
            Plant a Tree
          </Button>
        </div>
      </CardContent>

      {showWizard && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <TreePlantingWizard
            onComplete={handleComplete}
            onCancel={() => setShowWizard(false)}
          />
        </div>
      )}
    </Card>
  )
}
