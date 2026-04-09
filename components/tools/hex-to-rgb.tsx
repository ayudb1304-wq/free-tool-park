"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CopyButton } from "@/components/ui/copy-button"

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const clean = hex.replace(/^#/, "")
  if (!/^[0-9a-fA-F]{3}$|^[0-9a-fA-F]{6}$/.test(clean)) return null
  const full = clean.length === 3 ? clean.split("").map((c) => c + c).join("") : clean
  return {
    r: parseInt(full.slice(0, 2), 16),
    g: parseInt(full.slice(2, 4), 16),
    b: parseInt(full.slice(4, 6), 16),
  }
}

function rgbToHex(r: number, g: number, b: number): string {
  const clamp = (n: number) => Math.max(0, Math.min(255, Math.round(n)))
  return `#${[clamp(r), clamp(g), clamp(b)].map((c) => c.toString(16).padStart(2, "0")).join("")}`
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255; g /= 255; b /= 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  const l = (max + min) / 2
  if (max === min) return { h: 0, s: 0, l: Math.round(l * 100) }
  const d = max - min
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
  let h = 0
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6
  else if (max === g) h = ((b - r) / d + 2) / 6
  else h = ((r - g) / d + 4) / 6
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) }
}

export default function HexToRgb() {
  const [hex, setHex] = useState("#3b82f6")
  const [r, setR] = useState("59")
  const [g, setG] = useState("130")
  const [b, setB] = useState("246")

  const rgb = hexToRgb(hex)
  const fromRgb = rgbToHex(Number(r), Number(g), Number(b))

  function handleHexChange(value: string) {
    setHex(value)
    const parsed = hexToRgb(value)
    if (parsed) {
      setR(String(parsed.r))
      setG(String(parsed.g))
      setB(String(parsed.b))
    }
  }

  function handleRgbChange(channel: "r" | "g" | "b", value: string) {
    if (channel === "r") setR(value)
    if (channel === "g") setG(value)
    if (channel === "b") setB(value)
    const nr = channel === "r" ? Number(value) : Number(r)
    const ng = channel === "g" ? Number(value) : Number(g)
    const nb = channel === "b" ? Number(value) : Number(b)
    setHex(rgbToHex(nr, ng, nb))
  }

  const hsl = rgbToHsl(Number(r), Number(g), Number(b))
  const rgbStr = `rgb(${r}, ${g}, ${b})`
  const hslStr = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`

  return (
    <div className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label>HEX Color</Label>
            <div className="flex gap-2">
              <Input value={hex} onChange={(e) => handleHexChange(e.target.value)} placeholder="#3b82f6" className="font-mono" />
              <input type="color" value={rgb ? `#${hex.replace("#", "").padEnd(6, "0").slice(0, 6)}` : "#000000"} onChange={(e) => handleHexChange(e.target.value)} className="h-10 w-12 cursor-pointer rounded border" />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>RGB Values</Label>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <span className="text-xs text-muted-foreground">R</span>
                <Input type="number" min={0} max={255} value={r} onChange={(e) => handleRgbChange("r", e.target.value)} />
              </div>
              <div>
                <span className="text-xs text-muted-foreground">G</span>
                <Input type="number" min={0} max={255} value={g} onChange={(e) => handleRgbChange("g", e.target.value)} />
              </div>
              <div>
                <span className="text-xs text-muted-foreground">B</span>
                <Input type="number" min={0} max={255} value={b} onChange={(e) => handleRgbChange("b", e.target.value)} />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="h-32 rounded-xl border" style={{ backgroundColor: rgbStr }} />
          <div className="space-y-2">
            {[
              { label: "HEX", value: fromRgb },
              { label: "RGB", value: rgbStr },
              { label: "HSL", value: hslStr },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between rounded-lg border px-3 py-2">
                <span className="text-xs text-muted-foreground">{item.label}</span>
                <div className="flex items-center gap-2">
                  <code className="text-sm font-mono">{item.value}</code>
                  <CopyButton value={item.value} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
