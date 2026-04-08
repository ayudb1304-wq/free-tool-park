"use client"

import { useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { CopyButton } from "@/components/ui/copy-button"

export default function JsonFormatter() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [error, setError] = useState("")
  const [indent, setIndent] = useState("2")

  function format() {
    if (!input.trim()) return
    try {
      const parsed = JSON.parse(input)
      setOutput(JSON.stringify(parsed, null, Number(indent)))
      setError("")
    } catch (e) {
      setError((e as Error).message)
      setOutput("")
    }
  }

  function minify() {
    if (!input.trim()) return
    try {
      const parsed = JSON.parse(input)
      setOutput(JSON.stringify(parsed))
      setError("")
    } catch (e) {
      setError((e as Error).message)
      setOutput("")
    }
  }

  function validate() {
    if (!input.trim()) return
    try {
      JSON.parse(input)
      setError("")
      setOutput("Valid JSON!")
    } catch (e) {
      setError((e as Error).message)
      setOutput("")
    }
  }

  function clear() {
    setInput("")
    setOutput("")
    setError("")
  }

  return (
    <div className="space-y-4">
      {/* Input */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Input</label>
        <Textarea
          placeholder='Paste your JSON here, e.g. {"name": "value"}'
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="min-h-[200px] font-mono text-sm"
          spellCheck={false}
        />
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-2">
        <Button onClick={format} size="sm">
          Format
        </Button>
        <Button onClick={minify} variant="secondary" size="sm">
          Minify
        </Button>
        <Button onClick={validate} variant="secondary" size="sm">
          Validate
        </Button>
        <Button onClick={clear} variant="ghost" size="sm">
          Clear
        </Button>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Indent:</span>
          <Select value={indent} onValueChange={setIndent}>
            <SelectTrigger className="h-8 w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2">2 spaces</SelectItem>
              <SelectItem value="4">4 spaces</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Error display */}
      {error && (
        <div className="rounded-xl border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Output */}
      {output && !error && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Output</label>
            <CopyButton value={output} label="Copy Output" />
          </div>
          <Textarea
            value={output}
            readOnly
            className="min-h-[200px] font-mono text-sm"
          />
        </div>
      )}
    </div>
  )
}
