"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { CopyButton } from "@/components/ui/copy-button"

type TempUnit = "celsius" | "fahrenheit" | "kelvin"

function convert(value: number, from: TempUnit, to: TempUnit): number {
  let celsius: number
  if (from === "celsius") celsius = value
  else if (from === "fahrenheit") celsius = (value - 32) * (5 / 9)
  else celsius = value - 273.15

  if (to === "celsius") return celsius
  if (to === "fahrenheit") return celsius * (9 / 5) + 32
  return celsius + 273.15
}

const UNITS: { key: TempUnit; label: string; symbol: string }[] = [
  { key: "celsius", label: "Celsius", symbol: "°C" },
  { key: "fahrenheit", label: "Fahrenheit", symbol: "°F" },
  { key: "kelvin", label: "Kelvin", symbol: "K" },
]

export default function TemperatureConverter() {
  const [value, setValue] = useState("")
  const [from, setFrom] = useState<TempUnit>("celsius")

  const num = Number(value)
  const isValid = value.trim() !== "" && !isNaN(num)

  const results = isValid
    ? UNITS.filter((u) => u.key !== from).map((u) => ({
        ...u,
        value: convert(num, from, u.key),
      }))
    : []

  const fromSymbol = UNITS.find((u) => u.key === from)?.symbol || ""
  const summary = isValid
    ? `${num}${fromSymbol} = ${results.map((r) => `${r.value.toFixed(2)}${r.symbol}`).join(" = ")}`
    : ""

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {UNITS.map((u) => (
          <Button key={u.key} variant={from === u.key ? "default" : "secondary"} size="sm" onClick={() => setFrom(u.key)}>
            {u.label} ({u.symbol})
          </Button>
        ))}
      </div>

      <div className="max-w-xs space-y-2">
        <Label>Temperature in {UNITS.find((u) => u.key === from)?.label}</Label>
        <Input
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="e.g. 100"
          className="text-lg"
        />
      </div>

      {isValid && (
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl bg-muted p-4 text-center">
              <div className="text-xs text-muted-foreground">{UNITS.find((u) => u.key === from)?.label}</div>
              <div className="text-xl font-bold">{num}{fromSymbol}</div>
            </div>
            {results.map((r) => (
              <div key={r.key} className="rounded-xl bg-primary/10 p-4 text-center">
                <div className="text-xs text-muted-foreground">{r.label}</div>
                <div className="text-xl font-bold text-primary">{r.value.toFixed(2)}{r.symbol}</div>
              </div>
            ))}
          </div>
          <CopyButton value={summary} label="Copy Results" />

          <div className="rounded-xl border p-4">
            <h3 className="text-sm font-medium mb-2">Common Temperatures</h3>
            <div className="grid grid-cols-3 gap-2 text-sm">
              <div className="text-muted-foreground">Water freezes</div><div className="font-mono">0°C</div><div className="font-mono">32°F</div>
              <div className="text-muted-foreground">Body temperature</div><div className="font-mono">37°C</div><div className="font-mono">98.6°F</div>
              <div className="text-muted-foreground">Water boils</div><div className="font-mono">100°C</div><div className="font-mono">212°F</div>
              <div className="text-muted-foreground">Absolute zero</div><div className="font-mono">-273.15°C</div><div className="font-mono">0K</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
