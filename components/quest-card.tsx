import type React from "react"
import { Leaf } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface QuestCardProps {
  title: string
  description: string
  reward: number
  progress: number
  icon: React.ReactNode
  dueDate: string
  completed?: boolean
  isGuildQuest?: boolean
}

export function QuestCard({
  title,
  description,
  reward,
  progress,
  icon,
  dueDate,
  completed = false,
  isGuildQuest = false,
}: QuestCardProps) {
  return (
    <Card className={completed ? "bg-gray-50" : ""}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <div
              className={`h-8 w-8 rounded-full ${completed ? "bg-gray-100" : "bg-green-100"} flex items-center justify-center`}
            >
              {icon}
            </div>
            <CardTitle className="text-base font-bold">{title}</CardTitle>
          </div>
          {isGuildQuest && (
            <div className="bg-green-100 px-2 py-1 rounded text-xs font-medium text-green-800">Guild</div>
          )}
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-sm text-muted-foreground">{description}</p>
        <div className="flex items-center gap-2 mt-4">
          <Leaf className="h-4 w-4 text-green-700" />
          <span className="text-sm font-medium">{reward} Green Coins</span>
        </div>
        <div className="mt-4 space-y-2">
          <div className="flex justify-between text-xs">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-2">
        <div className="text-xs text-muted-foreground">{dueDate}</div>
        {completed ? (
          <Button size="sm" variant="outline" disabled>
            Completed
          </Button>
        ) : (
          <Button size="sm" className="bg-green-700 hover:bg-green-800">
            {progress > 0 ? "Continue" : "Start"}
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
