"use client"

import { useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { CopyButton } from "@/components/ui/copy-button"

export default function Base64EncoderDecoder() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [error, setError] = useState("")

  function encode() {
    if (!input.trim()) return
    try {
      setOutput(btoa(unescape(encodeURIComponent(input))))
      setError("")
    } catch (e) {
      setError((e as Error).message)
      setOutput("")
    }
  }

  function decode() {
    if (!input.trim()) return
    try {
      setOutput(decodeURIComponent(escape(atob(input.trim()))))
      setError("")
    } catch (e) {
      setError("Invalid Base64 string. Please check your input.")
      setOutput("")
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Input</label>
        <Textarea
          placeholder="Enter text to encode or Base64 string to decode..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="min-h-[150px] font-mono text-sm"
          spellCheck={false}
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <Button onClick={encode} size="sm">
          Encode to Base64
        </Button>
        <Button onClick={decode} variant="secondary" size="sm">
          Decode from Base64
        </Button>
        <Button
          onClick={() => {
            setInput("")
            setOutput("")
            setError("")
          }}
          variant="ghost"
          size="sm"
        >
          Clear
        </Button>
      </div>

      {error && (
        <div className="rounded-xl border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {output && !error && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Output</label>
            <CopyButton value={output} label="Copy Output" />
          </div>
          <Textarea
            value={output}
            readOnly
            className="min-h-[150px] font-mono text-sm"
          />
        </div>
      )}
    </div>
  )
}
