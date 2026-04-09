"use client"

import { useState, useMemo } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { CopyButton } from "@/components/ui/copy-button"

function markdownToHtml(md: string): string {
  let html = md
  // Code blocks (fenced)
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_m, lang, code) =>
    `<pre><code class="${lang}">${code.replace(/</g, "&lt;").replace(/>/g, "&gt;").trim()}</code></pre>`
  )
  // Inline code
  html = html.replace(/`([^`]+)`/g, "<code>$1</code>")
  // Images
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />')
  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
  // Headings
  html = html.replace(/^######\s+(.+)$/gm, "<h6>$1</h6>")
  html = html.replace(/^#####\s+(.+)$/gm, "<h5>$1</h5>")
  html = html.replace(/^####\s+(.+)$/gm, "<h4>$1</h4>")
  html = html.replace(/^###\s+(.+)$/gm, "<h3>$1</h3>")
  html = html.replace(/^##\s+(.+)$/gm, "<h2>$1</h2>")
  html = html.replace(/^#\s+(.+)$/gm, "<h1>$1</h1>")
  // Bold and italic
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>")
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
  html = html.replace(/\*(.+?)\*/g, "<em>$1</em>")
  // Strikethrough
  html = html.replace(/~~(.+?)~~/g, "<del>$1</del>")
  // Horizontal rule
  html = html.replace(/^---$/gm, "<hr />")
  // Blockquote
  html = html.replace(/^>\s+(.+)$/gm, "<blockquote>$1</blockquote>")
  // Unordered list items
  html = html.replace(/^[-*]\s+(.+)$/gm, "<li>$1</li>")
  // Ordered list items
  html = html.replace(/^\d+\.\s+(.+)$/gm, "<li>$1</li>")
  // Wrap consecutive <li> in <ul>
  html = html.replace(/((?:<li>.*<\/li>\n?)+)/g, "<ul>\n$1</ul>")
  // Paragraphs: wrap remaining non-empty non-tag lines
  html = html
    .split("\n\n")
    .map((block) => {
      const trimmed = block.trim()
      if (!trimmed) return ""
      if (/^</.test(trimmed)) return trimmed
      return `<p>${trimmed.replace(/\n/g, "<br />")}</p>`
    })
    .join("\n\n")

  return html.trim()
}

export default function MarkdownToHtml() {
  const [md, setMd] = useState("# Hello World\n\nThis is **bold** and *italic* text.\n\n- Item one\n- Item two\n- Item three\n\n> A blockquote example\n\n[Visit Google](https://google.com)\n\n```js\nconsole.log('Hello!');\n```")
  const [view, setView] = useState<"code" | "preview">("code")

  const html = useMemo(() => markdownToHtml(md), [md])

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">Markdown Input</label>
          <Textarea
            value={md}
            onChange={(e) => setMd(e.target.value)}
            className="min-h-[320px] font-mono text-sm"
            placeholder="Type or paste Markdown here..."
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex gap-1">
              <Button variant={view === "code" ? "default" : "secondary"} size="sm" onClick={() => setView("code")}>HTML Code</Button>
              <Button variant={view === "preview" ? "default" : "secondary"} size="sm" onClick={() => setView("preview")}>Preview</Button>
            </div>
            <CopyButton value={html} label="Copy HTML" />
          </div>
          {view === "code" ? (
            <pre className="min-h-[320px] overflow-auto rounded-xl border bg-muted p-3 font-mono text-sm whitespace-pre-wrap">{html}</pre>
          ) : (
            <div className="prose dark:prose-invert min-h-[320px] overflow-auto rounded-xl border p-3 text-sm" dangerouslySetInnerHTML={{ __html: html }} />
          )}
        </div>
      </div>
    </div>
  )
}
