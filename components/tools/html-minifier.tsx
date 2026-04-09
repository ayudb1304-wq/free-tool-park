"use client"

import { useState, useMemo } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { CopyButton } from "@/components/ui/copy-button"

function minifyHtml(html: string): string {
  return html
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/\s+/g, " ")
    .replace(/>\s+</g, "><")
    .replace(/\s+>/g, ">")
    .replace(/<\s+/g, "<")
    .trim()
}

export default function HtmlMinifier() {
  const [input, setInput] = useState("")

  const output = useMemo(() => (input.trim() ? minifyHtml(input) : ""), [input])

  const originalSize = new Blob([input]).size
  const minifiedSize = new Blob([output]).size
  const savings = originalSize > 0 ? ((1 - minifiedSize / originalSize) * 100).toFixed(1) : "0"

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">HTML Input</label>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste your HTML code here to minify..."
            className="min-h-[300px] font-mono text-sm"
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Minified Output</label>
            {output && <CopyButton value={output} label="Copy HTML" />}
          </div>
          <Textarea
            value={output}
            readOnly
            className="min-h-[300px] font-mono text-sm bg-muted"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button variant="ghost" size="sm" onClick={() => setInput("")}>Clear</Button>
      </div>

      {output && (
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl border p-3 text-center">
            <div className="text-xs text-muted-foreground">Original</div>
            <div className="text-lg font-semibold">{originalSize} B</div>
          </div>
          <div className="rounded-xl border p-3 text-center">
            <div className="text-xs text-muted-foreground">Minified</div>
            <div className="text-lg font-semibold">{minifiedSize} B</div>
          </div>
          <div className="rounded-xl bg-primary/10 p-3 text-center">
            <div className="text-xs text-muted-foreground">Saved</div>
            <div className="text-lg font-semibold text-primary">{savings}%</div>
          </div>
        </div>
      )}
    </div>
  )
}
