"use client"

import { X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function Toasts() {
  const { toasts, dismiss } = useToast()

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-0 right-0 z-50 p-4 space-y-4 w-full max-w-sm">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`rounded-lg border p-4 shadow-md transition-all duration-300 ${
            toast.visible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
          } ${
            toast.variant === "destructive"
              ? "bg-red-50 border-red-200 text-red-800"
              : toast.variant === "success"
                ? "bg-green-50 border-green-200 text-green-800"
                : "bg-white border-gray-200"
          }`}
        >
          <div className="flex justify-between items-start gap-2">
            <div>
              <h3 className="font-medium">{toast.title}</h3>
              {toast.description && <p className="text-sm mt-1">{toast.description}</p>}
            </div>
            <button onClick={() => dismiss(toast.id)} className="rounded-md p-1 hover:bg-gray-100">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
