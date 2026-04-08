"use client"

import dynamic from "next/dynamic"
import type { ComponentType } from "react"

const Loading = () => (
  <div className="flex h-64 items-center justify-center">
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-primary" />
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
  "qr-code-generator": dynamic(
    () => import("@/components/tools/qr-code-generator"),
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
  "json-formatter": dynamic(
    () => import("@/components/tools/json-formatter"),
    { ssr: false, loading: Loading }
  ),
  "word-counter": dynamic(
    () => import("@/components/tools/word-counter"),
    { ssr: false, loading: Loading }
  ),
  "base64-encoder-decoder": dynamic(
    () => import("@/components/tools/base64-encoder-decoder"),
    { ssr: false, loading: Loading }
  ),
  "regex-tester": dynamic(
    () => import("@/components/tools/regex-tester"),
    { ssr: false, loading: Loading }
  ),
  "color-picker": dynamic(
    () => import("@/components/tools/color-picker"),
    { ssr: false, loading: Loading }
  ),
  "uuid-generator": dynamic(
    () => import("@/components/tools/uuid-generator"),
    { ssr: false, loading: Loading }
  ),
  "md5-generator": dynamic(
    () => import("@/components/tools/md5-generator"),
    { ssr: false, loading: Loading }
  ),
  "url-encoder-decoder": dynamic(
    () => import("@/components/tools/url-encoder-decoder"),
    { ssr: false, loading: Loading }
  ),
  "sha256-generator": dynamic(
    () => import("@/components/tools/sha256-generator"),
    { ssr: false, loading: Loading }
  ),
  "case-converter": dynamic(
    () => import("@/components/tools/case-converter"),
    { ssr: false, loading: Loading }
  ),
  "css-gradient-generator": dynamic(
    () => import("@/components/tools/css-gradient-generator"),
    { ssr: false, loading: Loading }
  ),
  "timestamp-converter": dynamic(
    () => import("@/components/tools/timestamp-converter"),
    { ssr: false, loading: Loading }
  ),
}

export function ToolRenderer({
  componentName,
}: {
  componentName: string
}) {
  const Component = registry[componentName]

  if (!Component) {
    return (
      <div className="flex h-64 items-center justify-center text-muted-foreground">
        Tool coming soon.
      </div>
    )
  }

  return <Component />
}
