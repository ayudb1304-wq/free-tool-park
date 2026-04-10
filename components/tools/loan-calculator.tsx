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
import dynamic from "next/dynamic"

const LoanCalculatorCharts = dynamic(() => import("./loan-calculator-charts"), {
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

// --- Loan Type Catalog (USP #1) ---

interface LoanTypeInfo {
  id: string
  label: string
  defaultRate: number
  rateRange: [number, number]
  defaultTermMonths: number
  defaultAmount: number
  prepaymentPenaltyRisk: "low" | "medium" | "high"
  description: string
}

const LOAN_TYPES: LoanTypeInfo[] = [
  {
    id: "personal",
    label: "Personal Loan",
    defaultRate: 11.5,
    rateRange: [7, 20],
    defaultTermMonths: 60,
    defaultAmount: 15000,
    prepaymentPenaltyRisk: "low",
    description:
      "Unsecured loan typically used for debt consolidation, home repairs, or major purchases.",
  },
  {
    id: "student",
    label: "Student Loan",
    defaultRate: 6.5,
    rateRange: [4.5, 14],
    defaultTermMonths: 120,
    defaultAmount: 30000,
    prepaymentPenaltyRisk: "low",
    description:
      "Federal and private student loans for college tuition and living expenses.",
  },
  {
    id: "auto",
    label: "Auto Loan",
    defaultRate: 7.5,
    rateRange: [4, 14],
    defaultTermMonths: 60,
    defaultAmount: 30000,
    prepaymentPenaltyRisk: "medium",
    description:
      "Vehicle loan from a bank, credit union, or dealer financing.",
  },
  {
    id: "business",
    label: "Business Loan",
    defaultRate: 9.0,
    rateRange: [6, 30],
    defaultTermMonths: 84,
    defaultAmount: 100000,
    prepaymentPenaltyRisk: "high",
    description:
      "SBA, term loans, or lines of credit for small business needs.",
  },
  {
    id: "medical",
    label: "Medical Loan",
    defaultRate: 12.5,
    rateRange: [7, 36],
    defaultTermMonths: 60,
    defaultAmount: 10000,
    prepaymentPenaltyRisk: "low",
    description:
      "Loans for elective procedures, dental work, or medical bills.",
  },
  {
    id: "heloc",
    label: "Home Equity Loan / HELOC",
    defaultRate: 8.5,
    rateRange: [6, 11],
    defaultTermMonths: 180,
    defaultAmount: 50000,
    prepaymentPenaltyRisk: "medium",
    description:
      "Borrow against your home equity. HELOCs often have variable rates.",
  },
  {
    id: "rv",
    label: "RV Loan",
    defaultRate: 8.5,
    rateRange: [6, 13],
    defaultTermMonths: 180,
    defaultAmount: 60000,
    prepaymentPenaltyRisk: "medium",
    description:
      "Long-term loan for recreational vehicles, motorhomes, and travel trailers.",
  },
  {
    id: "boat",
    label: "Boat Loan",
    defaultRate: 9.0,
    rateRange: [6, 14],
    defaultTermMonths: 180,
    defaultAmount: 40000,
    prepaymentPenaltyRisk: "medium",
    description:
      "Marine financing for boats, jet skis, and personal watercraft.",
  },
  {
    id: "consolidation",
    label: "Debt Consolidation",
    defaultRate: 11.0,
    rateRange: [7, 22],
    defaultTermMonths: 48,
    defaultAmount: 20000,
    prepaymentPenaltyRisk: "low",
    description:
      "Combine multiple high-interest debts into a single fixed-rate loan.",
  },
  {
    id: "custom",
    label: "Other / Custom",
    defaultRate: 8.0,
    rateRange: [3, 30],
    defaultTermMonths: 60,
    defaultAmount: 25000,
    prepaymentPenaltyRisk: "low",
    description: "Generic loan calculator for any installment loan.",
  },
]

const LOAN_TYPE_BY_ID = Object.fromEntries(
  LOAN_TYPES.map((t) => [t.id, t])
)

// --- Types ---

interface MonthRow {
  month: number
  payment: number
  principal: number
  interest: number
  balance: number
}

interface YearRow {
  year: number
  principal: number
  interest: number
  balance: number
}

interface BalancePoint {
  year: number
  balance: number
  withExtra: number | null
}

interface LoanResult {
  monthlyPayment: number
  totalInterest: number
  totalPaid: number
  payoffMonths: number
  payoffDate: Date
  monthSchedule: MonthRow[]
  yearSchedule: YearRow[]
  // Extra payment scenario
  extraMonthlyPayment: number
  extraPayoffMonths: number
  extraTotalInterest: number
  monthsSavedByExtra: number
  interestSavedByExtra: number
  // Biweekly scenario
  biweeklyPayoffMonths: number
  biweeklyTotalInterest: number
  monthsSavedByBiweekly: number
  interestSavedByBiweekly: number
  balanceCurve: BalancePoint[]
}

// --- Calculation engine ---

function monthlyPaymentFor(
  principal: number,
  annualRate: number,
  months: number
): number {
  if (principal <= 0 || months <= 0) return 0
  const r = annualRate / 100 / 12
  if (r === 0) return principal / months
  return (
    (principal * (r * Math.pow(1 + r, months))) /
    (Math.pow(1 + r, months) - 1)
  )
}

function amortize(
  principal: number,
  annualRate: number,
  basePayment: number,
  extraPayment: number,
  maxMonths: number
): { months: MonthRow[]; totalInterest: number; payoffMonths: number } {
  const r = annualRate / 100 / 12
  const months: MonthRow[] = []
  let balance = principal
  let totalInterest = 0
  for (let m = 1; m <= maxMonths * 4; m++) {
    if (balance <= 0.005) break
    const interestPayment = balance * r
    let principalPayment = basePayment - interestPayment + extraPayment
    if (principalPayment <= 0) break // payment can't cover interest
    if (principalPayment > balance) principalPayment = balance
    balance -= principalPayment
    totalInterest += interestPayment
    months.push({
      month: m,
      payment: basePayment + extraPayment,
      principal: principalPayment,
      interest: interestPayment,
      balance: Math.max(0, balance),
    })
    if (balance <= 0.005) break
  }
  return { months, totalInterest, payoffMonths: months.length }
}

function calculateLoan(
  principal: number,
  annualRate: number,
  termMonths: number,
  extraPayment: number
): LoanResult | null {
  if (principal <= 0 || termMonths <= 0) return null
  const pmt = monthlyPaymentFor(principal, annualRate, termMonths)
  if (!Number.isFinite(pmt) || pmt <= 0) return null

  // Standard schedule
  const standard = amortize(principal, annualRate, pmt, 0, termMonths)
  const yearSchedule: YearRow[] = []
  const years = Math.ceil(standard.months.length / 12)
  for (let y = 0; y < years; y++) {
    const yearMonths = standard.months.slice(y * 12, (y + 1) * 12)
    if (yearMonths.length === 0) break
    yearSchedule.push({
      year: y + 1,
      principal: yearMonths.reduce((s, m) => s + m.principal, 0),
      interest: yearMonths.reduce((s, m) => s + m.interest, 0),
      balance: yearMonths[yearMonths.length - 1].balance,
    })
  }

  // Extra payment scenario
  const extra = extraPayment > 0
    ? amortize(principal, annualRate, pmt, extraPayment, termMonths)
    : null
  const extraPayoffMonths = extra ? extra.payoffMonths : standard.months.length
  const extraTotalInterest = extra ? extra.totalInterest : standard.totalInterest

  // Biweekly: pay half the monthly amount every 2 weeks = 26 half-payments per
  // year = 13 monthly equivalents. Easiest model: add (1/12) of monthly payment
  // as extra each month.
  const biweeklyExtra = pmt / 12
  const biweekly = amortize(principal, annualRate, pmt, biweeklyExtra, termMonths)

  // Balance curve (for chart)
  const balanceCurve: BalancePoint[] = []
  balanceCurve.push({ year: 0, balance: principal, withExtra: principal })
  for (let y = 1; y <= years; y++) {
    const idx = y * 12 - 1
    const stdBal =
      idx < standard.months.length
        ? standard.months[idx].balance
        : 0
    let extraBal: number | null = null
    if (extra) {
      extraBal = idx < extra.months.length ? extra.months[idx].balance : 0
    }
    balanceCurve.push({ year: y, balance: stdBal, withExtra: extraBal })
  }

  // Payoff date — start from current month
  const now = new Date()
  const payoffDate = new Date(
    now.getFullYear(),
    now.getMonth() + standard.months.length,
    1
  )

  return {
    monthlyPayment: pmt,
    totalInterest: standard.totalInterest,
    totalPaid: pmt * standard.months.length,
    payoffMonths: standard.months.length,
    payoffDate,
    monthSchedule: standard.months,
    yearSchedule,
    extraMonthlyPayment: extraPayment,
    extraPayoffMonths,
    extraTotalInterest,
    monthsSavedByExtra: standard.months.length - extraPayoffMonths,
    interestSavedByExtra: standard.totalInterest - extraTotalInterest,
    biweeklyPayoffMonths: biweekly.payoffMonths,
    biweeklyTotalInterest: biweekly.totalInterest,
    monthsSavedByBiweekly: standard.months.length - biweekly.payoffMonths,
    interestSavedByBiweekly: standard.totalInterest - biweekly.totalInterest,
    balanceCurve,
  }
}

// --- Comparison feature (USP #2) ---

interface SavedLoan {
  id: string
  label: string
  loanType: string
  amount: number
  rate: number
  termMonths: number
  monthlyPayment: number
  totalInterest: number
  totalPaid: number
}

type TermUnit = "years" | "months"

// --- Component ---

export default function LoanCalculator() {
  const [loanType, setLoanType] = useState<string>("personal")
  const [amount, setAmount] = useState<string>("15000")
  const [rate, setRate] = useState<string>("11.5")
  const [termValue, setTermValue] = useState<string>("5")
  const [termUnit, setTermUnit] = useState<TermUnit>("years")
  const [extraPayment, setExtraPayment] = useState<string>("0")
  const [showSchedule, setShowSchedule] = useState(false)
  const [showApr, setShowApr] = useState(false)

  const [comparisons, setComparisons] = useLocalStorage<SavedLoan[]>(
    "loan-calculator-comparisons",
    []
  )
  const [, setHistory] = useLocalStorage<HistoryItem[]>(
    "loan-calculator-history",
    []
  )

  // When loan type changes, swap defaults to that type's preset.
  const handleLoanTypeChange = useCallback((id: string) => {
    setLoanType(id)
    const info = LOAN_TYPE_BY_ID[id]
    if (!info) return
    setAmount(info.defaultAmount.toString())
    setRate(info.defaultRate.toString())
    setTermUnit("months")
    setTermValue(info.defaultTermMonths.toString())
  }, [])

  const termMonths = useMemo(() => {
    const v = Number(termValue) || 0
    return termUnit === "years" ? v * 12 : v
  }, [termValue, termUnit])

  const result = useMemo(
    () =>
      calculateLoan(
        Number(amount) || 0,
        Number(rate) || 0,
        termMonths,
        Number(extraPayment) || 0
      ),
    [amount, rate, termMonths, extraPayment]
  )

  const currentLoanType = LOAN_TYPE_BY_ID[loanType]

  function getShareUrl() {
    const params = new URLSearchParams({
      lt: loanType,
      a: amount,
      r: rate,
      tv: termValue,
      tu: termUnit,
      ep: extraPayment,
    })
    return `${typeof window !== "undefined" ? window.location.origin : ""}/tools/loan-calculator?${params}`
  }

  const saveToHistory = useCallback(() => {
    if (!result) return
    const params = new URLSearchParams({
      lt: loanType,
      a: amount,
      r: rate,
      tv: termValue,
      tu: termUnit,
      ep: extraPayment,
    })
    const url = `${window.location.origin}/tools/loan-calculator?${params}`
    setHistory((prev) => [
      {
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        inputs: { loanType, amount, rate, termValue, termUnit },
        result: {
          monthlyPayment: result.monthlyPayment,
          totalInterest: result.totalInterest,
          totalPaid: result.totalPaid,
        },
        shareableUrl: url,
      },
      ...prev.slice(0, 9),
    ])
  }, [
    result,
    loanType,
    amount,
    rate,
    termValue,
    termUnit,
    extraPayment,
    setHistory,
  ])

  const addToComparison = useCallback(() => {
    if (!result) return
    const info = LOAN_TYPE_BY_ID[loanType]
    setComparisons((prev) => {
      if (prev.length >= 4) return prev
      const next: SavedLoan = {
        id: crypto.randomUUID(),
        label: `${info?.label ?? "Loan"} #${prev.length + 1}`,
        loanType,
        amount: Number(amount) || 0,
        rate: Number(rate) || 0,
        termMonths,
        monthlyPayment: result.monthlyPayment,
        totalInterest: result.totalInterest,
        totalPaid: result.totalPaid,
      }
      return [...prev, next]
    })
  }, [result, loanType, amount, rate, termMonths, setComparisons])

  const removeComparison = useCallback(
    (id: string) => {
      setComparisons((prev) => prev.filter((c) => c.id !== id))
    },
    [setComparisons]
  )

  const clearComparisons = useCallback(() => {
    setComparisons([])
  }, [setComparisons])

  const summary = result
    ? `Monthly Payment: ${fmtFull(result.monthlyPayment)}\nTotal Interest: ${fmtFull(result.totalInterest)}\nTotal Paid: ${fmtFull(result.totalPaid)}\nPayoff: ${result.payoffMonths} months`
    : ""

  // Smart insights — payoff strategy optimizer
  const insights = useMemo(() => {
    if (!result) return [] as string[]
    const out: string[] = []
    const r = Number(rate) || 0
    const amt = Number(amount) || 0

    out.push(
      `On a ${fmt(amt)} ${currentLoanType?.label.toLowerCase() ?? "loan"} at ${r.toFixed(3)}% APR over ${
        Math.round(termMonths / 12) * 12 === termMonths
          ? `${termMonths / 12} years`
          : `${termMonths} months`
      }, your monthly payment is ${fmtFull(result.monthlyPayment)}.`
    )

    // Rate range warning
    if (currentLoanType) {
      const [low, high] = currentLoanType.rateRange
      if (r < low) {
        out.push(
          `Your ${r.toFixed(2)}% rate is below the typical ${low}%–${high}% range for a ${currentLoanType.label.toLowerCase()} — double-check the quote.`
        )
      } else if (r > high) {
        out.push(
          `Your ${r.toFixed(2)}% rate is above the typical ${low}%–${high}% range for a ${currentLoanType.label.toLowerCase()}. Shop around — you may qualify for a better rate elsewhere.`
        )
      }
    }

    // Biweekly suggestion
    if (result.monthsSavedByBiweekly >= 6) {
      const yrs = (result.monthsSavedByBiweekly / 12).toFixed(1)
      out.push(
        `Biweekly strategy: paying half of your monthly payment every 2 weeks pays the loan off ${result.monthsSavedByBiweekly} months (${yrs} years) sooner and saves ${fmt(result.interestSavedByBiweekly)} in interest.`
      )
    }

    // Extra payment recommendation if user hasn't entered any
    const ep = Number(extraPayment) || 0
    if (ep === 0 && result.monthlyPayment > 50) {
      const sample = Math.round(result.monthlyPayment * 0.1)
      const extraResult = amortize(
        amt,
        r,
        result.monthlyPayment,
        sample,
        termMonths
      )
      const monthsSaved = result.payoffMonths - extraResult.payoffMonths
      const interestSaved = result.totalInterest - extraResult.totalInterest
      if (monthsSaved >= 3) {
        out.push(
          `Try adding just ${fmt(sample)}/month extra (10% more): you'd pay it off ${monthsSaved} months sooner and save ${fmt(interestSaved)} in interest.`
        )
      }
    } else if (ep > 0 && result.monthsSavedByExtra > 0) {
      const yrs = (result.monthsSavedByExtra / 12).toFixed(1)
      out.push(
        `Adding ${fmt(ep)}/month extra cuts your loan by ${result.monthsSavedByExtra} months (${yrs} years) and saves ${fmt(result.interestSavedByExtra)} in interest.`
      )
    }

    // Refinance suggestion when rate is high
    if (currentLoanType && r >= currentLoanType.rateRange[1] - 1) {
      out.push(
        `Refinance check: your rate is on the high end. Even a 2 percentage-point drop on this balance could save thousands — worth getting fresh quotes from a credit union.`
      )
    }

    // Prepayment penalty warning
    if (
      currentLoanType &&
      currentLoanType.prepaymentPenaltyRisk !== "low" &&
      ep > 0
    ) {
      out.push(
        `Prepayment penalty alert: ${currentLoanType.label.toLowerCase()}s sometimes carry early-payoff fees. Read your loan agreement before making large extra payments.`
      )
    }

    return out
  }, [result, rate, amount, termMonths, currentLoanType, extraPayment])

  const showApprBlock = showApr

  return (
    <div className="space-y-6">
      {/* Loan Type & Inputs */}
      <div className="space-y-4">
        <div className="rounded-xl border bg-muted/30 p-4">
          <h3 className="mb-3 text-sm font-semibold text-muted-foreground">
            Loan Details
          </h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-1.5 sm:col-span-2 lg:col-span-3">
              <Label>Loan Type</Label>
              <Select value={loanType} onValueChange={handleLoanTypeChange}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LOAN_TYPES.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.label} (typical {t.rateRange[0]}–{t.rateRange[1]}%)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {currentLoanType && (
                <p className="text-xs text-muted-foreground">
                  {currentLoanType.description}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="loan-amount">Loan Amount ($)</Label>
              <Input
                id="loan-amount"
                type="number"
                min="0"
                step="100"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="loan-rate">
                Interest Rate / APR (%)
              </Label>
              <Input
                id="loan-rate"
                type="number"
                min="0"
                step="0.125"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowApr((v) => !v)}
                className="text-xs text-primary underline-offset-2 hover:underline"
              >
                {showApprBlock ? "Hide" : "What's the difference between APR and interest rate?"}
              </button>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="loan-term">Loan Term</Label>
              <div className="flex gap-2">
                <Input
                  id="loan-term"
                  type="number"
                  min="0"
                  step="1"
                  value={termValue}
                  onChange={(e) => setTermValue(e.target.value)}
                />
                <Select
                  value={termUnit}
                  onValueChange={(v: string) => setTermUnit(v as TermUnit)}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="years">Years</SelectItem>
                    <SelectItem value="months">Months</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="extra-payment">
                Extra Monthly Payment ($) <span className="text-muted-foreground">(optional)</span>
              </Label>
              <Input
                id="extra-payment"
                type="number"
                min="0"
                step="25"
                value={extraPayment}
                onChange={(e) => setExtraPayment(e.target.value)}
              />
            </div>
          </div>

          {showApprBlock && (
            <div className="mt-4 rounded-lg border border-primary/20 bg-primary/5 p-3 text-sm">
              <p className="mb-1 font-semibold text-primary">
                APR vs Interest Rate
              </p>
              <p className="text-muted-foreground">
                The <strong>interest rate</strong> is what the lender charges
                on the principal balance. The <strong>APR</strong> (Annual
                Percentage Rate) bundles the interest rate together with most
                up-front fees and origination costs, giving you the true yearly
                cost of borrowing. APR is almost always higher than the
                interest rate. When comparing loans, always compare APR to APR
                — not interest rate to APR.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap items-center gap-3">
        <Button onClick={saveToHistory}>Save to History</Button>
        <Button
          variant="outline"
          onClick={addToComparison}
          disabled={!result || comparisons.length >= 4}
        >
          {comparisons.length >= 4
            ? "Comparison full (4 max)"
            : `Add to Comparison (${comparisons.length}/4)`}
        </Button>
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl bg-primary/10 p-4 text-center">
              <div className="text-xs font-medium text-muted-foreground">
                Monthly Payment
              </div>
              <div className="mt-1 text-2xl font-bold text-primary">
                {fmtFull(result.monthlyPayment)}
              </div>
            </div>
            <div className="rounded-xl bg-muted p-4 text-center">
              <div className="text-xs font-medium text-muted-foreground">
                Total Interest
              </div>
              <div className="mt-1 text-xl font-semibold">
                {fmt(result.totalInterest)}
              </div>
            </div>
            <div className="rounded-xl bg-muted p-4 text-center">
              <div className="text-xs font-medium text-muted-foreground">
                Total Paid
              </div>
              <div className="mt-1 text-xl font-semibold">
                {fmt(result.totalPaid)}
              </div>
            </div>
            <div className="rounded-xl bg-muted p-4 text-center">
              <div className="text-xs font-medium text-muted-foreground">
                Payoff Date
              </div>
              <div className="mt-1 text-xl font-semibold">
                {result.payoffDate.toLocaleDateString("en-US", {
                  month: "short",
                  year: "numeric",
                })}
              </div>
            </div>
          </div>

          {/* Smart Insights Panel (USP #3 — payoff strategy optimizer) */}
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
            <h3 className="mb-3 font-semibold text-primary">
              Smart Insights & Payoff Strategy
            </h3>
            <ul className="space-y-2 text-sm">
              {insights.map((line, i) => (
                <li key={i}>{line}</li>
              ))}
            </ul>
          </div>

          {/* Charts */}
          <Tabs defaultValue="breakdown">
            <TabsList>
              <TabsTrigger value="breakdown">Cost Breakdown</TabsTrigger>
              <TabsTrigger value="balance">Balance Over Time</TabsTrigger>
              <TabsTrigger value="yearly">Principal vs Interest</TabsTrigger>
            </TabsList>
            <TabsContent value="breakdown" className="pt-4">
              <p className="mb-3 text-sm text-muted-foreground">
                How your total payments split between principal (the amount
                you borrowed) and interest (what you pay the lender on top).
              </p>
              <LoanCalculatorCharts
                type="breakdown"
                principal={Number(amount) || 0}
                interest={result.totalInterest}
              />
            </TabsContent>
            <TabsContent value="balance" className="pt-4">
              <p className="mb-3 text-sm text-muted-foreground">
                Loan balance over time. {Number(extraPayment) > 0
                  ? "The green line shows how extra payments accelerate payoff."
                  : "Add an extra monthly payment above to see how it accelerates payoff."}
              </p>
              <LoanCalculatorCharts
                type="balance"
                data={result.balanceCurve}
                hasExtra={Number(extraPayment) > 0}
              />
            </TabsContent>
            <TabsContent value="yearly" className="pt-4">
              <p className="mb-3 text-sm text-muted-foreground">
                How each year&apos;s payments split between principal and
                interest. Early years are interest-heavy.
              </p>
              <LoanCalculatorCharts
                type="principal-interest"
                yearSchedule={result.yearSchedule.map((r) => ({
                  year: r.year,
                  principal: r.principal,
                  interest: r.interest,
                }))}
              />
            </TabsContent>
          </Tabs>

          {/* Action row */}
          <div className="flex flex-wrap gap-2">
            <CopyButton value={summary} label="Copy Results" />
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSchedule(!showSchedule)}
            >
              {showSchedule ? "Hide" : "Show"} Amortization Schedule
            </Button>
          </div>

          <ShareResult
            url={getShareUrl()}
            resultText={`My ${currentLoanType?.label.toLowerCase() ?? "loan"} payment: ${fmtFull(result.monthlyPayment)}/month on a ${fmt(Number(amount))} loan.`}
            toolName="Loan Calculator"
            hashtags={["LoanCalculator", "PersonalFinance"]}
          />

          {/* Amortization Schedule */}
          {showSchedule && (
            <div className="overflow-x-auto rounded-xl border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="px-4 py-2 text-left">Year</th>
                    <th className="px-4 py-2 text-right">Principal Paid</th>
                    <th className="px-4 py-2 text-right">Interest Paid</th>
                    <th className="px-4 py-2 text-right">Remaining Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {result.yearSchedule.map((row) => (
                    <tr key={row.year} className="border-b last:border-0">
                      <td className="px-4 py-2">{row.year}</td>
                      <td className="px-4 py-2 text-right">
                        {fmt(row.principal)}
                      </td>
                      <td className="px-4 py-2 text-right">
                        {fmt(row.interest)}
                      </td>
                      <td className="px-4 py-2 text-right">
                        {fmt(row.balance)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Side-by-side comparison (USP #2) */}
      {comparisons.length > 0 && (
        <div className="rounded-xl border p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-semibold">
              Side-by-Side Comparison ({comparisons.length}/4)
            </h3>
            <button
              onClick={clearComparisons}
              className="text-sm text-muted-foreground transition hover:text-red-500"
            >
              Clear All
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="px-3 py-2 text-left font-medium">Loan</th>
                  <th className="px-3 py-2 text-right font-medium">Amount</th>
                  <th className="px-3 py-2 text-right font-medium">Rate</th>
                  <th className="px-3 py-2 text-right font-medium">Term</th>
                  <th className="px-3 py-2 text-right font-medium">
                    Monthly
                  </th>
                  <th className="px-3 py-2 text-right font-medium">
                    Total Interest
                  </th>
                  <th className="px-3 py-2 text-right font-medium">
                    Total Paid
                  </th>
                  <th className="px-3 py-2"></th>
                </tr>
              </thead>
              <tbody>
                {comparisons.map((c) => {
                  const cheapest = comparisons.reduce((a, b) =>
                    a.totalPaid < b.totalPaid ? a : b
                  )
                  const isWinner = c.id === cheapest.id && comparisons.length > 1
                  return (
                    <tr
                      key={c.id}
                      className={`border-b last:border-0 ${
                        isWinner ? "bg-green-50 dark:bg-green-950/30" : ""
                      }`}
                    >
                      <td className="px-3 py-2 font-medium">
                        {c.label}
                        {isWinner && (
                          <span className="ml-2 rounded-full bg-green-600 px-2 py-0.5 text-xs text-white">
                            Cheapest
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-2 text-right">{fmt(c.amount)}</td>
                      <td className="px-3 py-2 text-right">
                        {c.rate.toFixed(2)}%
                      </td>
                      <td className="px-3 py-2 text-right">
                        {c.termMonths} mo
                      </td>
                      <td className="px-3 py-2 text-right font-semibold">
                        {fmtFull(c.monthlyPayment)}
                      </td>
                      <td className="px-3 py-2 text-right">
                        {fmt(c.totalInterest)}
                      </td>
                      <td className="px-3 py-2 text-right">
                        {fmt(c.totalPaid)}
                      </td>
                      <td className="px-3 py-2 text-right">
                        <button
                          onClick={() => removeComparison(c.id)}
                          className="rounded p-1 text-muted-foreground transition hover:bg-red-100 hover:text-red-500"
                          aria-label="Remove from comparison"
                          title="Remove"
                        >
                          ×
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <CalculationHistory
        toolSlug="loan-calculator"
        formatResult={(r) => {
          const res = r as { monthlyPayment: number; totalInterest: number }
          return `${fmtFull(res.monthlyPayment)}/mo · ${fmt(res.totalInterest)} interest`
        }}
        formatInputs={(inputs) =>
          `${fmt(Number(inputs.amount))} @ ${inputs.rate}% / ${inputs.termValue} ${inputs.termUnit}`
        }
      />
    </div>
  )
}
