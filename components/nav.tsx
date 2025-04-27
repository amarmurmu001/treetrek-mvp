"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TreePine, LogOut, User, Settings, Leaf, Moon, Sun, Bell, Search, Menu } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { MobileNav } from "@/components/mobile-nav";
import { useEffect, useState } from "react";

interface NavProps {
  userCoins?: number;
}

export function Nav({ userCoins }: NavProps) {
  const pathname = usePathname();
  const { user, userData, signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const [isOffline, setIsOffline] = useState(false);
  const isDashboardPage = pathname.startsWith("/dashboard") || 
                         pathname.startsWith("/quests") || 
                         pathname.startsWith("/rewards") || 
                         pathname.startsWith("/leaderboard");

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check initial state
    setIsOffline(!navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const isActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container flex h-16 items-center px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary">
          <TreePine className="h-6 w-6" />
          <span>TreeTrek</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 ml-6">
          <Link
            href="/dashboard"
            className={`text-sm font-medium hover:underline underline-offset-4 ${
              isActive("/dashboard") ? "text-primary" : "text-muted-foreground"
            }`}
          >
            Dashboard
          </Link>
          <Link
            href="/quests"
            className={`text-sm font-medium hover:underline underline-offset-4 ${
              isActive("/quests") ? "text-primary" : "text-muted-foreground"
            }`}
          >
            Quests
          </Link>
          <Link
            href="/rewards"
            className={`text-sm font-medium hover:underline underline-offset-4 ${
              isActive("/rewards") ? "text-primary" : "text-muted-foreground"
            }`}
          >
            Rewards
          </Link>
          <Link
            href="/leaderboard"
            className={`text-sm font-medium hover:underline underline-offset-4 ${
              isActive("/leaderboard") ? "text-primary" : "text-muted-foreground"
            }`}
          >
            Leaderboard
          </Link>
        </nav>

        <div className="flex items-center gap-4 ml-auto">
          {isOffline && (
            <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400">
              <WifiOff className="h-4 w-4" />
              <span className="text-sm">Offline</span>
            </div>
          )}

          {isDashboardPage && (
            <>
              {userCoins !== undefined && (
                <div className="hidden md:flex items-center gap-1 bg-primary/10 px-3 py-1 rounded-full">
                  <Leaf className="h-4 w-4 text-primary" />
                  <span className="font-medium text-primary">{userCoins} Coins</span>
                </div>
              )}

              <div className="hidden md:flex items-center gap-4">
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
            </>
          )}

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={userData?.photoURL} alt={userData?.name} />
                    <AvatarFallback>
                      {userData?.name?.charAt(0) || user.email?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{userData?.name || "User"}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/rewards">
                    <Leaf className="mr-2 h-4 w-4" />
                    <span>My Rewards</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={() => signOut()}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/signin">
              <Button>Sign In</Button>
            </Link>
          )}

          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
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
    </header>
  );
} 