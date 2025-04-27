"use client"

import { useEffect, useState } from "react"

interface VerificationOverlayProps {
  onComplete: () => void
}

export function VerificationOverlay({ onComplete }: VerificationOverlayProps) {
  const [progress, setProgress] = useState(0)
  const [step, setStep] = useState(1)
  const [verificationComplete, setVerificationComplete] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(timer)
          return 100
        }
        return prevProgress + 2
      })
    }, 100)

    return () => {
      clearInterval(timer)
    }
  }, [])

  useEffect(() => {
    if (progress >= 33 && step === 1) {
      setStep(2)
    } else if (progress >= 66 && step === 2) {
      setStep(3)
    } else if (progress >= 100 && step === 3) {
      setVerificationComplete(true)
      setTimeout(() => {
        onComplete()
      }, 1500)
    }
  }, [progress, step, onComplete])

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-4 sm:p-6 max-w-md w-full">
        <div className="text-center mb-6">
          <h3 className="text-lg sm:text-xl font-bold text-green-800 mb-2">Verifying Your Tree Planting</h3>
          <p className="text-sm text-muted-foreground">
            Our AI system is analyzing your photos to verify your tree planting
          </p>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Image Analysis</span>
              <span>{step > 1 ? "Complete\" : "\
