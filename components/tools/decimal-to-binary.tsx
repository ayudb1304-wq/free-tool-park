"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CopyButton } from "@/components/ui/copy-button"

export default function DecimalToBinary() {
  const [decimal, setDecimal] = useState("")
  const [binary, setBinary] = useState("")

  function handleDecimalChange(value: string) {
    setDecimal(value)
    const num = parseInt(value, 10)
    if (!isNaN(num) && num >= 0) {
      setBinary(num.toString(2))
    } else {
      setBinary("")
    }
  }

  function handleBinaryChange(value: string) {
    const clean = value.replace(/[^01]/g, "")
    setBinary(clean)
    if (clean && /^[01]+$/.test(clean)) {
      setDecimal(parseInt(clean, 2).toString())
    } else {
      setDecimal("")
    }
  }

  const num = parseInt(decimal, 10)
  const isValid = !isNaN(num) && num >= 0

  function formatBinary(bin: string): string {
    const padded = bin.padStart(Math.ceil(bin.length / 4) * 4, "0")
    return padded.replace(/(.{4})/g, "$1 ").trim()
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Decimal Number</Label>
          <Input
            type="number"
            min={0}
            value={decimal}
            onChange={(e) => handleDecimalChange(e.target.value)}
            placeholder="e.g. 255"
            className="font-mono text-lg"
          />
        </div>
        <div className="space-y-2">
          <Label>Binary Number</Label>
          <Input
            value={binary}
            onChange={(e) => handleBinaryChange(e.target.value)}
            placeholder="e.g. 11111111"
            className="font-mono text-lg"
          />
        </div>
      </div>

      {isValid && binary && (
        <div className="space-y-3">
          <div className="rounded-xl bg-primary/10 p-4 text-center">
            <div className="text-xs text-muted-foreground">Binary (grouped)</div>
            <div className="font-mono text-xl font-bold text-primary">{formatBinary(binary)}</div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Decimal", value: num.toString() },
              { label: "Binary", value: binary },
              { label: "Octal", value: num.toString(8) },
              { label: "Hexadecimal", value: num.toString(16).toUpperCase() },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between rounded-xl border p-3">
                <div>
                  <div className="text-xs text-muted-foreground">{item.label}</div>
                  <div className="font-mono font-semibold">{item.value}</div>
                </div>
                <CopyButton value={item.value} />
              </div>
            ))}
          </div>

          <div className="rounded-xl border p-3 text-center text-sm text-muted-foreground">
            {binary.length} bits needed to represent {num}
          </div>
        </div>
      )}
    </div>
  )
}
