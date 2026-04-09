"use client"

import dynamic from "next/dynamic"
import type { ComponentType } from "react"

const Loading = () => (
  <div className="flex h-40 items-center justify-center">
    <div className="h-6 w-6 animate-spin rounded-full border-4 border-muted border-t-primary" />
  </div>
)

const registry: Record<string, ComponentType> = {
  "mortgage-calculator": dynamic(
    () => import("@/components/tools/mortgage-calculator"),
    { ssr: false, loading: Loading }
  ),
  "percentage-calculator": dynamic(
    () => import("@/components/tools/percentage-calculator"),
    { ssr: false, loading: Loading }
  ),
  "password-generator": dynamic(
    () => import("@/components/tools/password-generator"),
    { ssr: false, loading: Loading }
  ),
  "bmi-calculator": dynamic(
    () => import("@/components/tools/bmi-calculator"),
    { ssr: false, loading: Loading }
  ),
  "age-calculator": dynamic(
    () => import("@/components/tools/age-calculator"),
    { ssr: false, loading: Loading }
  ),
  "emi-calculator": dynamic(
    () => import("@/components/tools/emi-calculator"),
    { ssr: false, loading: Loading }
  ),
  "tip-calculator": dynamic(
    () => import("@/components/tools/tip-calculator"),
    { ssr: false, loading: Loading }
  ),
  "word-counter": dynamic(
    () => import("@/components/tools/word-counter"),
    { ssr: false, loading: Loading }
  ),
  "color-picker": dynamic(
    () => import("@/components/tools/color-picker"),
    { ssr: false, loading: Loading }
  ),
}

export function EmbedToolRenderer({
  componentName,
}: {
  componentName: string
}) {
  const Component = registry[componentName]

  if (!Component) {
    return (
      <div className="flex h-40 items-center justify-center text-muted-foreground">
        Widget not available.
      </div>
    )
  }

  return <Component />
}
