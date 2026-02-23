"use client"

import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

function Spinner({ className, size = 20 }: { className?: string; size?: number }) {
  return (
    <Loader2
      className={cn("animate-spin text-current", className)}
      style={{ width: size, height: size }}
      aria-hidden="true"
    />
  )
}

export { Spinner }
