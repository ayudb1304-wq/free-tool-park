"use client"

import { useState, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CopyButton } from "@/components/ui/copy-button"

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) }
    : { r: 0, g: 0, b: 0 }
}

function rgbToHsl(r: number, g: number, b: number) {
  r /= 255; g /= 255; b /= 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  const l = (max + min) / 2
  let h = 0, s = 0

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
      case g: h = ((b - r) / d + 2) / 6; break
      case b: h = ((r - g) / d + 4) / 6; break
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  }
}

export default function ColorPicker() {
  const [hex, setHex] = useState("#3b82f6")

  const rgb = useMemo(() => hexToRgb(hex), [hex])
  const hsl = useMemo(() => rgbToHsl(rgb.r, rgb.g, rgb.b), [rgb])

  const formats = [
    { label: "HEX", value: hex.toUpperCase() },
    { label: "RGB", value: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` },
    { label: "HSL", value: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` },
    { label: "CSS Variable", value: `--color: ${hex};` },
  ]

  return (
    <div className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label>Pick a Color</Label>
            <Input
              type="color"
              value={hex}
              onChange={(e) => setHex(e.target.value)}
              className="h-32 w-full cursor-pointer p-1"
            />
          </div>
          <div className="space-y-1.5">
            <Label>HEX Value</Label>
            <Input
              value={hex}
              onChange={(e) => {
                const v = e.target.value
                if (/^#[0-9a-fA-F]{0,6}$/.test(v)) setHex(v)
              }}
              className="font-mono"
              maxLength={7}
            />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="space-y-1">
              <Label className="text-xs">R</Label>
              <Input
                type="number"
                min={0}
                max={255}
                value={rgb.r}
                onChange={(e) => {
                  const r = Math.min(255, Math.max(0, Number(e.target.value)))
                  setHex(`#${r.toString(16).padStart(2, "0")}${rgb.g.toString(16).padStart(2, "0")}${rgb.b.toString(16).padStart(2, "0")}`)
                }}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">G</Label>
              <Input
                type="number"
                min={0}
                max={255}
                value={rgb.g}
                onChange={(e) => {
                  const g = Math.min(255, Math.max(0, Number(e.target.value)))
                  setHex(`#${rgb.r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${rgb.b.toString(16).padStart(2, "0")}`)
                }}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">B</Label>
              <Input
                type="number"
                min={0}
                max={255}
                value={rgb.b}
                onChange={(e) => {
                  const b = Math.min(255, Math.max(0, Number(e.target.value)))
                  setHex(`#${rgb.r.toString(16).padStart(2, "0")}${rgb.g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`)
                }}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div
            className="h-32 rounded-xl border"
            style={{ backgroundColor: hex }}
          />
          <div className="space-y-2">
            {formats.map((f) => (
              <div
                key={f.label}
                className="flex items-center justify-between rounded-xl border px-3 py-2"
              >
                <div>
                  <div className="text-xs text-muted-foreground">{f.label}</div>
                  <div className="font-mono text-sm">{f.value}</div>
                </div>
                <CopyButton value={f.value} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
