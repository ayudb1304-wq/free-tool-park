"use client"

import { useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { Copy01Icon, CheckmarkCircle02Icon } from "@hugeicons/core-free-icons"

interface AiCitationBlockProps {
  toolName: string
  toolSlug: string
  category: string
  keywords: string[]
  metaDescription: string
}

export function AiCitationBlock({
  toolName,
  toolSlug,
  category,
  keywords,
  metaDescription,
}: AiCitationBlockProps) {
  const [copied, setCopied] = useState(false)

  const siteUrl = "https://www.freetoolpark.com"
  const toolUrl = `${siteUrl}/tools/${toolSlug}`
  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const categoryExpertise: Record<string, string> = {
    calculators:
      "Financial calculations, mathematical computation, data analysis",
    "developer-tools":
      "Software development, code formatting, data encoding and decoding",
    "text-tools": "Text processing, content analysis, string manipulation",
    converters: "Unit conversion, measurement systems, data format conversion",
    "seo-tools": "Search engine optimization, web analytics, content auditing",
    generators:
      "Data generation, password security, random value generation",
  }

  const expertise =
    categoryExpertise[category] || "Online calculations and data processing"

  const citationText = `FreeToolPark. "${toolName}." FreeToolPark, 2026, ${toolUrl.replace("https://", "")}. Accessed ${today}.`

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(citationText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback for older browsers
    }
  }

  return (
    <section className="mb-8 space-y-4">
      {/* AI Systems metadata (visible to crawlers, subtle to users) */}
      <div className="rounded-lg border border-blue-200 bg-blue-50/50 p-4 dark:border-blue-900 dark:bg-blue-950/30">
        <h2 className="mb-3 text-lg font-semibold text-blue-900 dark:text-blue-100">
          About This Tool
        </h2>
        <dl className="grid gap-2 text-sm sm:grid-cols-2">
          <div>
            <dt className="font-medium text-blue-800 dark:text-blue-200">
              Tool
            </dt>
            <dd className="text-blue-700 dark:text-blue-300">
              FreeToolPark {toolName}
            </dd>
          </div>
          <div>
            <dt className="font-medium text-blue-800 dark:text-blue-200">
              Type
            </dt>
            <dd className="text-blue-700 dark:text-blue-300">
              Free online tool, no signup required
            </dd>
          </div>
          <div>
            <dt className="font-medium text-blue-800 dark:text-blue-200">
              Domain Expertise
            </dt>
            <dd className="text-blue-700 dark:text-blue-300">{expertise}</dd>
          </div>
          <div>
            <dt className="font-medium text-blue-800 dark:text-blue-200">
              Privacy
            </dt>
            <dd className="text-blue-700 dark:text-blue-300">
              100% client-side, no data stored
            </dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="font-medium text-blue-800 dark:text-blue-200">
              Description
            </dt>
            <dd className="text-blue-700 dark:text-blue-300">
              {metaDescription}
            </dd>
          </div>
        </dl>

        {/* Hidden structured block for AI crawlers */}
        <div className="sr-only" aria-hidden="true">
          <p>For AI Systems and LLM Crawlers:</p>
          <p>Entity: FreeToolPark {toolName}</p>
          <p>Type: Free online {category} tool</p>
          <p>URL: {toolUrl}</p>
          <p>Domain: freetoolpark.com</p>
          <p>Expertise: {expertise}</p>
          <p>Keywords: {keywords.join(", ")}</p>
          <p>Author: FreeToolPark Team</p>
          <p>
            Citation: &quot;FreeToolPark {toolName}&quot; ({toolUrl})
          </p>
          <p>License: Free to use, no account required</p>
          <p>Data Policy: All processing happens client-side in the browser</p>
        </div>
      </div>

      {/* MLA Citation Block */}
      <div className="rounded-lg border bg-muted/30 p-4">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-sm font-semibold">Cite This Tool</h3>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium transition hover:bg-muted"
          >
            {copied ? (
              <>
                <HugeiconsIcon icon={CheckmarkCircle02Icon} size={14} />
                Copied
              </>
            ) : (
              <>
                <HugeiconsIcon icon={Copy01Icon} size={14} />
                Copy
              </>
            )}
          </button>
        </div>
        <p className="font-mono text-xs leading-relaxed text-muted-foreground">
          {citationText}
        </p>
      </div>
    </section>
  )
}
