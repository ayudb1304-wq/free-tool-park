"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { CopyButton } from "@/components/ui/copy-button"

type GradientType = "linear" | "radial" | "conic"

interface ColorStop {
  color: string
  position: number
}

export default function CssGradientGenerator() {
  const [type, setType] = useState<GradientType>("linear")
  const [angle, setAngle] = useState(90)
  const [stops, setStops] = useState<ColorStop[]>([
    { color: "#3b82f6", position: 0 },
    { color: "#8b5cf6", position: 100 },
  ])

  function updateStop(index: number, field: keyof ColorStop, value: string | number) {
    setStops((prev) =>
      prev.map((s, i) => (i === index ? { ...s, [field]: value } : s))
    )
  }

  function addStop() {
    if (stops.length >= 6) return
    const lastPos = stops[stops.length - 1]?.position ?? 100
    const newPos = Math.min(100, lastPos)
    setStops([...stops, { color: "#10b981", position: newPos }])
  }

  function removeStop(index: number) {
    if (stops.length <= 2) return
    setStops((prev) => prev.filter((_, i) => i !== index))
  }

  const stopsStr = stops
    .map((s) => `${s.color} ${s.position}%`)
    .join(", ")

  let cssValue: string
  switch (type) {
    case "linear":
      cssValue = `linear-gradient(${angle}deg, ${stopsStr})`
      break
    case "radial":
      cssValue = `radial-gradient(circle, ${stopsStr})`
      break
    case "conic":
      cssValue = `conic-gradient(from ${angle}deg, ${stopsStr})`
      break
  }

  const cssCode = `background: ${cssValue};`

  return (
    <div className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Type</Label>
              <Select
                value={type}
                onValueChange={(v) => setType(v as GradientType)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="linear">Linear</SelectItem>
                  <SelectItem value="radial">Radial</SelectItem>
                  <SelectItem value="conic">Conic</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {type !== "radial" && (
              <div className="space-y-1.5">
                <Label>Angle: {angle}deg</Label>
                <Input
                  type="range"
                  min={0}
                  max={360}
                  value={angle}
                  onChange={(e) => setAngle(Number(e.target.value))}
                  className="h-9 cursor-pointer"
                />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label>Color Stops</Label>
            {stops.map((stop, i) => (
              <div key={i} className="flex items-center gap-2">
                <Input
                  type="color"
                  value={stop.color}
                  onChange={(e) => updateStop(i, "color", e.target.value)}
                  className="h-9 w-12 cursor-pointer p-1"
                />
                <Input
                  value={stop.color}
                  onChange={(e) => updateStop(i, "color", e.target.value)}
                  className="w-24 font-mono text-xs"
                />
                <Input
                  type="number"
                  min={0}
                  max={100}
                  value={stop.position}
                  onChange={(e) =>
                    updateStop(i, "position", Number(e.target.value))
                  }
                  className="w-16 text-xs"
                />
                <span className="text-xs text-muted-foreground">%</span>
                {stops.length > 2 && (
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => removeStop(i)}
                    aria-label="Remove stop"
                  >
                    &times;
                  </Button>
                )}
              </div>
            ))}
            {stops.length < 6 && (
              <Button variant="outline" size="sm" onClick={addStop}>
                Add Color Stop
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div
            className="h-48 rounded-xl border"
            style={{ background: cssValue }}
          />
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>CSS Code</Label>
              <CopyButton value={cssCode} label="Copy CSS" />
            </div>
            <pre className="rounded-xl border bg-muted/30 p-3 font-mono text-sm whitespace-pre-wrap break-all">
              {cssCode}
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}
