"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { CopyButton } from "@/components/ui/copy-button"

interface AgeResult {
  years: number
  months: number
  days: number
  totalDays: number
  totalWeeks: number
  totalMonths: number
  nextBirthday: number
}

function calcAge(birthDate: Date, toDate: Date): AgeResult | null {
  if (birthDate >= toDate) return null

  let years = toDate.getFullYear() - birthDate.getFullYear()
  let months = toDate.getMonth() - birthDate.getMonth()
  let days = toDate.getDate() - birthDate.getDate()

  if (days < 0) {
    months--
    const prevMonth = new Date(toDate.getFullYear(), toDate.getMonth(), 0)
    days += prevMonth.getDate()
  }

  if (months < 0) {
    years--
    months += 12
  }

  const totalDays = Math.floor(
    (toDate.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24)
  )
  const totalWeeks = Math.floor(totalDays / 7)
  const totalMonths = years * 12 + months

  // Days until next birthday
  const nextBday = new Date(
    toDate.getFullYear(),
    birthDate.getMonth(),
    birthDate.getDate()
  )
  if (nextBday <= toDate) {
    nextBday.setFullYear(nextBday.getFullYear() + 1)
  }
  const nextBirthday = Math.ceil(
    (nextBday.getTime() - toDate.getTime()) / (1000 * 60 * 60 * 24)
  )

  return { years, months, days, totalDays, totalWeeks, totalMonths, nextBirthday }
}

export default function AgeCalculator() {
  const [birthDate, setBirthDate] = useState("")
  const [toDate, setToDate] = useState(
    new Date().toISOString().split("T")[0]
  )
  const [result, setResult] = useState<AgeResult | null>(null)

  function handleCalculate() {
    if (!birthDate) return
    setResult(calcAge(new Date(birthDate), new Date(toDate)))
  }

  const summary = result
    ? `Age: ${result.years} years, ${result.months} months, ${result.days} days`
    : ""

  return (
    <div className="space-y-6">
      <div className="grid max-w-md gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label>Date of Birth</Label>
          <Input
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label>Calculate to Date</Label>
          <Input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </div>
      </div>

      <Button onClick={handleCalculate}>Calculate Age</Button>

      {result && (
        <div className="space-y-4">
          <div className="flex items-center gap-3 rounded-xl bg-primary/10 p-4">
            <div>
              <div className="text-sm text-muted-foreground">Your age is</div>
              <div className="text-2xl font-bold">
                {result.years} years, {result.months} months, {result.days} days
              </div>
            </div>
            <CopyButton value={summary} className="ml-auto shrink-0" />
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Total Days", value: result.totalDays.toLocaleString() },
              { label: "Total Weeks", value: result.totalWeeks.toLocaleString() },
              { label: "Total Months", value: result.totalMonths.toLocaleString() },
              {
                label: "Next Birthday",
                value: `${result.nextBirthday} days`,
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border p-3 text-center"
              >
                <div className="text-xs text-muted-foreground">{stat.label}</div>
                <div className="text-lg font-semibold">{stat.value}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
