"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CopyButton } from "@/components/ui/copy-button"

const ROMAN_MAP: [number, string][] = [
  [1000, "M"], [900, "CM"], [500, "D"], [400, "CD"],
  [100, "C"], [90, "XC"], [50, "L"], [40, "XL"],
  [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"],
]

function toRoman(num: number): string {
  if (num <= 0 || num > 3999) return ""
  let result = ""
  let n = num
  for (const [value, symbol] of ROMAN_MAP) {
    while (n >= value) {
      result += symbol
      n -= value
    }
  }
  return result
}

function fromRoman(roman: string): number {
  const map: Record<string, number> = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 }
  const upper = roman.toUpperCase()
  let result = 0
  for (let i = 0; i < upper.length; i++) {
    const current = map[upper[i]]
    const next = map[upper[i + 1]]
    if (!current) return 0
    if (next && current < next) {
      result -= current
    } else {
      result += current
    }
  }
  return result
}

function isValidRoman(s: string): boolean {
  return /^[IVXLCDM]+$/i.test(s) && fromRoman(s) > 0
}

export default function RomanNumeralConverter() {
  const [decimal, setDecimal] = useState("")
  const [roman, setRoman] = useState("")

  function handleDecimalChange(value: string) {
    setDecimal(value)
    const num = parseInt(value, 10)
    if (num > 0 && num <= 3999) {
      setRoman(toRoman(num))
    } else {
      setRoman("")
    }
  }

  function handleRomanChange(value: string) {
    const upper = value.toUpperCase()
    setRoman(upper)
    if (isValidRoman(upper)) {
      setDecimal(fromRoman(upper).toString())
    } else if (!value) {
      setDecimal("")
    }
  }

  const num = parseInt(decimal, 10)
  const hasResult = (num > 0 && num <= 3999) || isValidRoman(roman)

  return (
    <div className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Decimal Number (1 - 3999)</Label>
          <Input
            type="number"
            min={1}
            max={3999}
            value={decimal}
            onChange={(e) => handleDecimalChange(e.target.value)}
            placeholder="e.g. 2024"
            className="font-mono text-lg"
          />
        </div>
        <div className="space-y-2">
          <Label>Roman Numeral</Label>
          <Input
            value={roman}
            onChange={(e) => handleRomanChange(e.target.value)}
            placeholder="e.g. MMXXIV"
            className="font-mono text-lg"
          />
        </div>
      </div>

      {hasResult && (
        <div className="space-y-4">
          <div className="flex items-center gap-4 rounded-xl bg-primary/10 p-6 justify-center">
            <div className="text-center">
              <div className="text-xs text-muted-foreground">Decimal</div>
              <div className="text-2xl font-bold">{decimal}</div>
            </div>
            <span className="text-2xl text-muted-foreground">=</span>
            <div className="text-center">
              <div className="text-xs text-muted-foreground">Roman</div>
              <div className="text-2xl font-bold text-primary">{roman}</div>
            </div>
            <CopyButton value={`${decimal} = ${roman}`} />
          </div>

          <div className="rounded-xl border p-4">
            <h3 className="text-sm font-medium mb-2">Quick Reference</h3>
            <div className="flex flex-wrap gap-3 text-sm">
              {ROMAN_MAP.map(([value, symbol]) => (
                <div key={symbol} className="rounded border px-2 py-1 text-center">
                  <span className="font-mono font-bold">{symbol}</span>
                  <span className="ml-1 text-muted-foreground">= {value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
