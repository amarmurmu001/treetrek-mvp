"use client"

import Link from "next/link"
import { ArrowRight, Leaf, TreePine, Trophy } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-background to-muted">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-primary">
                  TreeTrek: Green Wealth Quest
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Plant trees, earn rewards, and build your virtual forest in this gamified eco-adventure.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/dashboard">
                  <Button size="lg" className="bg-primary hover:bg-primary/90">
                    Become an Eco-Warrior <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="#how-it-works">
                  <Button size="lg" variant="outline">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
            <img
              src="/placeholder.svg?height=550&width=550"
              alt="TreeTrek Virtual Forest"
              width={550}
              height={550}
              className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last"
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32 bg-background">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-primary">
                How TreeTrek Works
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Join the green revolution with our gamified tree planting platform
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3 lg:gap-12 mt-12">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <TreePine className="h-8 w-8 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-primary">Plant Trees</h3>
                <p className="text-muted-foreground">
                  Complete quests by planting real trees and verifying your impact with our AI system
                </p>
              </div>
            </div>
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Leaf className="h-8 w-8 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-primary">Earn Green Coins</h3>
                <p className="text-muted-foreground">
                  Get rewarded with Green Coins for every verified tree and eco-challenge completed
                </p>
              </div>
            </div>
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Trophy className="h-8 w-8 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-primary">Redeem Rewards</h3>
                <p className="text-muted-foreground">
                  Exchange your Green Coins for cash, eco-products, or virtual forest upgrades
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-primary">
                Key Features
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Discover what makes TreeTrek the ultimate green gaming experience
              </p>
            </div>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-12">
            <div className="flex flex-col gap-2 p-6 bg-background rounded-lg shadow-sm">
              <h3 className="text-xl font-bold text-primary">Virtual Forest</h3>
              <p className="text-muted-foreground">
                Watch your digital forest grow with every tree you plant in the real world
              </p>
            </div>
            <div className="flex flex-col gap-2 p-6 bg-background rounded-lg shadow-sm">
              <h3 className="text-xl font-bold text-primary">Quests & Missions</h3>
              <p className="text-muted-foreground">
                Complete exciting eco-challenges and tree planting missions to earn rewards
              </p>
            </div>
            <div className="flex flex-col gap-2 p-6 bg-background rounded-lg shadow-sm">
              <h3 className="text-xl font-bold text-primary">AI Verification</h3>
              <p className="text-muted-foreground">Our AI system verifies your tree planting efforts to ensure authenticity</p>
            </div>
            <div className="flex flex-col gap-2 p-6 bg-background rounded-lg shadow-sm">
              <h3 className="text-xl font-bold text-primary">Green Guilds</h3>
              <p className="text-muted-foreground">
                Join forces with other Eco-Warriors to amplify your impact and earn bonus rewards
              </p>
            </div>
            <div className="flex flex-col gap-2 p-6 bg-background rounded-lg shadow-sm">
              <h3 className="text-xl font-bold text-primary">Global Leaderboard</h3>
              <p className="text-muted-foreground">Compete with Eco-Warriors worldwide and climb the ranks of green impact</p>
            </div>
            <div className="flex flex-col gap-2 p-6 bg-background rounded-lg shadow-sm">
              <h3 className="text-xl font-bold text-primary">Impact Dashboard</h3>
              <p className="text-muted-foreground">
                Track your environmental contribution with detailed metrics and visualizations
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-primary text-primary-foreground">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Join the Green Revolution</h2>
              <p className="max-w-[900px] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Become an Eco-Warrior today and start your journey to a greener planet
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="/dashboard">
                <Button size="lg" className="bg-background text-primary hover:bg-background/90">
                  Start Your Adventure <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background">
        <div className="container flex flex-col gap-4 py-10 md:flex-row md:gap-8 md:py-12 px-4 md:px-6">
          <div className="flex flex-col gap-2 md:gap-4 md:w-1/3">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary">
              <TreePine className="h-6 w-6" />
              <span>TreeTrek</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Making tree planting fun, rewarding, and impactful through gamification.
            </p>
          </div>
          <div className="grid flex-1 grid-cols-2 md:grid-cols-3 gap-8">
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-primary">Platform</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/dashboard" className="text-muted-foreground hover:underline">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/quests" className="text-muted-foreground hover:underline">
                    Quests
                  </Link>
                </li>
                <li>
                  <Link href="/rewards" className="text-muted-foreground hover:underline">
                    Rewards
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-primary">Community</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/guilds" className="text-muted-foreground hover:underline">
                    Green Guilds
                  </Link>
                </li>
                <li>
                  <Link href="/leaderboard" className="text-muted-foreground hover:underline">
                    Leaderboard
                  </Link>
                </li>
                <li>
                  <Link href="/events" className="text-muted-foreground hover:underline">
                    Events
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-primary">Company</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/about" className="text-muted-foreground hover:underline">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-muted-foreground hover:underline">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-muted-foreground hover:underline">
                    Privacy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="border-t py-6 text-center text-sm text-muted-foreground">
          <div className="container px-4 md:px-6">© 2025 TreeTrek. All rights reserved.</div>
        </div>
      </footer>
    </div>
  )
}
