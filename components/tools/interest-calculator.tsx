"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { CopyButton } from "@/components/ui/copy-button"

type Mode = "compound" | "simple"

interface YearRow {
  year: number
  balance: number
  interest: number
  totalInterest: number
}

function calcCompound(principal: number, rate: number, years: number, compPerYear: number): YearRow[] {
  const rows: YearRow[] = []
  let balance = principal
  let totalInterest = 0
  for (let y = 1; y <= years; y++) {
    const prev = balance
    balance = balance * Math.pow(1 + rate / 100 / compPerYear, compPerYear)
    const interest = balance - prev
    totalInterest += interest
    rows.push({ year: y, balance, interest, totalInterest })
  }
  return rows
}

function calcSimple(principal: number, rate: number, years: number): YearRow[] {
  const rows: YearRow[] = []
  const annualInterest = principal * (rate / 100)
  for (let y = 1; y <= years; y++) {
    rows.push({
      year: y,
      balance: principal + annualInterest * y,
      interest: annualInterest,
      totalInterest: annualInterest * y,
    })
  }
  return rows
}

const COMPOUND_OPTIONS = [
  { label: "Annually", value: 1 },
  { label: "Semi-Annually", value: 2 },
  { label: "Quarterly", value: 4 },
  { label: "Monthly", value: 12 },
  { label: "Daily", value: 365 },
]

function fmt(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD" })
}

export default function InterestCalculator() {
  const [mode, setMode] = useState<Mode>("compound")
  const [principal, setPrincipal] = useState("10000")
  const [rate, setRate] = useState("5")
  const [years, setYears] = useState("10")
  const [compFreq, setCompFreq] = useState(12)
  const [rows, setRows] = useState<YearRow[]>([])
  const [calculated, setCalculated] = useState(false)

  function handleCalc() {
    const p = Number(principal)
    const r = Number(rate)
    const y = Number(years)
    if (p <= 0 || r <= 0 || y <= 0) return
    const result = mode === "compound" ? calcCompound(p, r, y, compFreq) : calcSimple(p, r, y)
    setRows(result)
    setCalculated(true)
  }

  const lastRow = rows[rows.length - 1]
  const summary = lastRow
    ? `Principal: ${fmt(Number(principal))} | Total Interest: ${fmt(lastRow.totalInterest)} | Final Balance: ${fmt(lastRow.balance)}`
    : ""

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <Button variant={mode === "compound" ? "default" : "secondary"} size="sm" onClick={() => { setMode("compound"); setCalculated(false) }}>
          Compound Interest
        </Button>
        <Button variant={mode === "simple" ? "default" : "secondary"} size="sm" onClick={() => { setMode("simple"); setCalculated(false) }}>
          Simple Interest
        </Button>
      </div>

      <div className="grid max-w-lg gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label>Principal Amount ($)</Label>
          <Input type="number" value={principal} onChange={(e) => setPrincipal(e.target.value)} placeholder="e.g. 10000" />
        </div>
        <div className="space-y-1.5">
          <Label>Annual Interest Rate (%)</Label>
          <Input type="number" step="0.01" value={rate} onChange={(e) => setRate(e.target.value)} placeholder="e.g. 5" />
        </div>
        <div className="space-y-1.5">
          <Label>Time Period (Years)</Label>
          <Input type="number" value={years} onChange={(e) => setYears(e.target.value)} placeholder="e.g. 10" />
        </div>
        {mode === "compound" && (
          <div className="space-y-1.5">
            <Label>Compounding Frequency</Label>
            <div className="flex flex-wrap gap-1.5">
              {COMPOUND_OPTIONS.map((o) => (
                <Button key={o.value} variant={compFreq === o.value ? "default" : "secondary"} size="sm" onClick={() => setCompFreq(o.value)}>
                  {o.label}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>

      <Button onClick={handleCalc}>Calculate Interest</Button>

      {calculated && lastRow && (
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl bg-muted p-4 text-center">
              <div className="text-xs text-muted-foreground">Principal</div>
              <div className="text-lg font-bold">{fmt(Number(principal))}</div>
            </div>
            <div className="rounded-xl bg-muted p-4 text-center">
              <div className="text-xs text-muted-foreground">Total Interest</div>
              <div className="text-lg font-bold">{fmt(lastRow.totalInterest)}</div>
            </div>
            <div className="rounded-xl bg-primary/10 p-4 text-center">
              <div className="text-xs text-muted-foreground">Final Balance</div>
              <div className="text-lg font-bold text-primary">{fmt(lastRow.balance)}</div>
            </div>
          </div>

          <CopyButton value={summary} label="Copy Results" />

          <div className="max-h-64 overflow-auto rounded-xl border">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-muted">
                <tr>
                  <th className="p-2 text-left">Year</th>
                  <th className="p-2 text-right">Interest</th>
                  <th className="p-2 text-right">Total Interest</th>
                  <th className="p-2 text-right">Balance</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.year} className="border-t">
                    <td className="p-2">{r.year}</td>
                    <td className="p-2 text-right">{fmt(r.interest)}</td>
                    <td className="p-2 text-right">{fmt(r.totalInterest)}</td>
                    <td className="p-2 text-right font-medium">{fmt(r.balance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
