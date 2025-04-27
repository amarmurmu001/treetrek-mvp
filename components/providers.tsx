"use client"

import type { ReactNode } from "react"
import { Toasts } from "@/components/toast"

export function Providers({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <Toasts />
    </>
  )
}
