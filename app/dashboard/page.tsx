"use client"

import { ProtectedRoute } from "@/components/auth/protected-route"
import { DashboardShell } from "@/components/dashboard-shell"
import { VirtualForest } from "@/components/virtual-forest"
import { LeaderboardTable } from "@/components/leaderboard-table"
import { useAuth } from "@/lib/auth-context"

export default function DashboardPage() {
  const { userData } = useAuth()

  return (
    <ProtectedRoute>
      <DashboardShell>
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight text-primary">Dashboard</h1>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <div className="col-span-4">
            <VirtualForest
              trees={userData?.trees || 0}
              goal={100}
              onPlantTree={() => {}}
            />
          </div>
          <div className="col-span-3">
            <LeaderboardTable />
          </div>
        </div>
      </DashboardShell>
    </ProtectedRoute>
  )
}
