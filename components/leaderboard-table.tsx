"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trophy, Leaf, Search, Filter, TreePine } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { getLeaderboard } from "@/lib/supabase-service"
import { useToast } from "@/hooks/use-toast"

interface LeaderboardEntry {
  id: string
  name: string
  trees: number
  coins: number
  streak: number
  last_active: string
}

export function LeaderboardTable() {
  const [searchQuery, setSearchQuery] = useState("")
  const [timeFilter, setTimeFilter] = useState<'all' | 'month' | 'week'>('all')
  const [sortBy, setSortBy] = useState<"trees" | "coins" | "streak">("trees")
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchLeaderboard()
  }, [timeFilter])

  const fetchLeaderboard = async () => {
    try {
      setLoading(true)
      const data = await getLeaderboard(timeFilter)
      setLeaderboard(data as LeaderboardEntry[])
    } catch (error) {
      console.error("Error fetching leaderboard:", error)
      toast({
        title: "Error",
        description: "Failed to load leaderboard. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const filteredData = leaderboard
    .filter(entry => 
      entry.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "trees":
          return b.trees - a.trees
        case "coins":
          return b.coins - a.coins
        case "streak":
          return b.streak - a.streak
        default:
          return 0
      }
    })

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "text-yellow-500"
      case 2:
        return "text-gray-400"
      case 3:
        return "text-amber-600"
      default:
        return "text-gray-600"
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading leaderboard...</div>
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-green-700" />
          Global Leaderboard
        </CardTitle>
        <CardDescription>
          Top Eco-Warriors making a difference
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={timeFilter} onValueChange={(value: 'all' | 'month' | 'week') => setTimeFilter(value)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select time period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={(value) => setSortBy(value as "trees" | "coins" | "streak")}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="trees">Trees Planted</SelectItem>
                  <SelectItem value="coins">Green Coins</SelectItem>
                  <SelectItem value="streak">Streak</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rank</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Trees</TableHead>
                <TableHead>Coins</TableHead>
                <TableHead>Streak</TableHead>
                <TableHead>Last Active</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((entry, index) => (
                <TableRow key={entry.id}>
                  <TableCell>
                    <span className={`font-bold ${getRankColor(index + 1)}`}>
                      #{index + 1}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                        <img
                          src={`/avatars/${(index % 3) + 1}.png`}
                          alt={entry.name}
                          className="w-6 h-6 rounded-full"
                        />
                      </div>
                      <span className="font-medium">{entry.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <TreePine className="h-4 w-4 text-green-700" />
                        <span className="font-medium">{entry.trees}</span>
                      </div>
                      <Progress
                        value={(entry.trees / (filteredData[0]?.trees || 1)) * 100}
                        className="h-1"
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Leaf className="h-4 w-4 text-green-700" />
                      <span className="font-medium">{entry.coins.toLocaleString()}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{entry.streak}</span>
                      <span className="text-sm text-gray-500">days</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-500">
                      {new Date(entry.last_active).toLocaleDateString()}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
