"use client"

import { useAuth } from "@/lib/auth-context"
import { Nav } from "@/components/nav"

export function LayoutContent({ children }: { children: React.ReactNode }) {
  const { userData } = useAuth()
  
  return (
    <div className="flex min-h-screen flex-col">
      <Nav userCoins={userData?.coins} />
      <main className="flex-1">
        {children}
      </main>
    </div>
  )
} 