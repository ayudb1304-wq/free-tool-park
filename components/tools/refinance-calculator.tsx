"use client"

import { useState, useMemo, useCallback } from "react"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CopyButton } from "@/components/ui/copy-button"
import { ShareResult } from "@/components/tools/share-result"
import { CalculationHistory } from "@/components/tools/calculation-history"
import type { HistoryItem } from "@/components/tools/calculation-history"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { US_STATES, getStateByAbbr, DEFAULT_STATE } from "@/data/state-property-taxes"
import dynamic from "next/dynamic"

const RefinanceCharts = dynamic(() => import("./refinance-charts"), {
  ssr: false,
  loading: () => (
    <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">
      Loading charts...
    </div>
  ),
})

// --- Formatting helpers ---

function fmt(n: number) {
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
}

function fmtFull(n: number) {
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  })
}

// --- Types ---

interface SavingsPoint {
  month: number
  savings: number
}

type Verdict = "worth-it" | "marginal" | "not-worth"

interface RefinanceResult {
  currentPI: number
  currentTotalInterestRemaining: number
  currentTotalRemainingCost: number
  newLoanAmount: number
  newMonthlyPI: number
  newTotalInterest: number
  newTotalPayment: number
  monthlySavings: number
  breakEvenMonths: number
  rateDrop: number
  totalInterestSaved: number
  lifetimeSavings: number
  savingsCurve: SavingsPoint[]
  verdict: Verdict
  verdictReason: string
}

// --- Calculation helpers ---

function monthlyPayment(principal: number, annualRate: number, months: number) {
  if (principal <= 0 || months <= 0) return 0
  const r = annualRate / 100 / 12
  if (r === 0) return principal / months
  return (
    (principal * (r * Math.pow(1 + r, months))) /
    (Math.pow(1 + r, months) - 1)
  )
}

// Rough state-based closing cost percentage defaults (% of loan amount).
// Based on published closing-cost studies (ClosingCorp/CoreLogic 2024).
// Higher-cost states (NY, CA, DC metro) tend to land near 3%, lower-cost states near 1.5-2%.
const STATE_CLOSING_COST_RATE: Record<string, number> = {
  NY: 3.1,
  DC: 3.0,
  DE: 2.7,
  WA: 2.5,
  MD: 2.5,
  FL: 2.3,
  PA: 2.2,
  IL: 2.2,
  CA: 2.1,
  NJ: 2.1,
  MA: 2.0,
  TX: 2.0,
  CT: 2.0,
  VA: 1.9,
  AZ: 1.8,
  GA: 1.8,
  CO: 1.8,
  NC: 1.8,
  OH: 1.7,
  NV: 1.7,
  MI: 1.7,
  OR: 1.7,
  SC: 1.7,
  TN: 1.6,
  MN: 1.6,
  AL: 1.6,
  IN: 1.6,
  MO: 1.5,
  WI: 1.5,
  KY: 1.5,
  OK: 1.5,
  AR: 1.5,
  LA: 1.5,
  KS: 1.4,
  NM: 1.4,
  IA: 1.4,
  UT: 1.4,
  AK: 1.4,
  NE: 1.4,
  ID: 1.3,
  ME: 1.3,
  MS: 1.3,
  MT: 1.3,
  NH: 1.3,
  RI: 2.0,
  SD: 1.2,
  ND: 1.2,
  WV: 1.2,
  VT: 1.4,
  HI: 1.5,
  WY: 1.3,
}

function estimateClosingCosts(loanAmount: number, stateAbbr: string): number {
  const rate = STATE_CLOSING_COST_RATE[stateAbbr] ?? 2.0
  return Math.round((loanAmount * rate) / 100)
}

function calculateRefinance(
  currentBalance: number,
  currentRate: number,
  yearsRemaining: number,
  newRate: number,
  newTermYears: number,
  closingCosts: number,
  cashOut: number,
  rollCostsInto: boolean
): RefinanceResult | null {
  if (
    currentBalance <= 0 ||
    yearsRemaining <= 0 ||
    newTermYears <= 0 ||
    currentRate < 0 ||
    newRate < 0
  ) {
    return null
  }

  const remainingMonths = Math.round(yearsRemaining * 12)

  // Current loan — compute what remains to be paid.
  const currentPI = monthlyPayment(currentBalance, currentRate, remainingMonths)
  const currentTotalRemainingCost = currentPI * remainingMonths
  const currentTotalInterestRemaining = currentTotalRemainingCost - currentBalance

  // New loan principal: always adds cash-out; closing costs may or may not be rolled in.
  const upfrontClosingCosts = rollCostsInto ? 0 : closingCosts
  const financedClosingCosts = rollCostsInto ? closingCosts : 0
  const newLoanAmount = currentBalance + cashOut + financedClosingCosts

  const newMonths = newTermYears * 12
  const newMonthlyPI = monthlyPayment(newLoanAmount, newRate, newMonths)
  const newTotalPayment = newMonthlyPI * newMonths
  const newTotalInterest = newTotalPayment - newLoanAmount

  const monthlySavings = currentPI - newMonthlyPI
  const breakEvenMonths =
    monthlySavings > 0 ? upfrontClosingCosts / monthlySavings : Infinity

  // Lifetime savings = what you'd pay on the current loan minus the true
  // cost of the new path. The "cost of the new path" is the total payments
  // on the new loan plus upfront closing costs, minus any cash you received
  // back via cash-out refinance (since that's money in your pocket).
  const lifetimeSavings =
    currentTotalRemainingCost - (newTotalPayment + upfrontClosingCosts - cashOut)

  const totalInterestSaved = currentTotalInterestRemaining - newTotalInterest

  const rateDrop = currentRate - newRate

  // Build savings curve — cumulative net savings (monthly savings * months - upfront closing costs).
  const curveEnd = Math.min(newMonths, remainingMonths)
  const savingsCurve: SavingsPoint[] = []
  const step = Math.max(1, Math.round(curveEnd / 60))
  for (let m = 0; m <= curveEnd; m += step) {
    savingsCurve.push({
      month: m,
      savings: Math.round(m * monthlySavings - upfrontClosingCosts),
    })
  }
  if (savingsCurve[savingsCurve.length - 1]?.month !== curveEnd) {
    savingsCurve.push({
      month: curveEnd,
      savings: Math.round(curveEnd * monthlySavings - upfrontClosingCosts),
    })
  }

  // Verdict
  let verdict: Verdict
  let verdictReason: string
  if (monthlySavings <= 0) {
    verdict = "not-worth"
    verdictReason =
      "Your new monthly payment would be higher than your current payment."
  } else if (breakEvenMonths <= 36 && lifetimeSavings > 5000) {
    verdict = "worth-it"
    verdictReason = `You break even in ${Math.round(breakEvenMonths)} months and save ${fmt(lifetimeSavings)} over the life of the loan.`
  } else if (breakEvenMonths <= 72 && lifetimeSavings > 0) {
    verdict = "marginal"
    verdictReason = `Refinancing pays off after ${Math.round(breakEvenMonths)} months. Worth it only if you plan to stay in the home longer.`
  } else {
    verdict = "not-worth"
    verdictReason =
      lifetimeSavings <= 0
        ? "Closing costs wipe out your interest savings."
        : `Break-even is ${Math.round(breakEvenMonths)} months — too long to recoup the closing costs.`
  }

  return {
    currentPI,
    currentTotalInterestRemaining,
    currentTotalRemainingCost,
    newLoanAmount,
    newMonthlyPI,
    newTotalInterest,
    newTotalPayment,
    monthlySavings,
    breakEvenMonths,
    rateDrop,
    totalInterestSaved,
    lifetimeSavings,
    savingsCurve,
    verdict,
    verdictReason,
  }
}

// --- Component ---

const NEW_TERMS = ["10", "15", "20", "25", "30"]

export default function RefinanceCalculator() {
  // Inputs
  const [currentBalance, setCurrentBalance] = useState("300000")
  const [currentRate, setCurrentRate] = useState("7.5")
  const [yearsRemaining, setYearsRemaining] = useState("25")
  const [newRate, setNewRate] = useState("6.0")
  const [newTerm, setNewTerm] = useState("30")
  const [state, setState] = useState(DEFAULT_STATE)
  const [closingCosts, setClosingCosts] = useState(() =>
    estimateClosingCosts(300000, DEFAULT_STATE).toString()
  )
  const [closingCostsEdited, setClosingCostsEdited] = useState(false)
  const [cashOut, setCashOut] = useState("0")
  const [rollCostsInto, setRollCostsInto] = useState(false)

  const [, setHistory] = useLocalStorage<HistoryItem[]>(
    "refinance-calculator-history",
    []
  )

  // Auto-update closing cost estimate when balance or state changes, unless user edited.
  const handleStateChange = useCallback(
    (abbr: string) => {
      setState(abbr)
      if (!closingCostsEdited) {
        const est = estimateClosingCosts(Number(currentBalance) || 0, abbr)
        setClosingCosts(est.toString())
      }
    },
    [closingCostsEdited, currentBalance]
  )

  const handleBalanceChange = useCallback(
    (value: string) => {
      setCurrentBalance(value)
      if (!closingCostsEdited) {
        const est = estimateClosingCosts(Number(value) || 0, state)
        setClosingCosts(est.toString())
      }
    },
    [closingCostsEdited, state]
  )

  const handleClosingCostsChange = useCallback((value: string) => {
    setClosingCosts(value)
    setClosingCostsEdited(true)
  }, [])

  const resetClosingCosts = useCallback(() => {
    setClosingCostsEdited(false)
    const est = estimateClosingCosts(Number(currentBalance) || 0, state)
    setClosingCosts(est.toString())
  }, [currentBalance, state])

  // Calculate
  const result = useMemo(
    () =>
      calculateRefinance(
        Number(currentBalance) || 0,
        Number(currentRate) || 0,
        Number(yearsRemaining) || 0,
        Number(newRate) || 0,
        Number(newTerm) || 0,
        Number(closingCosts) || 0,
        Number(cashOut) || 0,
        rollCostsInto
      ),
    [
      currentBalance,
      currentRate,
      yearsRemaining,
      newRate,
      newTerm,
      closingCosts,
      cashOut,
      rollCostsInto,
    ]
  )

  const saveToHistory = useCallback(() => {
    if (!result) return
    const params = new URLSearchParams({
      cb: currentBalance,
      cr: currentRate,
      yr: yearsRemaining,
      nr: newRate,
      nt: newTerm,
      s: state,
      cc: closingCosts,
      co: cashOut,
      ri: rollCostsInto ? "1" : "0",
    })
    const url = `${window.location.origin}/tools/refinance-calculator?${params}`
    setHistory((prev) => [
      {
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        inputs: { currentBalance, currentRate, newRate, newTerm, state },
        result: {
          monthlySavings: result.monthlySavings,
          breakEvenMonths: result.breakEvenMonths,
          lifetimeSavings: result.lifetimeSavings,
          verdict: result.verdict,
        },
        shareableUrl: url,
      },
      ...prev.slice(0, 9),
    ])
  }, [
    result,
    currentBalance,
    currentRate,
    yearsRemaining,
    newRate,
    newTerm,
    state,
    closingCosts,
    cashOut,
    rollCostsInto,
    setHistory,
  ])

  function getShareUrl() {
    const params = new URLSearchParams({
      cb: currentBalance,
      cr: currentRate,
      yr: yearsRemaining,
      nr: newRate,
      nt: newTerm,
      s: state,
      cc: closingCosts,
      co: cashOut,
      ri: rollCostsInto ? "1" : "0",
    })
    return `${typeof window !== "undefined" ? window.location.origin : ""}/tools/refinance-calculator?${params}`
  }

  const summary = result
    ? `Current Payment: ${fmtFull(result.currentPI)}\nNew Payment: ${fmtFull(result.newMonthlyPI)}\nMonthly Savings: ${fmtFull(result.monthlySavings)}\nBreak-even: ${Number.isFinite(result.breakEvenMonths) ? `${Math.round(result.breakEvenMonths)} months` : "Never"}\nLifetime Savings: ${fmtFull(result.lifetimeSavings)}\nVerdict: ${verdictLabel(result.verdict)}`
    : ""

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <div className="space-y-4">
        <div className="rounded-xl border bg-muted/30 p-4">
          <h3 className="mb-3 text-sm font-semibold text-muted-foreground">
            Your Current Mortgage
          </h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-1.5">
              <Label htmlFor="current-balance">Current Loan Balance ($)</Label>
              <Input
                id="current-balance"
                type="number"
                min="0"
                step="1000"
                value={currentBalance}
                onChange={(e) => handleBalanceChange(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="current-rate">Current Interest Rate (%)</Label>
              <Input
                id="current-rate"
                type="number"
                min="0"
                step="0.125"
                value={currentRate}
                onChange={(e) => setCurrentRate(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="years-remaining">Years Remaining</Label>
              <Input
                id="years-remaining"
                type="number"
                min="1"
                max="50"
                step="1"
                value={yearsRemaining}
                onChange={(e) => setYearsRemaining(e.target.value)}
              />
            </div>
          </div>
          {result && (
            <p className="mt-3 text-xs text-muted-foreground">
              Estimated current monthly P&amp;I:{" "}
              <strong className="text-foreground">
                {fmtFull(result.currentPI)}
              </strong>
            </p>
          )}
        </div>

        <div className="rounded-xl border bg-primary/5 p-4">
          <h3 className="mb-3 text-sm font-semibold text-primary">
            New Loan Terms
          </h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-1.5">
              <Label htmlFor="new-rate">New Interest Rate (%)</Label>
              <Input
                id="new-rate"
                type="number"
                min="0"
                step="0.125"
                value={newRate}
                onChange={(e) => setNewRate(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>New Loan Term</Label>
              <Select value={newTerm} onValueChange={setNewTerm}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {NEW_TERMS.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t} years
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>State</Label>
              <Select value={state} onValueChange={handleStateChange}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {US_STATES.map((s) => (
                    <SelectItem key={s.abbr} value={s.abbr}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="closing-costs">Closing Costs ($)</Label>
                {closingCostsEdited && (
                  <button
                    type="button"
                    onClick={resetClosingCosts}
                    className="text-xs font-medium text-primary hover:underline"
                  >
                    Use {getStateByAbbr(state)?.name ?? "state"} avg
                  </button>
                )}
              </div>
              <Input
                id="closing-costs"
                type="number"
                min="0"
                step="100"
                value={closingCosts}
                onChange={(e) => handleClosingCostsChange(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                {closingCostsEdited
                  ? "Custom value"
                  : `${STATE_CLOSING_COST_RATE[state] ?? 2.0}% of loan (${getStateByAbbr(state)?.name ?? "state"} average)`}
              </p>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cash-out">Cash-Out Amount ($)</Label>
              <Input
                id="cash-out"
                type="number"
                min="0"
                step="1000"
                value={cashOut}
                onChange={(e) => setCashOut(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Optional — for cash-out refinance
              </p>
            </div>
            <div className="flex items-end pb-1">
              <label className="flex cursor-pointer items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={rollCostsInto}
                  onChange={(e) => setRollCostsInto(e.target.checked)}
                  className="rounded"
                />
                Roll closing costs into loan
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap items-center gap-3">
        <Button onClick={saveToHistory}>Save to History</Button>
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-6">
          {/* Verdict Badge */}
          <VerdictBadge
            verdict={result.verdict}
            reason={result.verdictReason}
          />

          {/* Key Metrics */}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl bg-primary/10 p-4 text-center">
              <div className="text-xs font-medium text-muted-foreground">
                Monthly Savings
              </div>
              <div
                className={`mt-1 text-2xl font-bold ${result.monthlySavings > 0 ? "text-primary" : "text-red-500"}`}
              >
                {result.monthlySavings > 0 ? "" : "-"}
                {fmt(Math.abs(result.monthlySavings))}
              </div>
            </div>
            <div className="rounded-xl bg-muted p-4 text-center">
              <div className="text-xs font-medium text-muted-foreground">
                Break-Even Point
              </div>
              <div className="mt-1 text-xl font-semibold">
                {Number.isFinite(result.breakEvenMonths)
                  ? `${Math.round(result.breakEvenMonths)} mo`
                  : "Never"}
              </div>
              {Number.isFinite(result.breakEvenMonths) && (
                <div className="text-xs text-muted-foreground">
                  {(result.breakEvenMonths / 12).toFixed(1)} years
                </div>
              )}
            </div>
            <div className="rounded-xl bg-muted p-4 text-center">
              <div className="text-xs font-medium text-muted-foreground">
                Lifetime Savings
              </div>
              <div
                className={`mt-1 text-xl font-semibold ${result.lifetimeSavings >= 0 ? "text-green-600 dark:text-green-400" : "text-red-500"}`}
              >
                {fmt(result.lifetimeSavings)}
              </div>
            </div>
            <div className="rounded-xl bg-muted p-4 text-center">
              <div className="text-xs font-medium text-muted-foreground">
                Rate Drop
              </div>
              <div
                className={`mt-1 text-xl font-semibold ${result.rateDrop > 0 ? "text-green-600 dark:text-green-400" : result.rateDrop < 0 ? "text-red-500" : ""}`}
              >
                {result.rateDrop > 0 ? "-" : result.rateDrop < 0 ? "+" : ""}
                {Math.abs(result.rateDrop).toFixed(2)}%
              </div>
            </div>
          </div>

          {/* Side-by-side Comparison */}
          <div className="rounded-xl border">
            <div className="border-b p-4">
              <h3 className="font-semibold">Side-by-Side Comparison</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/40">
                    <th className="px-4 py-2 text-left font-medium text-muted-foreground">
                      Metric
                    </th>
                    <th className="px-4 py-2 text-right font-medium text-muted-foreground">
                      Current Loan
                    </th>
                    <th className="px-4 py-2 text-right font-medium text-muted-foreground">
                      New Loan
                    </th>
                    <th className="px-4 py-2 text-right font-medium text-muted-foreground">
                      Difference
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <ComparisonRow
                    label="Interest Rate"
                    current={`${Number(currentRate).toFixed(3)}%`}
                    next={`${Number(newRate).toFixed(3)}%`}
                    diff={`${result.rateDrop >= 0 ? "-" : "+"}${Math.abs(result.rateDrop).toFixed(2)}%`}
                    diffGood={result.rateDrop > 0}
                  />
                  <ComparisonRow
                    label="Monthly P&I"
                    current={fmtFull(result.currentPI)}
                    next={fmtFull(result.newMonthlyPI)}
                    diff={`${result.monthlySavings >= 0 ? "-" : "+"}${fmt(Math.abs(result.monthlySavings))}`}
                    diffGood={result.monthlySavings > 0}
                  />
                  <ComparisonRow
                    label="Loan Term"
                    current={`${yearsRemaining} yrs left`}
                    next={`${newTerm} yrs`}
                    diff={`${Number(newTerm) - Number(yearsRemaining) > 0 ? "+" : ""}${Number(newTerm) - Number(yearsRemaining)} yrs`}
                    diffGood={null}
                  />
                  <ComparisonRow
                    label="Loan Balance"
                    current={fmt(Number(currentBalance) || 0)}
                    next={fmt(result.newLoanAmount)}
                    diff={`${result.newLoanAmount - Number(currentBalance) >= 0 ? "+" : "-"}${fmt(Math.abs(result.newLoanAmount - Number(currentBalance)))}`}
                    diffGood={result.newLoanAmount <= Number(currentBalance)}
                  />
                  <ComparisonRow
                    label="Total Interest"
                    current={fmt(result.currentTotalInterestRemaining)}
                    next={fmt(result.newTotalInterest)}
                    diff={`${result.totalInterestSaved >= 0 ? "-" : "+"}${fmt(Math.abs(result.totalInterestSaved))}`}
                    diffGood={result.totalInterestSaved > 0}
                  />
                  <ComparisonRow
                    label="Total Cost"
                    current={fmt(result.currentTotalRemainingCost)}
                    next={fmt(
                      result.newTotalPayment +
                        (rollCostsInto ? 0 : Number(closingCosts) || 0)
                    )}
                    diff={`${result.lifetimeSavings >= 0 ? "-" : "+"}${fmt(Math.abs(result.lifetimeSavings))}`}
                    diffGood={result.lifetimeSavings > 0}
                  />
                </tbody>
              </table>
            </div>
          </div>

          {/* Smart Insights */}
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
            <h3 className="mb-3 font-semibold text-primary">Smart Insights</h3>
            <ul className="space-y-2 text-sm">
              {result.monthlySavings > 0 &&
                Number.isFinite(result.breakEvenMonths) && (
                  <li>
                    You break even after{" "}
                    <strong>
                      {Math.round(result.breakEvenMonths)} months
                    </strong>{" "}
                    ({(result.breakEvenMonths / 12).toFixed(1)} years). If you
                    plan to stay in the home longer than that, refinancing pays
                    off.
                  </li>
                )}
              {result.monthlySavings <= 0 && (
                <li>
                  Your new monthly payment is{" "}
                  <strong>{fmt(Math.abs(result.monthlySavings))}</strong> higher
                  than your current payment. Refinancing would cost you money
                  monthly.
                </li>
              )}
              <li>
                Your rate drop is{" "}
                <strong>{result.rateDrop.toFixed(2)}%</strong>.{" "}
                {result.rateDrop >= 0.75
                  ? "The conventional rule of thumb says refinancing is worth it above 0.75% — you're in the clear."
                  : result.rateDrop > 0
                    ? "Most lenders suggest at least a 0.75% rate drop to justify refinancing costs."
                    : "Your new rate is higher than your current rate — only consider this for cash-out purposes."}
              </li>
              {Number(cashOut) > 0 && (
                <li>
                  Cash-out of <strong>{fmt(Number(cashOut))}</strong> adds
                  interest to your loan. Make sure the cash-out funds a
                  higher-return purpose than your rate.
                </li>
              )}
              {Number(newTerm) > Number(yearsRemaining) && (
                <li>
                  You&apos;re extending your loan term by{" "}
                  <strong>
                    {Number(newTerm) - Number(yearsRemaining)} years
                  </strong>
                  . This lowers your monthly payment but you&apos;ll pay for
                  longer.
                </li>
              )}
              {rollCostsInto && (
                <li>
                  Closing costs rolled into the loan means no cash out of
                  pocket, but you&apos;ll pay interest on those costs over the
                  life of the loan.
                </li>
              )}
              <li>
                Total interest saved over the life of the loan:{" "}
                <strong
                  className={
                    result.totalInterestSaved >= 0
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-500"
                  }
                >
                  {fmt(result.totalInterestSaved)}
                </strong>
                .
              </li>
            </ul>
          </div>

          {/* Charts */}
          <Tabs defaultValue="savings">
            <TabsList>
              <TabsTrigger value="savings">Savings Curve</TabsTrigger>
              <TabsTrigger value="comparison">Interest Comparison</TabsTrigger>
            </TabsList>
            <TabsContent value="savings" className="pt-4">
              <p className="mb-3 text-sm text-muted-foreground">
                Your cumulative net savings over time. The line starts negative
                (closing costs) and crosses zero at the break-even point.
              </p>
              <RefinanceCharts
                type="savings-curve"
                data={result.savingsCurve}
                breakEvenMonths={result.breakEvenMonths}
              />
            </TabsContent>
            <TabsContent value="comparison" className="pt-4">
              <p className="mb-3 text-sm text-muted-foreground">
                Lifetime interest on each loan, plus closing costs.
              </p>
              <RefinanceCharts
                type="comparison"
                currentTotalInterest={result.currentTotalInterestRemaining}
                newTotalInterest={result.newTotalInterest}
                closingCosts={Number(closingCosts) || 0}
              />
            </TabsContent>
          </Tabs>

          {/* Action row */}
          <div className="flex flex-wrap gap-2">
            <CopyButton value={summary} label="Copy Results" />
          </div>

          <ShareResult
            url={getShareUrl()}
            resultText={`I could save ${fmtFull(result.monthlySavings)}/month by refinancing (break-even in ${Math.round(result.breakEvenMonths)} months).`}
            toolName="Refinance Calculator"
            hashtags={["RefinanceCalculator", "Mortgage"]}
          />
        </div>
      )}

      <CalculationHistory
        toolSlug="refinance-calculator"
        formatResult={(r) => {
          const res = r as {
            monthlySavings: number
            breakEvenMonths: number
          }
          return `Save ${fmtFull(res.monthlySavings)}/mo · Break-even ${
            Number.isFinite(res.breakEvenMonths)
              ? `${Math.round(res.breakEvenMonths)}mo`
              : "never"
          }`
        }}
        formatInputs={(inputs) =>
          `${fmt(Number(inputs.currentBalance))} @ ${inputs.currentRate}% → ${inputs.newRate}% / ${inputs.newTerm}yr`
        }
      />
    </div>
  )
}

// --- Helper components ---

function verdictLabel(v: Verdict) {
  if (v === "worth-it") return "Worth It"
  if (v === "marginal") return "Marginal"
  return "Not Worth It"
}

function VerdictBadge({
  verdict,
  reason,
}: {
  verdict: Verdict
  reason: string
}) {
  const config = {
    "worth-it": {
      bg: "bg-green-50 dark:bg-green-950/20",
      border: "border-green-500/30",
      title: "text-green-700 dark:text-green-400",
      icon: "✅",
      label: "Worth It",
    },
    marginal: {
      bg: "bg-yellow-50 dark:bg-yellow-950/20",
      border: "border-yellow-500/30",
      title: "text-yellow-700 dark:text-yellow-500",
      icon: "⚠️",
      label: "Marginal",
    },
    "not-worth": {
      bg: "bg-red-50 dark:bg-red-950/20",
      border: "border-red-500/30",
      title: "text-red-700 dark:text-red-400",
      icon: "❌",
      label: "Not Worth It",
    },
  }[verdict]

  return (
    <div className={`rounded-xl border ${config.border} ${config.bg} p-5`}>
      <div className="flex items-start gap-3">
        <div className="text-3xl" aria-hidden>
          {config.icon}
        </div>
        <div className="flex-1">
          <div className={`text-sm font-medium ${config.title}`}>
            Refinance Verdict
          </div>
          <div className={`text-2xl font-bold ${config.title}`}>
            {config.label}
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{reason}</p>
        </div>
      </div>
    </div>
  )
}

function ComparisonRow({
  label,
  current,
  next,
  diff,
  diffGood,
}: {
  label: string
  current: string
  next: string
  diff: string
  diffGood: boolean | null
}) {
  const diffClass =
    diffGood === null
      ? "text-muted-foreground"
      : diffGood
        ? "text-green-600 dark:text-green-400"
        : "text-red-500"
  return (
    <tr className="border-b last:border-0">
      <td className="px-4 py-2 font-medium">{label}</td>
      <td className="px-4 py-2 text-right">{current}</td>
      <td className="px-4 py-2 text-right">{next}</td>
      <td className={`px-4 py-2 text-right font-medium ${diffClass}`}>
        {diff}
      </td>
    </tr>
  )
}
