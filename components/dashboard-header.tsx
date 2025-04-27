"use client"

import { Bell, Leaf, Menu, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { MobileNav } from "@/components/mobile-nav"

interface DashboardHeaderProps {
  userCoins?: number
}

export function DashboardHeader({ userCoins }: DashboardHeaderProps) {
  return (
    <div className="sticky top-16 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center px-4 sm:px-8">
        <div className="hidden md:flex items-center space-x-4 lg:space-x-6 mr-auto">
          {userCoins !== undefined && (
            <div className="flex items-center gap-1 bg-primary/10 px-3 py-1 rounded-full">
              <Leaf className="h-4 w-4 text-primary" />
              <span className="font-medium text-primary">{userCoins} Coins</span>
            </div>
          )}
        </div>

        <div className="hidden md:flex items-center ml-auto space-x-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search..." className="w-[200px] lg:w-[300px] pl-8" />
          </div>

          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
              3
            </span>
          </Button>
        </div>

        {/* Mobile display of coins */}
        {userCoins !== undefined && (
          <div className="md:hidden flex items-center gap-1 bg-primary/10 px-2 py-1 rounded-full mr-2">
            <Leaf className="h-3 w-3 text-primary" />
            <span className="font-medium text-primary text-xs">{userCoins}</span>
          </div>
        )}

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden ml-auto">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="pr-0">
            <MobileNav userCoins={userCoins} />
          </SheetContent>
        </Sheet>
      </div>
    </div>
  )
}
