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
  adSlot?: string
}

export function AdUnit({
  format = "horizontal",
  className,
}: AdUnitProps) {
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
        <div className="flex h-full w-full items-center justify-center">
          {/*
            AD NETWORK CODE GOES HERE
            Replace this comment block with your ad network script tag.

            Adsterra example:
            <script async data-cfasync="false" src="//YOUR_ADSTERRA_BANNER_URL"></script>

            Google AdSense example:
            <ins className="adsbygoogle"
              style={{ display: 'block' }}
              data-ad-client="ca-pub-XXXXXXXXXX"
              data-ad-slot="XXXXXXXXXX"
              data-ad-format="auto"
              data-full-width-responsive="true" />

            PropellerAds example:
            <script src="//YOURPROPELLERURL" data-cfasync="false" async></script>
          */}
          <span className="text-xs text-muted-foreground/30 select-none">
            Advertisement
          </span>
        </div>
      )}
    </div>
  )
}
