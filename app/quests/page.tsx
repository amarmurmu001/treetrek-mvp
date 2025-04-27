"use client"

import { Calendar, Filter, MapPin, Plus, TreePine, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardShell } from "@/components/dashboard-shell"
import { QuestCard } from "@/components/quest-card"

export default function QuestsPage() {
  return (
    <DashboardShell>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-primary">Quests</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" /> Filter
          </Button>
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="mr-2 h-4 w-4" /> Create Quest
          </Button>
        </div>
      </div>

      <Tabs defaultValue="active" className="mt-8">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="active">Active Quests</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="guild">Guild Quests</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <QuestCard
              title="Community Planter"
              description="Plant 5 trees in your local community park"
              reward={250}
              progress={60}
              icon={<MapPin className="h-5 w-5" />}
              dueDate="3 days left"
            />
            <QuestCard
              title="Eco Educator"
              description="Organize a tree planting workshop for beginners"
              reward={500}
              progress={30}
              icon={<Users className="h-5 w-5" />}
              dueDate="7 days left"
            />
            <QuestCard
              title="Seasonal Planter"
              description="Plant 3 seasonal native trees in your area"
              reward={300}
              progress={0}
              icon={<Calendar className="h-5 w-5" />}
              dueDate="14 days left"
            />
            <QuestCard
              title="Urban Forester"
              description="Plant 2 trees in an urban environment"
              reward={200}
              progress={50}
              icon={<MapPin className="h-5 w-5" />}
              dueDate="5 days left"
            />
            <QuestCard
              title="Sapling Savior"
              description="Rescue and replant 3 endangered saplings"
              reward={400}
              progress={33}
              icon={<TreePine className="h-5 w-5" />}
              dueDate="10 days left"
            />
            <QuestCard
              title="Tree Diversity Champion"
              description="Plant 3 different species of trees"
              reward={350}
              progress={66}
              icon={<TreePine className="h-5 w-5" />}
              dueDate="8 days left"
            />
          </div>
        </TabsContent>

        <TabsContent value="completed" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <QuestCard
              title="First Planting"
              description="Plant your first tree and document it"
              reward={100}
              progress={100}
              completed={true}
              icon={<TreePine className="h-5 w-5" />}
              dueDate="Completed"
            />
            <QuestCard
              title="Tree Guardian"
              description="Care for a newly planted tree for 2 weeks"
              reward={150}
              progress={100}
              completed={true}
              icon={<TreePine className="h-5 w-5" />}
              dueDate="Completed"
            />
            <QuestCard
              title="Social Sharer"
              description="Share your tree planting journey on social media"
              reward={75}
              progress={100}
              completed={true}
              icon={<Users className="h-5 w-5" />}
              dueDate="Completed"
            />
          </div>
        </TabsContent>

        <TabsContent value="guild" className="mt-4">
          <Card className="mb-4">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-primary">Forest Guardians Guild</CardTitle>
              <CardDescription>Guild quests are collaborative efforts with bonus rewards</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <QuestCard
                  title="Forest Revival"
                  description="Plant 100 trees collectively as a guild"
                  reward={2000}
                  progress={78}
                  isGuildQuest={true}
                  icon={<Users className="h-5 w-5" />}
                  dueDate="15 days left"
                />
                <QuestCard
                  title="Community Outreach"
                  description="Organize 3 tree planting events in your communities"
                  reward={1500}
                  progress={33}
                  isGuildQuest={true}
                  icon={<Users className="h-5 w-5" />}
                  dueDate="20 days left"
                />
                <QuestCard
                  title="Eco Education"
                  description="Educate 50 people about the importance of trees"
                  reward={1000}
                  progress={60}
                  isGuildQuest={true}
                  icon={<Users className="h-5 w-5" />}
                  dueDate="12 days left"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quest Categories */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold tracking-tight text-primary mb-4">Quest Categories</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-primary/5 hover:bg-primary/10 transition-colors cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TreePine className="h-5 w-5 text-primary" />
                <span>Planting Quests</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Missions focused on planting trees in various environments
              </p>
            </CardContent>
          </Card>
          <Card className="bg-primary/5 hover:bg-primary/10 transition-colors cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <span>Community Quests</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Missions that involve organizing events and educating others
              </p>
            </CardContent>
          </Card>
          <Card className="bg-primary/5 hover:bg-primary/10 transition-colors cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                <span>Seasonal Quests</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Special missions that change with the seasons</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardShell>
  )
}
