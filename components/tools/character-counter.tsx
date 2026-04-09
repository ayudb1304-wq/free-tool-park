"use client"

import { useState, useMemo } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { CopyButton } from "@/components/ui/copy-button"

function analyze(text: string) {
  const totalChars = text.length
  const charsNoSpaces = text.replace(/\s/g, "").length
  const words = text.trim() ? text.trim().split(/\s+/).length : 0
  const sentences = text.trim() ? text.split(/[.!?]+/).filter((s) => s.trim()).length : 0
  const paragraphs = text.trim() ? text.split(/\n\n+/).filter((p) => p.trim()).length : 0
  const lines = text ? text.split("\n").length : 0
  const letters = (text.match(/[a-zA-Z]/g) || []).length
  const digits = (text.match(/\d/g) || []).length
  const spaces = (text.match(/\s/g) || []).length
  const special = totalChars - letters - digits - spaces

  const letterFreq: Record<string, number> = {}
  for (const ch of text.toLowerCase()) {
    if (/[a-z]/.test(ch)) {
      letterFreq[ch] = (letterFreq[ch] || 0) + 1
    }
  }

  return { totalChars, charsNoSpaces, words, sentences, paragraphs, lines, letters, digits, spaces, special, letterFreq }
}

export default function CharacterCounter() {
  const [text, setText] = useState("")
  const [showFreq, setShowFreq] = useState(false)

  const stats = useMemo(() => analyze(text), [text])

  const summary = `Characters: ${stats.totalChars} | Without Spaces: ${stats.charsNoSpaces} | Words: ${stats.words} | Letters: ${stats.letters} | Digits: ${stats.digits}`

  const sortedFreq = Object.entries(stats.letterFreq).sort((a, b) => b[1] - a[1])

  return (
    <div className="space-y-6">
      <Textarea
        placeholder="Type or paste your text here to count characters, words, letters, and more..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="min-h-[180px] text-sm"
      />

      <div className="flex gap-2">
        <Button variant="ghost" size="sm" onClick={() => setText("")}>Clear</Button>
        {stats.totalChars > 0 && <CopyButton value={summary} label="Copy Stats" />}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Characters", value: stats.totalChars },
          { label: "Without Spaces", value: stats.charsNoSpaces },
          { label: "Words", value: stats.words },
          { label: "Sentences", value: stats.sentences },
          { label: "Paragraphs", value: stats.paragraphs },
          { label: "Lines", value: stats.lines },
          { label: "Letters", value: stats.letters },
          { label: "Digits", value: stats.digits },
          { label: "Spaces", value: stats.spaces },
          { label: "Special Chars", value: stats.special },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border p-3 text-center">
            <div className="text-xs text-muted-foreground">{s.label}</div>
            <div className="text-lg font-semibold">{s.value}</div>
          </div>
        ))}
      </div>

      {stats.letters > 0 && (
        <div className="space-y-2">
          <Button variant="outline" size="sm" onClick={() => setShowFreq(!showFreq)}>
            {showFreq ? "Hide" : "Show"} Letter Frequency
          </Button>
          {showFreq && (
            <div className="flex flex-wrap gap-2">
              {sortedFreq.map(([ch, count]) => (
                <div key={ch} className="rounded-lg border px-2 py-1 text-center text-xs">
                  <span className="font-mono font-bold uppercase">{ch}</span>
                  <span className="ml-1 text-muted-foreground">{count}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
