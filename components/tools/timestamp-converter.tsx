"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { CopyButton } from "@/components/ui/copy-button"

export default function TimestampConverter() {
  const [timestamp, setTimestamp] = useState("")
  const [dateStr, setDateStr] = useState("")
  const [currentTs, setCurrentTs] = useState(0)
  const [result, setResult] = useState<{
    direction: "to-date" | "to-ts"
    value: string
    details: { label: string; value: string }[]
  } | null>(null)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTs(Math.floor(Date.now() / 1000))
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  function tsToDate() {
    const ts = Number(timestamp)
    if (isNaN(ts)) return

    // Auto-detect seconds vs milliseconds
    const ms = ts > 1e12 ? ts : ts * 1000
    const date = new Date(ms)

    if (isNaN(date.getTime())) return

    setResult({
      direction: "to-date",
      value: date.toISOString(),
      details: [
        { label: "ISO 8601", value: date.toISOString() },
        { label: "UTC", value: date.toUTCString() },
        { label: "Local", value: date.toLocaleString() },
        { label: "Date", value: date.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" }) },
        { label: "Time", value: date.toLocaleTimeString() },
        { label: "Unix (seconds)", value: String(Math.floor(ms / 1000)) },
        { label: "Unix (milliseconds)", value: String(ms) },
      ],
    })
  }

  function dateToTs() {
    const date = new Date(dateStr)
    if (isNaN(date.getTime())) return

    const seconds = Math.floor(date.getTime() / 1000)
    setResult({
      direction: "to-ts",
      value: String(seconds),
      details: [
        { label: "Unix (seconds)", value: String(seconds) },
        { label: "Unix (milliseconds)", value: String(date.getTime()) },
        { label: "ISO 8601", value: date.toISOString() },
        { label: "UTC", value: date.toUTCString() },
        { label: "Local", value: date.toLocaleString() },
      ],
    })
  }

  function useNow() {
    const now = Math.floor(Date.now() / 1000)
    setTimestamp(String(now))
  }

  return (
    <div className="space-y-6">
      {/* Current timestamp */}
      <div className="flex items-center gap-3 rounded-xl border bg-muted/30 px-4 py-3">
        <span className="text-sm text-muted-foreground">Current Unix timestamp:</span>
        <code className="font-mono text-sm font-semibold">{currentTs}</code>
        <CopyButton value={String(currentTs)} />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {/* Timestamp → Date */}
        <div className="space-y-3 rounded-xl border p-4">
          <Label className="text-base font-semibold">Timestamp to Date</Label>
          <div className="flex gap-2">
            <Input
              placeholder="e.g. 1700000000"
              value={timestamp}
              onChange={(e) => setTimestamp(e.target.value)}
              className="font-mono"
            />
            <Button variant="outline" size="sm" onClick={useNow}>
              Now
            </Button>
          </div>
          <Button onClick={tsToDate} size="sm">
            Convert to Date
          </Button>
        </div>

        {/* Date → Timestamp */}
        <div className="space-y-3 rounded-xl border p-4">
          <Label className="text-base font-semibold">Date to Timestamp</Label>
          <Input
            type="datetime-local"
            value={dateStr}
            onChange={(e) => setDateStr(e.target.value)}
          />
          <Button onClick={dateToTs} size="sm">
            Convert to Timestamp
          </Button>
        </div>
      </div>

      {result && (
        <div className="space-y-2">
          <Label>Result</Label>
          <div className="space-y-1">
            {result.details.map((d) => (
              <div
                key={d.label}
                className="flex items-center justify-between rounded-lg border px-3 py-2"
              >
                <div>
                  <span className="text-xs text-muted-foreground">
                    {d.label}
                  </span>
                  <div className="font-mono text-sm">{d.value}</div>
                </div>
                <CopyButton value={d.value} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
