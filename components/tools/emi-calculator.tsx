"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { CopyButton } from "@/components/ui/copy-button"
import { ShareResult } from "@/components/tools/share-result"
import { CalculationHistory } from "@/components/tools/calculation-history"
import type { HistoryItem } from "@/components/tools/calculation-history"
import { useLocalStorage } from "@/hooks/use-local-storage"

function formatNum(n: number) {
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
}

interface EMIResult {
  emi: number
  totalInterest: number
  totalPayment: number
}

function calcEMI(principal: number, annualRate: number, tenureMonths: number): EMIResult | null {
  if (principal <= 0 || tenureMonths <= 0) return null

  const monthlyRate = annualRate / 100 / 12

  let emi: number
  if (monthlyRate === 0) {
    emi = principal / tenureMonths
  } else {
    emi =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
      (Math.pow(1 + monthlyRate, tenureMonths) - 1)
  }

  const totalPayment = emi * tenureMonths
  const totalInterest = totalPayment - principal

  return { emi, totalInterest, totalPayment }
}

export default function EmiCalculator() {
  const [principal, setPrincipal] = useState("500000")
  const [rate, setRate] = useState("8.5")
  const [tenureYears, setTenureYears] = useState("5")
  const [result, setResult] = useState<EMIResult | null>(null)
  const [, setHistory] = useLocalStorage<HistoryItem[]>(
    "emi-calculator-history",
    []
  )

  function handleCalculate() {
    const r = calcEMI(Number(principal), Number(rate), Number(tenureYears) * 12)
    setResult(r)

    if (r) {
      const params = new URLSearchParams({ p: principal, r: rate, t: tenureYears })
      const url = `${window.location.origin}/tools/emi-calculator?${params}`
      setHistory((prev) => [
        {
          id: crypto.randomUUID(),
          timestamp: Date.now(),
          inputs: { principal, rate, tenureYears },
          result: { emi: r.emi, totalInterest: r.totalInterest, totalPayment: r.totalPayment },
          shareableUrl: url,
        },
        ...prev.slice(0, 9),
      ])
    }
  }

  function getShareUrl() {
    const params = new URLSearchParams({ p: principal, r: rate, t: tenureYears })
    return `${typeof window !== "undefined" ? window.location.origin : ""}/tools/emi-calculator?${params}`
  }

  const summary = result
    ? `Monthly EMI: ${formatNum(result.emi)} | Total Interest: ${formatNum(result.totalInterest)} | Total Payment: ${formatNum(result.totalPayment)}`
    : ""

  const principalPercent = result
    ? Math.round((Number(principal) / result.totalPayment) * 100)
    : 0
  const interestPercent = result ? 100 - principalPercent : 0

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-1.5">
          <Label>Loan Amount ($)</Label>
          <Input
            type="number"
            value={principal}
            onChange={(e) => setPrincipal(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label>Interest Rate (% per year)</Label>
          <Input
            type="number"
            step="0.1"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label>Loan Tenure (years)</Label>
          <Input
            type="number"
            value={tenureYears}
            onChange={(e) => setTenureYears(e.target.value)}
          />
        </div>
      </div>

      <Button onClick={handleCalculate}>Calculate EMI</Button>

      {result && (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl bg-primary/10 p-4 text-center">
              <div className="text-sm text-muted-foreground">Monthly EMI</div>
              <div className="text-2xl font-bold text-primary">
                {formatNum(result.emi)}
              </div>
            </div>
            <div className="rounded-xl bg-muted p-4 text-center">
              <div className="text-sm text-muted-foreground">Total Interest</div>
              <div className="text-xl font-semibold">
                {formatNum(result.totalInterest)}
              </div>
            </div>
            <div className="rounded-xl bg-muted p-4 text-center">
              <div className="text-sm text-muted-foreground">Total Payment</div>
              <div className="text-xl font-semibold">
                {formatNum(result.totalPayment)}
              </div>
            </div>
          </div>

          {/* Visual breakdown bar */}
          <div className="space-y-2">
            <div className="text-sm font-medium">Payment Breakdown</div>
            <div className="flex h-6 overflow-hidden rounded-full">
              <div
                className="bg-primary transition-all"
                style={{ width: `${principalPercent}%` }}
              />
              <div
                className="bg-destructive/60 transition-all"
                style={{ width: `${interestPercent}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Principal ({principalPercent}%)</span>
              <span>Interest ({interestPercent}%)</span>
            </div>
          </div>

          <CopyButton value={summary} label="Copy Results" />

          <ShareResult
            url={getShareUrl()}
            resultText={`My monthly EMI: ${formatNum(result.emi)} for a ${formatNum(Number(principal))} loan`}
            toolName="EMI Calculator"
            hashtags={["EMI", "Finance"]}
          />
        </div>
      )}

      <CalculationHistory
        toolSlug="emi-calculator"
        formatResult={(r) => {
          const res = r as { emi: number }
          return formatNum(res.emi)
        }}
        formatInputs={(inputs) =>
          `${formatNum(Number(inputs.principal))}, ${inputs.rate}%, ${inputs.tenureYears} years`
        }
      />
    </div>
  )
}
