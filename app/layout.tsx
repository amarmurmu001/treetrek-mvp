import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/lib/auth-context"
import { LayoutContent } from "@/components/layout-content"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "TreeTrek - Green Wealth Quest",
  description: "Plant trees, earn rewards, and build your virtual forest in this gamified eco-adventure.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          storageKey="treetrek-theme"
        >
          <AuthProvider>
            <LayoutContent>{children}</LayoutContent>
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
} 