"use client"

import { useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { Download01Icon } from "@hugeicons/core-free-icons"

interface ExportButtonProps {
  onExport: (options: { includeBranding: boolean }) => void
  label?: string
}

export function ExportButton({
  onExport,
  label = "Download",
}: ExportButtonProps) {
  const [includeBranding, setIncludeBranding] = useState(true)
  const [showOptions, setShowOptions] = useState(false)

  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        <button
          onClick={() => onExport({ includeBranding })}
          className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
        >
          <HugeiconsIcon icon={Download01Icon} size={16} />
          {label}
        </button>
        <button
          onClick={() => setShowOptions(!showOptions)}
          className="rounded-md border p-2 hover:bg-muted"
          aria-label="Export options"
        >
          <svg
            className="size-4"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M4 6l4 4 4-4" />
          </svg>
        </button>
      </div>

      {showOptions && (
        <div className="absolute top-full right-0 z-10 mt-2 min-w-[200px] rounded-lg border bg-background p-4 shadow-lg">
          <label className="flex cursor-pointer items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={includeBranding}
              onChange={(e) => setIncludeBranding(e.target.checked)}
              className="rounded"
            />
            <span>Include &quot;Made with FreeToolPark&quot;</span>
          </label>
          <p className="mt-2 text-xs text-muted-foreground">
            Helps support our free tools!
          </p>
        </div>
      )}
    </div>
  )
}
