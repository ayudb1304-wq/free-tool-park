"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CopyButton } from "@/components/ui/copy-button"

const ONES = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine",
  "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"]
const TENS = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"]
const SCALES = ["", "thousand", "million", "billion", "trillion", "quadrillion"]

function convertChunk(n: number): string {
  if (n === 0) return ""
  if (n < 20) return ONES[n]
  if (n < 100) return TENS[Math.floor(n / 10)] + (n % 10 ? " " + ONES[n % 10] : "")
  return ONES[Math.floor(n / 100)] + " hundred" + (n % 100 ? " and " + convertChunk(n % 100) : "")
}

function numberToWords(num: number): string {
  if (num === 0) return "zero"
  if (num < 0) return "negative " + numberToWords(-num)

  const parts: string[] = []
  let scaleIdx = 0
  let n = Math.floor(Math.abs(num))

  while (n > 0) {
    const chunk = n % 1000
    if (chunk > 0) {
      const chunkWords = convertChunk(chunk)
      parts.unshift(SCALES[scaleIdx] ? chunkWords + " " + SCALES[scaleIdx] : chunkWords)
    }
    n = Math.floor(n / 1000)
    scaleIdx++
  }

  return parts.join(", ")
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export default function NumberToWords() {
  const [input, setInput] = useState("")

  const num = Number(input)
  const isValid = input.trim() !== "" && !isNaN(num) && Math.abs(num) < 1e18
  const words = isValid ? numberToWords(num) : ""
  const capitalized = capitalize(words)

  return (
    <div className="space-y-6">
      <div className="max-w-md space-y-2">
        <Label>Enter a Number</Label>
        <Input
          type="number"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. 1234567"
          className="font-mono text-lg"
        />
      </div>

      {isValid && (
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">In Words (lowercase)</label>
              <CopyButton value={words} />
            </div>
            <div className="rounded-xl bg-muted p-4 text-lg">{words}</div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Capitalized</label>
              <CopyButton value={capitalized} />
            </div>
            <div className="rounded-xl bg-primary/10 p-4 text-lg font-medium">{capitalized}</div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div className="rounded-xl border p-3 text-center">
              <div className="text-xs text-muted-foreground">Digits</div>
              <div className="font-semibold">{Math.abs(num).toString().length}</div>
            </div>
            <div className="rounded-xl border p-3 text-center">
              <div className="text-xs text-muted-foreground">Word Count</div>
              <div className="font-semibold">{words.split(/\s+/).length}</div>
            </div>
            <div className="rounded-xl border p-3 text-center">
              <div className="text-xs text-muted-foreground">Characters</div>
              <div className="font-semibold">{words.length}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
