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

function formatCurrency(n: number) {
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  })
}

interface Result {
  monthly: number
  totalPayment: number
  totalInterest: number
  schedule: { year: number; principal: number; interest: number; balance: number }[]
}

function calculate(
  principal: number,
  annualRate: number,
  years: number,
  downPayment: number,
  propertyTax: number,
  insurance: number
): Result | null {
  const loan = principal - downPayment
  if (loan <= 0 || years <= 0) return null

  const monthlyRate = annualRate / 100 / 12
  const n = years * 12

  let monthlyMortgage: number
  if (monthlyRate === 0) {
    monthlyMortgage = loan / n
  } else {
    monthlyMortgage =
      (loan * (monthlyRate * Math.pow(1 + monthlyRate, n))) /
      (Math.pow(1 + monthlyRate, n) - 1)
  }

  const monthlyTax = propertyTax / 12
  const monthlyIns = insurance / 12
  const monthly = monthlyMortgage + monthlyTax + monthlyIns

  const schedule: Result["schedule"] = []
  let balance = loan
  for (let yr = 1; yr <= years; yr++) {
    let yearPrincipal = 0
    let yearInterest = 0
    for (let m = 0; m < 12; m++) {
      const interestPayment = balance * monthlyRate
      const principalPayment = monthlyMortgage - interestPayment
      yearInterest += interestPayment
      yearPrincipal += principalPayment
      balance -= principalPayment
    }
    schedule.push({
      year: yr,
      principal: yearPrincipal,
      interest: yearInterest,
      balance: Math.max(0, balance),
    })
  }

  const totalPayment = monthly * n
  const totalInterest = totalPayment - loan - (monthlyTax + monthlyIns) * n

  return { monthly, totalPayment, totalInterest, schedule }
}

export default function MortgageCalculator() {
  const [homePrice, setHomePrice] = useState("300000")
  const [downPayment, setDownPayment] = useState("60000")
  const [rate, setRate] = useState("6.5")
  const [term, setTerm] = useState("30")
  const [tax, setTax] = useState("3600")
  const [insurance, setInsurance] = useState("1200")
  const [result, setResult] = useState<Result | null>(null)
  const [showSchedule, setShowSchedule] = useState(false)
  const [, setHistory] = useLocalStorage<HistoryItem[]>(
    "mortgage-calculator-history",
    []
  )

  function handleCalculate() {
    const r = calculate(
      Number(homePrice),
      Number(rate),
      Number(term),
      Number(downPayment),
      Number(tax),
      Number(insurance)
    )
    setResult(r)
    setShowSchedule(false)

    if (r) {
      const params = new URLSearchParams({
        hp: homePrice,
        dp: downPayment,
        r: rate,
        t: term,
        tx: tax,
        ins: insurance,
      })
      const url = `${window.location.origin}/tools/mortgage-calculator?${params}`
      setHistory((prev) => [
        {
          id: crypto.randomUUID(),
          timestamp: Date.now(),
          inputs: { homePrice, downPayment, rate, term, tax, insurance },
          result: { monthly: r.monthly, totalPayment: r.totalPayment, totalInterest: r.totalInterest },
          shareableUrl: url,
        },
        ...prev.slice(0, 9),
      ])
    }
  }

  function getShareUrl() {
    const params = new URLSearchParams({
      hp: homePrice,
      dp: downPayment,
      r: rate,
      t: term,
      tx: tax,
      ins: insurance,
    })
    return `${typeof window !== "undefined" ? window.location.origin : ""}/tools/mortgage-calculator?${params}`
  }

  const summary = result
    ? `Monthly Payment: ${formatCurrency(result.monthly)}\nTotal Payment: ${formatCurrency(result.totalPayment)}\nTotal Interest: ${formatCurrency(result.totalInterest)}`
    : ""

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-1.5">
          <Label htmlFor="home-price">Home Price ($)</Label>
          <Input
            id="home-price"
            type="number"
            value={homePrice}
            onChange={(e) => setHomePrice(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="down-payment">Down Payment ($)</Label>
          <Input
            id="down-payment"
            type="number"
            value={downPayment}
            onChange={(e) => setDownPayment(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="rate">Interest Rate (%)</Label>
          <Input
            id="rate"
            type="number"
            step="0.1"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="term">Loan Term (years)</Label>
          <Input
            id="term"
            type="number"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="tax">Annual Property Tax ($)</Label>
          <Input
            id="tax"
            type="number"
            value={tax}
            onChange={(e) => setTax(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="insurance">Annual Insurance ($)</Label>
          <Input
            id="insurance"
            type="number"
            value={insurance}
            onChange={(e) => setInsurance(e.target.value)}
          />
        </div>
      </div>

      <Button onClick={handleCalculate}>Calculate</Button>

      {result && (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl bg-primary/10 p-4 text-center">
              <div className="text-sm text-muted-foreground">Monthly Payment</div>
              <div className="text-2xl font-bold text-primary">
                {formatCurrency(result.monthly)}
              </div>
            </div>
            <div className="rounded-xl bg-muted p-4 text-center">
              <div className="text-sm text-muted-foreground">Total Payment</div>
              <div className="text-xl font-semibold">
                {formatCurrency(result.totalPayment)}
              </div>
            </div>
            <div className="rounded-xl bg-muted p-4 text-center">
              <div className="text-sm text-muted-foreground">Total Interest</div>
              <div className="text-xl font-semibold">
                {formatCurrency(result.totalInterest)}
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <CopyButton value={summary} label="Copy Results" />
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSchedule(!showSchedule)}
            >
              {showSchedule ? "Hide" : "Show"} Amortization
            </Button>
          </div>

          <ShareResult
            url={getShareUrl()}
            resultText={`My estimated mortgage payment: ${formatCurrency(result.monthly)}/month on a ${formatCurrency(Number(homePrice))} home.`}
            toolName="Mortgage Calculator"
            hashtags={["MortgageCalculator", "HomeBuying"]}
          />

          {showSchedule && (
            <div className="overflow-x-auto rounded-xl border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="px-4 py-2 text-left">Year</th>
                    <th className="px-4 py-2 text-right">Principal</th>
                    <th className="px-4 py-2 text-right">Interest</th>
                    <th className="px-4 py-2 text-right">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {result.schedule.map((row) => (
                    <tr key={row.year} className="border-b last:border-0">
                      <td className="px-4 py-2">{row.year}</td>
                      <td className="px-4 py-2 text-right">
                        {formatCurrency(row.principal)}
                      </td>
                      <td className="px-4 py-2 text-right">
                        {formatCurrency(row.interest)}
                      </td>
                      <td className="px-4 py-2 text-right">
                        {formatCurrency(row.balance)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      <CalculationHistory
        toolSlug="mortgage-calculator"
        formatResult={(r) => {
          const res = r as { monthly: number }
          return `Monthly: ${formatCurrency(res.monthly)}`
        }}
        formatInputs={(inputs) =>
          `$${Number(inputs.homePrice).toLocaleString()} home, ${inputs.rate}% rate, ${inputs.term}yr`
        }
      />
    </div>
  )
}
