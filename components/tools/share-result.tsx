"use client"

import { useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Copy01Icon,
  CheckmarkCircle02Icon,
  NewTwitterIcon,
  Linkedin01Icon,
} from "@hugeicons/core-free-icons"

interface ShareResultProps {
  url: string
  resultText: string
  toolName: string
  hashtags?: string[]
}

export function ShareResult({
  url,
  resultText,
  toolName,
  hashtags = [],
}: ShareResultProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const twitterText = encodeURIComponent(
    `${resultText}\n\nCalculated with this free ${toolName}:`
  )
  const twitterHashtags =
    hashtags.length > 0 ? `&hashtags=${hashtags.join(",")}` : ""
  const twitterUrl = `https://twitter.com/intent/tweet?text=${twitterText}&url=${encodeURIComponent(url)}${twitterHashtags}`

  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`

  return (
    <div className="mt-6 rounded-lg border bg-muted/50 p-4">
      <p className="mb-3 text-sm font-medium text-muted-foreground">
        Share your result
      </p>

      <div className="mb-4 flex items-center gap-2">
        <div className="min-w-0 flex-1 truncate rounded-md border bg-background px-3 py-2 text-sm">
          {url}
        </div>
        <button
          onClick={handleCopy}
          className="flex shrink-0 items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
          aria-label="Copy link"
        >
          {copied ? (
            <>
              <HugeiconsIcon icon={CheckmarkCircle02Icon} size={16} />
              Copied!
            </>
          ) : (
            <>
              <HugeiconsIcon icon={Copy01Icon} size={16} />
              Copy
            </>
          )}
        </button>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-sm text-muted-foreground">Share on:</span>
        <a
          href={twitterUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full p-2 transition hover:bg-muted"
          aria-label="Share on Twitter"
        >
          <HugeiconsIcon icon={NewTwitterIcon} size={20} />
        </a>
        <a
          href={linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full p-2 transition hover:bg-muted"
          aria-label="Share on LinkedIn"
        >
          <HugeiconsIcon icon={Linkedin01Icon} size={20} />
        </a>
      </div>
    </div>
  )
}
