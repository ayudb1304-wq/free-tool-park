"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

type AdFormat = "horizontal" | "vertical" | "rectangle"

const FORMAT_STYLES: Record<AdFormat, string> = {
  horizontal: "min-h-[90px] w-full",
  vertical: "min-h-[600px] w-full max-w-[160px]",
  rectangle: "min-h-[250px] w-full max-w-[336px]",
}

interface AdUnitProps {
  slot: string
  format?: AdFormat
  className?: string
}

export function AdUnit({ format = "horizontal", className }: AdUnitProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin: "200px" }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={cn(
        "flex items-center justify-center rounded-lg border border-dashed border-border/50",
        FORMAT_STYLES[format],
        className
      )}
      aria-label="Advertisement"
    >
      {visible && (
        <span className="text-xs text-muted-foreground/50">Ad</span>
      )}
    </div>
  )
}
