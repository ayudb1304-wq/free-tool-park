"use client"

import { useState, useMemo } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { CopyButton } from "@/components/ui/copy-button"

function analyze(text: string) {
  const characters = text.length
  const charactersNoSpaces = text.replace(/\s/g, "").length
  const words = text.trim() ? text.trim().split(/\s+/).length : 0
  const sentences = text.trim()
    ? text.split(/[.!?]+/).filter((s) => s.trim().length > 0).length
    : 0
  const paragraphs = text.trim()
    ? text.split(/\n\n+/).filter((p) => p.trim().length > 0).length
    : 0
  const lines = text ? text.split("\n").length : 0

  // Reading time: average 200 words per minute
  const readingTime = Math.ceil(words / 200)
  // Speaking time: average 130 words per minute
  const speakingTime = Math.ceil(words / 130)

  return {
    characters,
    charactersNoSpaces,
    words,
    sentences,
    paragraphs,
    lines,
    readingTime,
    speakingTime,
  }
}

export default function WordCounter() {
  const [text, setText] = useState("")

  const stats = useMemo(() => analyze(text), [text])

  function clear() {
    setText("")
  }

  const summary = `Words: ${stats.words} | Characters: ${stats.characters} | Sentences: ${stats.sentences} | Paragraphs: ${stats.paragraphs} | Reading time: ~${stats.readingTime} min`

  return (
    <div className="space-y-6">
      <Textarea
        placeholder="Type or paste your text here to count words, characters, sentences, and more..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="min-h-[200px] text-sm"
      />

      <div className="flex gap-2">
        <Button variant="ghost" size="sm" onClick={clear}>
          Clear
        </Button>
        {stats.words > 0 && <CopyButton value={summary} label="Copy Stats" />}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Words", value: stats.words },
          { label: "Characters", value: stats.characters },
          { label: "Characters (no spaces)", value: stats.charactersNoSpaces },
          { label: "Sentences", value: stats.sentences },
          { label: "Paragraphs", value: stats.paragraphs },
          { label: "Lines", value: stats.lines },
          { label: "Reading Time", value: `~${stats.readingTime} min` },
          { label: "Speaking Time", value: `~${stats.speakingTime} min` },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border p-3 text-center">
            <div className="text-xs text-muted-foreground">{stat.label}</div>
            <div className="text-lg font-semibold">{stat.value}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
