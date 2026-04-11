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
  "refinance-calculator": dynamic(
    () => import("@/components/tools/refinance-calculator"),
    { ssr: false, loading: Loading }
  ),
  "auto-loan-calculator": dynamic(
    () => import("@/components/tools/auto-loan-calculator"),
    { ssr: false, loading: Loading }
  ),
  "loan-calculator": dynamic(
    () => import("@/components/tools/loan-calculator"),
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
  "interest-calculator": dynamic(
    () => import("@/components/tools/interest-calculator"),
    { ssr: false, loading: Loading }
  ),
  "character-counter": dynamic(
    () => import("@/components/tools/character-counter"),
    { ssr: false, loading: Loading }
  ),
  "hex-to-rgb": dynamic(
    () => import("@/components/tools/hex-to-rgb"),
    { ssr: false, loading: Loading }
  ),
  "markdown-to-html": dynamic(
    () => import("@/components/tools/markdown-to-html"),
    { ssr: false, loading: Loading }
  ),
  "lorem-ipsum-generator": dynamic(
    () => import("@/components/tools/lorem-ipsum-generator"),
    { ssr: false, loading: Loading }
  ),
  "calorie-calculator": dynamic(
    () => import("@/components/tools/calorie-calculator"),
    { ssr: false, loading: Loading }
  ),
  "grade-calculator": dynamic(
    () => import("@/components/tools/grade-calculator"),
    { ssr: false, loading: Loading }
  ),
  "gpa-calculator": dynamic(
    () => import("@/components/tools/gpa-calculator"),
    { ssr: false, loading: Loading }
  ),
  "text-to-slug": dynamic(
    () => import("@/components/tools/text-to-slug"),
    { ssr: false, loading: Loading }
  ),
  "css-minifier": dynamic(
    () => import("@/components/tools/css-minifier"),
    { ssr: false, loading: Loading }
  ),
  "js-minifier": dynamic(
    () => import("@/components/tools/js-minifier"),
    { ssr: false, loading: Loading }
  ),
  "html-minifier": dynamic(
    () => import("@/components/tools/html-minifier"),
    { ssr: false, loading: Loading }
  ),
  "binary-to-decimal": dynamic(
    () => import("@/components/tools/binary-to-decimal"),
    { ssr: false, loading: Loading }
  ),
  "decimal-to-binary": dynamic(
    () => import("@/components/tools/decimal-to-binary"),
    { ssr: false, loading: Loading }
  ),
  "number-to-words": dynamic(
    () => import("@/components/tools/number-to-words"),
    { ssr: false, loading: Loading }
  ),
  "roman-numeral-converter": dynamic(
    () => import("@/components/tools/roman-numeral-converter"),
    { ssr: false, loading: Loading }
  ),
  "temperature-converter": dynamic(
    () => import("@/components/tools/temperature-converter"),
    { ssr: false, loading: Loading }
  ),
  "length-converter": dynamic(
    () => import("@/components/tools/length-converter"),
    { ssr: false, loading: Loading }
  ),
  "weight-converter": dynamic(
    () => import("@/components/tools/weight-converter"),
    { ssr: false, loading: Loading }
  ),
  "time-zone-converter": dynamic(
    () => import("@/components/tools/time-zone-converter"),
    { ssr: false, loading: Loading }
  ),
  "invoice-generator": dynamic(
    () => import("@/components/tools/invoice-generator"),
    { ssr: false, loading: Loading }
  ),
  "income-tax-calculator": dynamic(
    () => import("@/components/tools/income-tax-calculator"),
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
