"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { CopyButton } from "@/components/ui/copy-button"
import {
  convert,
  convertTemperature,
  type ConversionUnit,
} from "@/data/conversions"

interface UnitConverterProps {
  from: ConversionUnit
  to: ConversionUnit
  categorySlug: string
  isTemperature?: boolean
}

function formatResult(n: number): string {
  if (n === 0) return "0"
  if (Math.abs(n) >= 0.001 && Math.abs(n) < 1e12) {
    return n.toLocaleString("en-US", { maximumFractionDigits: 8 })
  }
  return n.toExponential(6)
}

export function UnitConverter({
  from,
  to,
  isTemperature,
}: UnitConverterProps) {
  const [value, setValue] = useState("1")

  const num = Number(value)
  const isValid = value.trim() !== "" && !isNaN(num)

  let result = 0
  if (isValid) {
    result = isTemperature
      ? convertTemperature(num, from.key, to.key)
      : convert(num, from, to)
  }

  const resultText = isValid ? formatResult(result) : ""

  return (
    <div className="space-y-6">
      {/* Input */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="from-value">
            {from.name} ({from.abbr})
          </Label>
          <Input
            id="from-value"
            type="number"
            inputMode="decimal"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={`Enter ${from.abbr}`}
            className="text-lg"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="to-value">
            {to.name} ({to.abbr})
          </Label>
          <div className="relative">
            <Input
              id="to-value"
              type="text"
              value={resultText}
              readOnly
              className="bg-muted/50 pr-12 text-lg font-semibold"
              placeholder="Result"
            />
            {resultText && (
              <div className="absolute right-2 top-1/2 -translate-y-1/2">
                <CopyButton value={resultText} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Swap link */}
      <div className="flex items-center justify-center">
        <Button variant="outline" size="sm" asChild>
          <a href={`/tools/convert/${to.key}-to-${from.key}`}>
            Swap: {to.abbr} to {from.abbr}
          </a>
        </Button>
      </div>

      {/* Quick result sentence */}
      {isValid && (
        <p className="text-center text-lg">
          <span className="font-semibold">
            {num.toLocaleString("en-US")} {from.abbr}
          </span>
          {" = "}
          <span className="font-semibold text-primary">
            {resultText} {to.abbr}
          </span>
        </p>
      )}
    </div>
  )
}
