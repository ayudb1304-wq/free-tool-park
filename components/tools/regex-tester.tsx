"use client"

import { useState, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface Match {
  value: string
  index: number
  groups: string[]
}

export default function RegexTester() {
  const [pattern, setPattern] = useState("")
  const [flags, setFlags] = useState("g")
  const [testString, setTestString] = useState("")

  const result = useMemo(() => {
    if (!pattern || !testString) return { matches: [] as Match[], error: "" }

    try {
      const regex = new RegExp(pattern, flags)
      const matches: Match[] = []

      if (flags.includes("g")) {
        let m
        while ((m = regex.exec(testString)) !== null) {
          matches.push({
            value: m[0],
            index: m.index,
            groups: m.slice(1),
          })
          if (!m[0]) regex.lastIndex++
        }
      } else {
        const m = regex.exec(testString)
        if (m) {
          matches.push({
            value: m[0],
            index: m.index,
            groups: m.slice(1),
          })
        }
      }

      return { matches, error: "" }
    } catch (e) {
      return { matches: [] as Match[], error: (e as Error).message }
    }
  }, [pattern, flags, testString])

  const flagOptions = [
    { flag: "g", label: "Global" },
    { flag: "i", label: "Case Insensitive" },
    { flag: "m", label: "Multiline" },
    { flag: "s", label: "Dotall" },
  ]

  function toggleFlag(f: string) {
    setFlags((prev) => (prev.includes(f) ? prev.replace(f, "") : prev + f))
  }

  // Highlight matches in test string
  const highlighted = useMemo(() => {
    if (!result.matches.length || result.error) return null

    const parts: { text: string; isMatch: boolean }[] = []
    let lastIndex = 0

    for (const m of result.matches) {
      if (m.index > lastIndex) {
        parts.push({ text: testString.slice(lastIndex, m.index), isMatch: false })
      }
      parts.push({ text: m.value, isMatch: true })
      lastIndex = m.index + m.value.length
    }

    if (lastIndex < testString.length) {
      parts.push({ text: testString.slice(lastIndex), isMatch: false })
    }

    return parts
  }, [result.matches, result.error, testString])

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
        <div className="space-y-1.5">
          <Label>Regular Expression</Label>
          <div className="flex items-center gap-1 rounded-3xl border bg-input/50 px-3 font-mono text-sm">
            <span className="text-muted-foreground">/</span>
            <input
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              className="h-9 min-w-0 flex-1 bg-transparent outline-none"
              placeholder="pattern"
              spellCheck={false}
            />
            <span className="text-muted-foreground">/{flags}</span>
          </div>
        </div>
        <div className="space-y-1.5">
          <Label>Flags</Label>
          <div className="flex gap-1">
            {flagOptions.map((opt) => (
              <button
                key={opt.flag}
                onClick={() => toggleFlag(opt.flag)}
                className={`rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors ${
                  flags.includes(opt.flag)
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:bg-muted"
                }`}
                title={opt.label}
              >
                {opt.flag}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label>Test String</Label>
        <Textarea
          placeholder="Enter text to test against your regex..."
          value={testString}
          onChange={(e) => setTestString(e.target.value)}
          className="min-h-[120px] font-mono text-sm"
          spellCheck={false}
        />
      </div>

      {result.error && (
        <div className="rounded-xl border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
          {result.error}
        </div>
      )}

      {highlighted && (
        <div className="space-y-1.5">
          <Label>
            Matches ({result.matches.length})
          </Label>
          <div className="rounded-xl border bg-muted/30 p-4 font-mono text-sm whitespace-pre-wrap break-all">
            {highlighted.map((part, i) =>
              part.isMatch ? (
                <mark
                  key={i}
                  className="rounded bg-primary/20 px-0.5 text-primary"
                >
                  {part.text}
                </mark>
              ) : (
                <span key={i}>{part.text}</span>
              )
            )}
          </div>
        </div>
      )}

      {result.matches.length > 0 && (
        <div className="space-y-1.5">
          <Label>Match Details</Label>
          <div className="overflow-x-auto rounded-xl border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="px-3 py-2 text-left">#</th>
                  <th className="px-3 py-2 text-left">Match</th>
                  <th className="px-3 py-2 text-left">Index</th>
                  {result.matches.some((m) => m.groups.length > 0) && (
                    <th className="px-3 py-2 text-left">Groups</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {result.matches.map((m, i) => (
                  <tr key={i} className="border-b last:border-0">
                    <td className="px-3 py-2 text-muted-foreground">{i + 1}</td>
                    <td className="px-3 py-2 font-mono">{m.value}</td>
                    <td className="px-3 py-2">{m.index}</td>
                    {result.matches.some((m) => m.groups.length > 0) && (
                      <td className="px-3 py-2 font-mono">
                        {m.groups.join(", ") || "-"}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
