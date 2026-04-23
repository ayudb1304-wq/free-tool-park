import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowRight01Icon } from "@hugeicons/core-free-icons"
import { getToolBySlug } from "@/lib/tools"

interface CalculatorCtaProps {
  toolSlug: string
  /** Optional override for the headline shown above the tool name. */
  headline?: string
  /** Optional override for the button label. */
  ctaLabel?: string
}

export function CalculatorCta({
  toolSlug,
  headline = "Run the numbers for your situation",
  ctaLabel = "Open the calculator",
}: CalculatorCtaProps) {
  const tool = getToolBySlug(toolSlug)
  if (!tool) return null

  return (
    <aside className="not-prose my-8 rounded-2xl border bg-card p-6 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <HugeiconsIcon icon={tool.icon} size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              {headline}
            </p>
            <p className="font-heading text-lg font-semibold">{tool.name}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {tool.metaDescription}
            </p>
          </div>
        </div>
        <Link
          href={`/tools/${tool.slug}`}
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
        >
          {ctaLabel}
          <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
        </Link>
      </div>
    </aside>
  )
}
