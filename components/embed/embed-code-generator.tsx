"use client"

import { useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { Copy01Icon, CheckmarkCircle02Icon } from "@hugeicons/core-free-icons"

interface EmbedCodeGeneratorProps {
  toolSlug: string
  toolName: string
}

export function EmbedCodeGenerator({
  toolSlug,
  toolName,
}: EmbedCodeGeneratorProps) {
  const [width, setWidth] = useState("100%")
  const [height, setHeight] = useState("500")
  const [copied, setCopied] = useState(false)

  const embedUrl = `https://www.freetoolpark.com/embed/${toolSlug}`

  const embedCode = `<iframe
  src="${embedUrl}"
  width="${width}"
  height="${height}"
  frameborder="0"
  title="${toolName}"
  loading="lazy"
  style="border: 1px solid #e5e7eb; border-radius: 8px;"
></iframe>
<p style="font-size:12px;margin-top:4px;text-align:center;">
  Powered by <a href="https://www.freetoolpark.com/tools/${toolSlug}?ref=embed" target="_blank" rel="noopener">FreeToolPark</a>
</p>`

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(embedCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback for older browsers
    }
  }

  return (
    <div className="space-y-4 rounded-lg border bg-muted/20 p-4">
      <h3 className="font-semibold">Embed This Tool on Your Website</h3>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1">
          <label className="text-sm font-medium">Width</label>
          <input
            type="text"
            value={width}
            onChange={(e) => setWidth(e.target.value)}
            className="w-full rounded-md border bg-background px-3 py-1.5 text-sm"
            placeholder="e.g. 100% or 400"
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium">Height (px)</label>
          <input
            type="text"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            className="w-full rounded-md border bg-background px-3 py-1.5 text-sm"
            placeholder="e.g. 500"
          />
        </div>
      </div>

      {/* Live Preview */}
      <div>
        <p className="mb-2 text-sm font-medium">Preview</p>
        <div className="overflow-hidden rounded-lg border bg-white">
          <iframe
            src={`/embed/${toolSlug}`}
            width={width}
            height={height}
            frameBorder="0"
            title={`${toolName} Preview`}
            className="w-full"
            loading="lazy"
          />
        </div>
      </div>

      {/* Embed Code */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <p className="text-sm font-medium">Embed Code</p>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition hover:bg-primary/90"
          >
            {copied ? (
              <>
                <HugeiconsIcon icon={CheckmarkCircle02Icon} size={14} />
                Copied!
              </>
            ) : (
              <>
                <HugeiconsIcon icon={Copy01Icon} size={14} />
                Copy Code
              </>
            )}
          </button>
        </div>
        <pre className="overflow-x-auto rounded-lg bg-gray-900 p-3 text-xs text-gray-100">
          <code>{embedCode}</code>
        </pre>
      </div>
    </div>
  )
}
