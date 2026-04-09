"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CopyButton } from "@/components/ui/copy-button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const UNITS: { key: string; label: string; toMeters: number }[] = [
  { key: "mm", label: "Millimeters (mm)", toMeters: 0.001 },
  { key: "cm", label: "Centimeters (cm)", toMeters: 0.01 },
  { key: "m", label: "Meters (m)", toMeters: 1 },
  { key: "km", label: "Kilometers (km)", toMeters: 1000 },
  { key: "in", label: "Inches (in)", toMeters: 0.0254 },
  { key: "ft", label: "Feet (ft)", toMeters: 0.3048 },
  { key: "yd", label: "Yards (yd)", toMeters: 0.9144 },
  { key: "mi", label: "Miles (mi)", toMeters: 1609.344 },
  { key: "nm", label: "Nautical Miles (nmi)", toMeters: 1852 },
]

function convertLength(value: number, from: string, to: string): number {
  const fromUnit = UNITS.find((u) => u.key === from)
  const toUnit = UNITS.find((u) => u.key === to)
  if (!fromUnit || !toUnit) return 0
  return (value * fromUnit.toMeters) / toUnit.toMeters
}

function formatNum(n: number): string {
  if (Math.abs(n) >= 0.01 && Math.abs(n) < 1e12) {
    return n.toLocaleString("en-US", { maximumFractionDigits: 6 })
  }
  return n.toExponential(4)
}

export default function LengthConverter() {
  const [value, setValue] = useState("")
  const [from, setFrom] = useState("m")
  const [to, setTo] = useState("ft")

  const num = Number(value)
  const isValid = value.trim() !== "" && !isNaN(num)
  const result = isValid ? convertLength(num, from, to) : 0

  const fromLabel = UNITS.find((u) => u.key === from)?.label || from
  const toLabel = UNITS.find((u) => u.key === to)?.label || to

  return (
    <div className="space-y-6">
      <div className="grid max-w-lg gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>From</Label>
          <Select value={from} onValueChange={setFrom}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {UNITS.map((u) => <SelectItem key={u.key} value={u.key}>{u.label}</SelectItem>)}
            </SelectContent>
          </Select>
          <Input type="number" value={value} onChange={(e) => setValue(e.target.value)} placeholder="Enter value" className="text-lg" />
        </div>
        <div className="space-y-2">
          <Label>To</Label>
          <Select value={to} onValueChange={setTo}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {UNITS.map((u) => <SelectItem key={u.key} value={u.key}>{u.label}</SelectItem>)}
            </SelectContent>
          </Select>
          {isValid && (
            <div className="flex items-center gap-2 rounded-xl bg-primary/10 p-3">
              <span className="text-lg font-bold text-primary">{formatNum(result)}</span>
              <CopyButton value={formatNum(result)} />
            </div>
          )}
        </div>
      </div>

      {isValid && (
        <div className="space-y-2">
          <label className="text-sm font-medium">All Conversions</label>
          <div className="grid gap-2 sm:grid-cols-3">
            {UNITS.filter((u) => u.key !== from).map((u) => {
              const val = convertLength(num, from, u.key)
              return (
                <div key={u.key} className="flex items-center justify-between rounded-lg border px-3 py-2">
                  <div>
                    <div className="text-xs text-muted-foreground">{u.label}</div>
                    <div className="font-mono font-semibold">{formatNum(val)}</div>
                  </div>
                  <CopyButton value={formatNum(val)} />
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
