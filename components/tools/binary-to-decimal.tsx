"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CopyButton } from "@/components/ui/copy-button"

export default function BinaryToDecimal() {
  const [binary, setBinary] = useState("")
  const [decimal, setDecimal] = useState("")

  function handleBinaryChange(value: string) {
    const clean = value.replace(/[^01\s]/g, "")
    setBinary(clean)
    const stripped = clean.replace(/\s/g, "")
    if (stripped && /^[01]+$/.test(stripped)) {
      setDecimal(parseInt(stripped, 2).toString())
    } else {
      setDecimal("")
    }
  }

  function handleDecimalChange(value: string) {
    setDecimal(value)
    const num = parseInt(value, 10)
    if (!isNaN(num) && num >= 0) {
      setBinary(num.toString(2))
    } else {
      setBinary("")
    }
  }

  const stripped = binary.replace(/\s/g, "")
  const isValid = stripped.length > 0 && /^[01]+$/.test(stripped)
  const decNum = isValid ? parseInt(stripped, 2) : 0

  return (
    <div className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Binary Number</Label>
          <Input
            value={binary}
            onChange={(e) => handleBinaryChange(e.target.value)}
            placeholder="e.g. 10110101"
            className="font-mono text-lg"
          />
          {binary && !isValid && binary.replace(/\s/g, "").length > 0 && (
            <p className="text-xs text-destructive">Please enter only 0s and 1s</p>
          )}
        </div>
        <div className="space-y-2">
          <Label>Decimal Number</Label>
          <Input
            type="number"
            min={0}
            value={decimal}
            onChange={(e) => handleDecimalChange(e.target.value)}
            placeholder="e.g. 181"
            className="font-mono text-lg"
          />
        </div>
      </div>

      {isValid && (
        <div className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Binary", value: stripped },
              { label: "Decimal", value: decNum.toString() },
              { label: "Octal", value: decNum.toString(8) },
              { label: "Hexadecimal", value: decNum.toString(16).toUpperCase() },
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
        </div>
      )}
    </div>
  )
}
