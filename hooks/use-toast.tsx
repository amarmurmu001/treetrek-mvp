"use client"

import { useState, useCallback } from "react"

type ToastVariant = "default" | "destructive" | "success"

interface ToastProps {
  title: string
  description?: string
  variant?: ToastVariant
}

interface ToastState extends ToastProps {
  id: string
  visible: boolean
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastState[]>([])

  const toast = useCallback(({ title, description, variant = "default" }: ToastProps) => {
    const id = Math.random().toString(36).substring(2, 9)

    setToasts((prev) => [...prev, { id, title, description, variant, visible: true }])

    // Auto dismiss after 5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, visible: false } : t)))

      // Remove from DOM after animation
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
      }, 300)
    }, 5000)

    return id
  }, [])

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, visible: false } : t)))

    // Remove from DOM after animation
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 300)
  }, [])

  return { toast, dismiss, toasts }
}
