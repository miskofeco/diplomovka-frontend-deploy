"use client"

import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface BackendStartupNoticeProps {
  className?: string
  delayMs?: number
}

export function BackendStartupNotice({ className, delayMs = 7000 }: BackendStartupNoticeProps) {
  const [isSlowLoading, setIsSlowLoading] = useState(false)

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setIsSlowLoading(true)
    }, delayMs)

    return () => {
      window.clearTimeout(timer)
    }
  }, [delayMs])

  if (!isSlowLoading) {
    return null
  }

  return (
    <div
      className={cn(
        "mb-6 flex items-start gap-3 border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900",
        className
      )}
      role="status"
      aria-live="polite"
    >
      <Loader2 className="mt-0.5 h-4 w-4 shrink-0 animate-spin text-amber-700" />
      <div>
        <p className="font-medium">Backend sa práve builduje a štartuje po neaktivite.</p>
        <p className="mt-1 text-amber-800">
          Načítanie článkov môže trvať niekoľko minút. Prosím, chvíľu počkajte.
        </p>
      </div>
    </div>
  )
}
