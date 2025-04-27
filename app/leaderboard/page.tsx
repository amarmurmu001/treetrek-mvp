import { Globe, MapPin, Trophy, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardShell } from "@/components/dashboard-shell"
import { LeaderboardTable } from "@/components/leaderboard-table"

export default function LeaderboardPage() {
  return (
    <DashboardShell>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-primary">Leaderboard</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Trophy className="mr-2 h-4 w-4" /> Your Rank: #42
          </Button>
        </div>
      </div>

      <Tabs defaultValue="global" className="mt-8">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="global">
            <Globe className="mr-2 h-4 w-4" /> Global
          </TabsTrigger>
          <TabsTrigger value="local">
            <MapPin className="mr-2 h-4 w-4" /> Local
          </TabsTrigger>
          <TabsTrigger value="guilds">
            <Users className="mr-2 h-4 w-4" /> Guilds
          </TabsTrigger>
        </TabsList>

        <TabsContent value="global" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-bold text-primary">Global Eco-Warriors</CardTitle>
              <CardDescription>Top tree planters from around the world</CardDescription>
            </CardHeader>
            <CardContent>
              <LeaderboardTable isGlobal={true} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="local" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-bold text-primary">Local Heroes</CardTitle>
              <CardDescription>Top tree planters in your area</CardDescription>
            </CardHeader>
            <CardContent>
              <LeaderboardTable isLocal={true} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="guilds" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-bold text-primary">Top Green Guilds</CardTitle>
              <CardDescription>Most impactful guilds by trees planted</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <table className="w-full caption-bottom text-sm">
                  <thead className="border-b bg-muted/50">
                    <tr className="text-left">
                      <th className="h-12 px-4 font-medium">Rank</th>
                      <th className="h-12 px-4 font-medium">Guild</th>
                      <th className="h-12 px-4 font-medium">Members</th>
                      <th className="h-12 px-4 font-medium">Trees Planted</th>
                      <th className="h-12 px-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { rank: 1, name: "Forest Guardians", members: 124, trees: 1245 },
                      { rank: 2, name: "Green Pioneers", members: 98, trees: 987 },
                      { rank: 3, name: "Earth Defenders", members: 156, trees: 876 },
                      { rank: 4, name: "Tree Huggers", members: 67, trees: 754 },
                      { rank: 5, name: "Eco Warriors", members: 89, trees: 698 },
                      { rank: 6, name: "Nature's Allies", members: 112, trees: 645 },
                      { rank: 7, name: "Planet Protectors", members: 78, trees: 587 },
                      { rank: 8, name: "Green Thumbs", members: 45, trees: 432 },
                      { rank: 9, name: "Woodland Friends", members: 56, trees: 398 },
                      { rank: 10, name: "Canopy Crew", members: 34, trees: 345 },
                    ].map((guild) => (
                      <tr key={guild.rank} className="border-b">
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            {guild.rank <= 3 ? (
                              <Trophy
                                className={`h-5 w-5 ${
                                  guild.rank === 1
                                    ? "text-yellow-500"
                                    : guild.rank === 2
                                      ? "text-gray-400"
                                      : "text-amber-700"
                                }`}
                              />
                            ) : (
                              <span className="font-medium">{guild.rank}</span>
                            )}
                          </div>
                        </td>
                        <td className="p-4 font-medium">{guild.name}</td>
                        <td className="p-4">{guild.members}</td>
                        <td className="p-4">{guild.trees}</td>
                        <td className="p-4">
                          <Button size="sm" variant="outline">
                            View
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Achievements */}
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold text-primary">Top Achievements</CardTitle>
            <CardDescription>Notable milestones from our Eco-Warriors</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-primary/5 rounded-lg">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Trophy className="h-6 w-6 text-yellow-500" />
                </div>
                <div>
                  <p className="font-medium">EcoWarrior92 planted 1,000 trees!</p>
                  <p className="text-sm text-muted-foreground">A new global record for individual tree planting</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-primary/5 rounded-lg">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Forest Guardians Guild reached 10,000 trees!</p>
                  <p className="text-sm text-muted-foreground">First guild to reach this impressive milestone</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-primary/5 rounded-lg">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Seattle, USA becomes first Green City!</p>
                  <p className="text-sm text-muted-foreground">Over 5,000 trees planted by local Eco-Warriors</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  )
}
