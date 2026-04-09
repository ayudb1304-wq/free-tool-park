"use client"

import { useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { CopyButton } from "@/components/ui/copy-button"

function toSlug(text: string, separator: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, separator)
    .replace(new RegExp(`[${separator}]+`, "g"), separator)
    .replace(new RegExp(`^${separator}|${separator}$`, "g"), "")
}

export default function TextToSlug() {
  const [input, setInput] = useState("")
  const [separator, setSeparator] = useState("-")

  const slug = toSlug(input, separator)
  const charCount = slug.length

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium">Enter Text</label>
        <Textarea
          placeholder="Type or paste your title, heading, or text to convert into a URL slug..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="min-h-[100px] text-sm"
        />
      </div>

      <div className="flex items-center gap-4">
        <span className="text-sm text-muted-foreground">Separator:</span>
        {["-", "_", "."].map((s) => (
          <Button key={s} variant={separator === s ? "default" : "secondary"} size="sm" onClick={() => setSeparator(s)}>
            {s === "-" ? "Hyphen (-)" : s === "_" ? "Underscore (_)" : "Dot (.)"}
          </Button>
        ))}
      </div>

      {slug && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">URL Slug</label>
            <CopyButton value={slug} label="Copy Slug" />
          </div>
          <Input value={slug} readOnly className="font-mono text-sm bg-muted" />
          <div className="flex gap-4 text-xs text-muted-foreground">
            <span>{charCount} characters</span>
            <span>{charCount <= 60 ? "Good length for SEO" : "Consider shortening for SEO"}</span>
          </div>
        </div>
      )}

      {slug && (
        <div className="space-y-2">
          <label className="text-sm font-medium">Preview URL</label>
          <div className="rounded-lg border bg-muted px-3 py-2 font-mono text-sm text-muted-foreground">
            https://example.com/{slug}
          </div>
        </div>
      )}
    </div>
  )
}
