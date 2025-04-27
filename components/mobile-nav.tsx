import Link from "next/link"
import { Award, Home, Leaf, LogOut, Settings, ShoppingBag, TreePine, Trophy, User, Users } from "lucide-react"

interface MobileNavProps {
  userCoins?: number
}

export function MobileNav({ userCoins }: MobileNavProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 font-bold text-xl text-green-700 p-4">
        <TreePine className="h-6 w-6" />
        <span>TreeTrek</span>
      </div>

      <div className="flex items-center gap-4 p-4 border-b">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
          <User className="h-5 w-5 text-green-700" />
        </div>
        <div>
          <p className="text-sm font-medium">EcoWarrior42</p>
          <p className="text-xs text-muted-foreground">Level 3 Eco-Warrior</p>
        </div>
      </div>

      {userCoins !== undefined && (
        <div className="mx-4 mt-4 flex items-center gap-1 bg-green-100 px-3 py-2 rounded-md">
          <Leaf className="h-4 w-4 text-green-700" />
          <span className="font-medium text-green-800">{userCoins} Green Coins</span>
        </div>
      )}

      <div className="flex-1 overflow-auto py-2">
        <nav className="grid gap-1 px-2">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium hover:bg-green-100"
          >
            <Home className="h-5 w-5 text-green-700" />
            Dashboard
          </Link>
          <Link
            href="/quests"
            className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium hover:bg-green-100"
          >
            <Leaf className="h-5 w-5 text-green-700" />
            Quests
          </Link>
          <Link
            href="/rewards"
            className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium hover:bg-green-100"
          >
            <ShoppingBag className="h-5 w-5 text-green-700" />
            Rewards
          </Link>
          <Link
            href="/leaderboard"
            className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium hover:bg-green-100"
          >
            <Trophy className="h-5 w-5 text-green-700" />
            Leaderboard
          </Link>
          <Link
            href="/guilds"
            className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium hover:bg-green-100"
          >
            <Users className="h-5 w-5 text-green-700" />
            Guilds
          </Link>
          <Link
            href="/achievements"
            className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium hover:bg-green-100"
          >
            <Award className="h-5 w-5 text-green-700" />
            Achievements
          </Link>
        </nav>
      </div>

      <div className="border-t p-4">
        <nav className="grid gap-1">
          <Link
            href="/settings"
            className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium hover:bg-green-100"
          >
            <Settings className="h-5 w-5" />
            Settings
          </Link>
          <Link
            href="/"
            className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium hover:bg-green-100"
          >
            <LogOut className="h-5 w-5" />
            Log Out
          </Link>
        </nav>
      </div>
    </div>
  )
}
