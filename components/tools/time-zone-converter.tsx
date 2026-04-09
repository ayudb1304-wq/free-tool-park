"use client"

import { useState, useMemo } from "react"
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

const ZONES: { label: string; offset: number }[] = [
  { label: "UTC-12:00 (Baker Island)", offset: -12 },
  { label: "UTC-11:00 (Samoa)", offset: -11 },
  { label: "UTC-10:00 (Hawaii, HST)", offset: -10 },
  { label: "UTC-09:00 (Alaska, AKST)", offset: -9 },
  { label: "UTC-08:00 (Pacific, PST)", offset: -8 },
  { label: "UTC-07:00 (Mountain, MST)", offset: -7 },
  { label: "UTC-06:00 (Central, CST)", offset: -6 },
  { label: "UTC-05:00 (Eastern, EST)", offset: -5 },
  { label: "UTC-04:00 (Atlantic, AST)", offset: -4 },
  { label: "UTC-03:00 (Buenos Aires)", offset: -3 },
  { label: "UTC-02:00 (Mid-Atlantic)", offset: -2 },
  { label: "UTC-01:00 (Azores)", offset: -1 },
  { label: "UTC+00:00 (London, GMT)", offset: 0 },
  { label: "UTC+01:00 (Paris, CET)", offset: 1 },
  { label: "UTC+02:00 (Cairo, EET)", offset: 2 },
  { label: "UTC+03:00 (Moscow, MSK)", offset: 3 },
  { label: "UTC+04:00 (Dubai, GST)", offset: 4 },
  { label: "UTC+05:00 (Karachi, PKT)", offset: 5 },
  { label: "UTC+05:30 (India, IST)", offset: 5.5 },
  { label: "UTC+06:00 (Dhaka, BST)", offset: 6 },
  { label: "UTC+07:00 (Bangkok, ICT)", offset: 7 },
  { label: "UTC+08:00 (Singapore, SGT)", offset: 8 },
  { label: "UTC+09:00 (Tokyo, JST)", offset: 9 },
  { label: "UTC+09:30 (Adelaide, ACST)", offset: 9.5 },
  { label: "UTC+10:00 (Sydney, AEST)", offset: 10 },
  { label: "UTC+11:00 (Solomon Is.)", offset: 11 },
  { label: "UTC+12:00 (Auckland, NZST)", offset: 12 },
]

function formatTime(date: Date): string {
  return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true })
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", { weekday: "short", year: "numeric", month: "short", day: "numeric" })
}

export default function TimeZoneConverter() {
  const [fromZone, setFromZone] = useState("0")
  const [toZone, setToZone] = useState("-5")
  const [time, setTime] = useState("12:00")
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])

  const result = useMemo(() => {
    const [hours, minutes] = time.split(":").map(Number)
    const base = new Date(date + "T00:00:00Z")
    base.setUTCHours(hours - Number(fromZone), minutes, 0, 0)
    const targetMs = base.getTime() + Number(toZone) * 3600000
    return new Date(targetMs)
  }, [time, date, fromZone, toZone])

  const diff = Number(toZone) - Number(fromZone)
  const diffStr = diff >= 0 ? `+${diff}h` : `${diff}h`

  const fromLabel = ZONES.find((z) => z.offset === Number(fromZone))?.label || ""
  const toLabel = ZONES.find((z) => z.offset === Number(toZone))?.label || ""

  const summary = `${time} ${fromLabel} = ${formatTime(result)} ${toLabel}`

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-3">
          <Label>From Time Zone</Label>
          <Select value={fromZone} onValueChange={setFromZone}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {ZONES.map((z) => <SelectItem key={z.offset} value={z.offset.toString()}>{z.label}</SelectItem>)}
            </SelectContent>
          </Select>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label className="text-xs">Time</Label>
              <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Date</Label>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <Label>To Time Zone</Label>
          <Select value={toZone} onValueChange={setToZone}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {ZONES.map((z) => <SelectItem key={z.offset} value={z.offset.toString()}>{z.label}</SelectItem>)}
            </SelectContent>
          </Select>
          <div className="rounded-xl bg-primary/10 p-4 text-center">
            <div className="text-xs text-muted-foreground">Converted Time</div>
            <div className="text-2xl font-bold text-primary">{formatTime(result)}</div>
            <div className="text-sm text-muted-foreground">{formatDate(result)}</div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="rounded-lg border px-3 py-1 text-sm">
          Time difference: <span className="font-semibold">{diffStr}</span>
        </div>
        <CopyButton value={summary} label="Copy Result" />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Popular Time Zones</label>
        <div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {ZONES.filter((z) => [-8, -5, 0, 5.5, 8, 9].includes(z.offset)).map((z) => {
            const base = new Date(date + "T00:00:00Z")
            const [h, m] = time.split(":").map(Number)
            base.setUTCHours(h - Number(fromZone), m, 0, 0)
            const t = new Date(base.getTime() + z.offset * 3600000)
            return (
              <div key={z.offset} className="rounded-lg border px-3 py-2 text-center">
                <div className="text-xs text-muted-foreground">{z.label.split("(")[1]?.replace(")", "") || z.label}</div>
                <div className="font-mono font-semibold">{formatTime(t)}</div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
