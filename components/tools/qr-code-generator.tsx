"use client"

import { useState, useRef, useCallback } from "react"
import QRCode from "qrcode"
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

export default function QrCodeGenerator() {
  const [text, setText] = useState("")
  const [size, setSize] = useState("256")
  const [color, setColor] = useState("#000000")
  const [bgColor, setBgColor] = useState("#ffffff")
  const [error, setError] = useState("")
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [generated, setGenerated] = useState(false)

  const generate = useCallback(async () => {
    if (!text.trim()) {
      setError("Please enter text or a URL.")
      return
    }
    if (!canvasRef.current) return

    try {
      await QRCode.toCanvas(canvasRef.current, text, {
        width: Number(size),
        margin: 2,
        color: {
          dark: color,
          light: bgColor,
        },
        errorCorrectionLevel: "M",
      })
      setGenerated(true)
      setError("")
    } catch (e) {
      setError((e as Error).message)
      setGenerated(false)
    }
  }, [text, size, color, bgColor])

  function download() {
    if (!canvasRef.current) return
    const link = document.createElement("a")
    link.download = "qrcode.png"
    link.href = canvasRef.current.toDataURL("image/png")
    link.click()
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label>Text or URL</Label>
            <Input
              placeholder="Enter text or URL..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label>Size</Label>
              <Select value={size} onValueChange={setSize}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="128">128px</SelectItem>
                  <SelectItem value="256">256px</SelectItem>
                  <SelectItem value="512">512px</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Color</Label>
              <Input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="h-9 cursor-pointer p-1"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Background</Label>
              <Input
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="h-9 cursor-pointer p-1"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={generate}>Generate QR Code</Button>
            {generated && (
              <Button variant="outline" onClick={download}>
                Download PNG
              </Button>
            )}
          </div>
          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
        </div>
        <div className="flex items-center justify-center rounded-xl border bg-muted/30 p-4">
          <canvas
            ref={canvasRef}
            className={generated ? "max-w-full" : "hidden"}
          />
          {!generated && (
            <p className="text-sm text-muted-foreground">
              QR code will appear here
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
