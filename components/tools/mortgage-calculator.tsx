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

const MortgageCharts = dynamic(() => import("./mortgage-charts"), {
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

function fmtPct(n: number) {
  return `${n.toFixed(2)}%`
}

// --- Types ---

interface MonthRow {
  month: number
  payment: number
  principal: number
  interest: number
  balance: number
  totalInterest: number
}

interface YearRow {
  year: number
  principal: number
  interest: number
  balance: number
}

interface MortgageResult {
  loanAmount: number
  monthlyPI: number
  monthlyTax: number
  monthlyInsurance: number
  monthlyPMI: number
  monthlyHOA: number
  totalMonthly: number
  totalPayment: number
  totalInterest: number
  totalPMI: number
  pmiRemovalMonth: number | null // month number when PMI drops off
  pmiRemovalDate: string | null
  ltv: number
  yearSchedule: YearRow[]
  monthSchedule: MonthRow[]
  biweeklySavings: {
    interestSaved: number
    yearsSaved: number
    totalInterest: number
  } | null
  extraPaymentSavings: {
    interestSaved: number
    yearsSaved: number
    newPayoff: number // months
  } | null
  taxDeductionYear1: number
}

// --- Calculation engine ---

function calculateMortgage(
  homePrice: number,
  downPayment: number,
  annualRate: number,
  termYears: number,
  propertyTaxRate: number,
  annualInsurance: number,
  monthlyHOA: number,
  pmiRate: number,
  startMonth: number,
  startYear: number,
  extraMonthly: number,
  taxBracket: number
): MortgageResult | null {
  const loanAmount = homePrice - downPayment
  if (loanAmount <= 0 || termYears <= 0 || homePrice <= 0) return null

  const ltv = (loanAmount / homePrice) * 100
  const monthlyRate = annualRate / 100 / 12
  const n = termYears * 12

  // Monthly P&I
  let monthlyPI: number
  if (monthlyRate === 0) {
    monthlyPI = loanAmount / n
  } else {
    monthlyPI =
      (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, n))) /
      (Math.pow(1 + monthlyRate, n) - 1)
  }

  const monthlyTax = (homePrice * (propertyTaxRate / 100)) / 12
  const monthlyInsurance = annualInsurance / 12
  const monthlyPMIAmount = ltv > 80 ? (loanAmount * (pmiRate / 100)) / 12 : 0

  const totalMonthly = monthlyPI + monthlyTax + monthlyInsurance + monthlyPMIAmount + monthlyHOA

  // Build month-by-month amortization
  const monthSchedule: MonthRow[] = []
  let balance = loanAmount
  let totalInterest = 0
  let totalPMI = 0
  let pmiRemovalMonth: number | null = null
  let year1Interest = 0

  for (let m = 1; m <= n; m++) {
    if (balance <= 0) break
    const interestPayment = balance * monthlyRate
    let principalPayment = monthlyPI - interestPayment

    // PMI check
    const currentLTV = (balance / homePrice) * 100
    const pmiThisMonth = currentLTV > 78 && !pmiRemovalMonth ? monthlyPMIAmount : 0
    if (currentLTV <= 78 && !pmiRemovalMonth && monthlyPMIAmount > 0) {
      pmiRemovalMonth = m
    }
    totalPMI += pmiThisMonth

    if (principalPayment > balance) principalPayment = balance
    balance -= principalPayment
    totalInterest += interestPayment

    if (m <= 12) year1Interest += interestPayment

    monthSchedule.push({
      month: m,
      payment: monthlyPI,
      principal: principalPayment,
      interest: interestPayment,
      balance: Math.max(0, balance),
      totalInterest,
    })
  }

  // Build yearly schedule
  const yearSchedule: YearRow[] = []
  for (let yr = 0; yr < termYears; yr++) {
    const yearMonths = monthSchedule.slice(yr * 12, (yr + 1) * 12)
    if (yearMonths.length === 0) break
    yearSchedule.push({
      year: yr + 1,
      principal: yearMonths.reduce((s, m) => s + m.principal, 0),
      interest: yearMonths.reduce((s, m) => s + m.interest, 0),
      balance: yearMonths[yearMonths.length - 1].balance,
    })
  }

  // PMI removal date
  let pmiRemovalDate: string | null = null
  if (pmiRemovalMonth) {
    const removeDate = new Date(startYear, startMonth - 1 + pmiRemovalMonth)
    pmiRemovalDate = removeDate.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    })
  }

  // Biweekly payment savings
  const biweeklySavings = calculateBiweekly(loanAmount, monthlyRate, monthlyPI, n)

  // Extra payment savings
  const extraPaymentSavings =
    extraMonthly > 0
      ? calculateExtraPayment(loanAmount, monthlyRate, monthlyPI, extraMonthly, n, totalInterest)
      : null

  // Tax deduction estimate (Year 1 mortgage interest * tax bracket)
  const taxDeductionYear1 = year1Interest * (taxBracket / 100)

  const totalPayment = monthlyPI * n + (monthlyTax + monthlyInsurance + monthlyHOA) * n + totalPMI

  return {
    loanAmount,
    monthlyPI,
    monthlyTax,
    monthlyInsurance,
    monthlyPMI: monthlyPMIAmount,
    monthlyHOA,
    totalMonthly,
    totalPayment,
    totalInterest,
    totalPMI,
    pmiRemovalMonth,
    pmiRemovalDate,
    ltv,
    yearSchedule,
    monthSchedule,
    biweeklySavings,
    extraPaymentSavings,
    taxDeductionYear1,
  }
}

function calculateBiweekly(
  loanAmount: number,
  monthlyRate: number,
  monthlyPI: number,
  totalMonths: number
) {
  // Biweekly = half the monthly payment every 2 weeks = 26 half-payments = 13 full payments/year
  const biweeklyPayment = monthlyPI / 2
  let balance = loanAmount
  let totalInterest = 0
  let payments = 0
  const dailyRate = monthlyRate * 12 / 365

  // Simulate biweekly (every 14 days)
  while (balance > 0 && payments < totalMonths * 2.5) {
    const interestAccrued = balance * dailyRate * 14
    let principalPaid = biweeklyPayment - interestAccrued
    if (principalPaid > balance) principalPaid = balance
    balance -= principalPaid
    totalInterest += interestAccrued
    payments++
    if (payments > 10000) break
  }

  // Standard total interest
  let stdBalance = loanAmount
  let stdTotalInterest = 0
  for (let m = 0; m < totalMonths; m++) {
    const interest = stdBalance * monthlyRate
    const principal = monthlyPI - interest
    stdBalance -= principal
    stdTotalInterest += interest
    if (stdBalance <= 0) break
  }

  const interestSaved = stdTotalInterest - totalInterest
  const biweeklyMonths = (payments * 14) / 30.44
  const yearsSaved = (totalMonths - biweeklyMonths) / 12

  return {
    interestSaved: Math.max(0, interestSaved),
    yearsSaved: Math.max(0, yearsSaved),
    totalInterest,
  }
}

function calculateExtraPayment(
  loanAmount: number,
  monthlyRate: number,
  monthlyPI: number,
  extraMonthly: number,
  totalMonths: number,
  standardTotalInterest: number
) {
  let balance = loanAmount
  let totalInterest = 0
  let months = 0

  while (balance > 0 && months < totalMonths) {
    const interest = balance * monthlyRate
    let principal = monthlyPI - interest + extraMonthly
    if (principal > balance) principal = balance
    balance -= principal
    totalInterest += interest
    months++
  }

  return {
    interestSaved: standardTotalInterest - totalInterest,
    yearsSaved: (totalMonths - months) / 12,
    newPayoff: months,
  }
}

// --- Component ---

const TERMS = ["15", "20", "30"]
const TAX_BRACKETS = ["10", "12", "22", "24", "32", "35", "37"]

export default function MortgageCalculator() {
  // Inputs
  const [homePrice, setHomePrice] = useState("400000")
  const [downPaymentValue, setDownPaymentValue] = useState("80000")
  const [downPaymentMode, setDownPaymentMode] = useState<"dollar" | "percent">("dollar")
  const [rate, setRate] = useState("6.5")
  const [term, setTerm] = useState("30")
  const [state, setState] = useState(DEFAULT_STATE)
  const [propertyTaxRate, setPropertyTaxRate] = useState(
    () => getStateByAbbr(DEFAULT_STATE)?.propertyTaxRate.toString() ?? "0.74"
  )
  const [insurance, setInsurance] = useState("1800")
  const [hoa, setHoa] = useState("0")
  const [pmiRate, setPmiRate] = useState("0.5")
  const [startMonth, setStartMonth] = useState(
    () => String(new Date().getMonth() + 1)
  )
  const [startYear, setStartYear] = useState(() =>
    String(new Date().getFullYear())
  )
  const [extraPayment, setExtraPayment] = useState("0")
  const [taxBracket, setTaxBracket] = useState("22")
  const [showBiweekly, setShowBiweekly] = useState(false)

  // UI state
  const [showSchedule, setShowSchedule] = useState(false)
  const [, setHistory] = useLocalStorage<HistoryItem[]>(
    "mortgage-calculator-history",
    []
  )

  // Handle state change -> auto-fill property tax
  const handleStateChange = useCallback((abbr: string) => {
    setState(abbr)
    const info = getStateByAbbr(abbr)
    if (info) {
      setPropertyTaxRate(info.propertyTaxRate.toString())
    }
  }, [])

  // Compute down payment in dollars
  const downPaymentDollars = useMemo(() => {
    if (downPaymentMode === "dollar") return Number(downPaymentValue) || 0
    return (Number(homePrice) * (Number(downPaymentValue) / 100)) || 0
  }, [downPaymentMode, downPaymentValue, homePrice])

  const downPaymentPercent = useMemo(() => {
    const hp = Number(homePrice) || 1
    return (downPaymentDollars / hp) * 100
  }, [downPaymentDollars, homePrice])

  // Calculate result
  const result = useMemo(() => {
    return calculateMortgage(
      Number(homePrice) || 0,
      downPaymentDollars,
      Number(rate) || 0,
      Number(term) || 0,
      Number(propertyTaxRate) || 0,
      Number(insurance) || 0,
      Number(hoa) || 0,
      Number(pmiRate) || 0,
      Number(startMonth),
      Number(startYear),
      Number(extraPayment) || 0,
      Number(taxBracket) || 22
    )
  }, [
    homePrice,
    downPaymentDollars,
    rate,
    term,
    propertyTaxRate,
    insurance,
    hoa,
    pmiRate,
    startMonth,
    startYear,
    extraPayment,
    taxBracket,
  ])

  // Save to history
  const saveToHistory = useCallback(() => {
    if (!result) return
    const params = new URLSearchParams({
      hp: homePrice,
      dp: downPaymentValue,
      dpm: downPaymentMode,
      r: rate,
      t: term,
      s: state,
      ptr: propertyTaxRate,
      ins: insurance,
      hoa,
      pmi: pmiRate,
      ep: extraPayment,
    })
    const url = `${window.location.origin}/tools/mortgage-calculator?${params}`
    setHistory((prev) => [
      {
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        inputs: { homePrice, downPaymentValue, rate, term, state },
        result: {
          monthly: result.totalMonthly,
          totalPayment: result.totalPayment,
          totalInterest: result.totalInterest,
        },
        shareableUrl: url,
      },
      ...prev.slice(0, 9),
    ])
  }, [result, homePrice, downPaymentValue, downPaymentMode, rate, term, state, propertyTaxRate, insurance, hoa, pmiRate, extraPayment, setHistory])

  function getShareUrl() {
    const params = new URLSearchParams({
      hp: homePrice,
      dp: downPaymentValue,
      dpm: downPaymentMode,
      r: rate,
      t: term,
      s: state,
      ptr: propertyTaxRate,
      ins: insurance,
      hoa,
      pmi: pmiRate,
      ep: extraPayment,
    })
    return `${typeof window !== "undefined" ? window.location.origin : ""}/tools/mortgage-calculator?${params}`
  }

  const summary = result
    ? `Monthly Payment: ${fmtFull(result.totalMonthly)}\nP&I: ${fmtFull(result.monthlyPI)}\nTax: ${fmtFull(result.monthlyTax)}\nInsurance: ${fmtFull(result.monthlyInsurance)}\nPMI: ${fmtFull(result.monthlyPMI)}\nHOA: ${fmtFull(result.monthlyHOA)}\nTotal Interest: ${fmtFull(result.totalInterest)}\nTotal Cost: ${fmtFull(result.totalPayment)}`
    : ""

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Home Price */}
        <div className="space-y-1.5">
          <Label htmlFor="home-price">Home Price ($)</Label>
          <Input
            id="home-price"
            type="number"
            min="0"
            step="1000"
            value={homePrice}
            onChange={(e) => setHomePrice(e.target.value)}
          />
        </div>

        {/* Down Payment with $ / % toggle */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="down-payment">
              Down Payment ({downPaymentMode === "dollar" ? "$" : "%"})
            </Label>
            <button
              type="button"
              className="text-xs font-medium text-primary hover:underline"
              onClick={() =>
                setDownPaymentMode((m) => {
                  if (m === "dollar") {
                    setDownPaymentValue(downPaymentPercent.toFixed(1))
                    return "percent"
                  }
                  setDownPaymentValue(Math.round(downPaymentDollars).toString())
                  return "dollar"
                })
              }
            >
              Switch to {downPaymentMode === "dollar" ? "%" : "$"}
            </button>
          </div>
          <Input
            id="down-payment"
            type="number"
            min="0"
            step={downPaymentMode === "dollar" ? "1000" : "0.5"}
            value={downPaymentValue}
            onChange={(e) => setDownPaymentValue(e.target.value)}
          />
          {downPaymentMode === "dollar" && (
            <p className="text-xs text-muted-foreground">
              {fmtPct(downPaymentPercent)} of home price
            </p>
          )}
          {downPaymentMode === "percent" && (
            <p className="text-xs text-muted-foreground">
              {fmt(downPaymentDollars)}
            </p>
          )}
        </div>

        {/* Interest Rate */}
        <div className="space-y-1.5">
          <Label htmlFor="rate">Interest Rate (%)</Label>
          <Input
            id="rate"
            type="number"
            min="0"
            step="0.125"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
          />
        </div>

        {/* Loan Term */}
        <div className="space-y-1.5">
          <Label>Loan Term</Label>
          <Select value={term} onValueChange={setTerm}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TERMS.map((t) => (
                <SelectItem key={t} value={t}>
                  {t} years
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* State */}
        <div className="space-y-1.5">
          <Label>State</Label>
          <Select value={state} onValueChange={handleStateChange}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {US_STATES.map((s) => (
                <SelectItem key={s.abbr} value={s.abbr}>
                  {s.name} ({fmtPct(s.propertyTaxRate)})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Property Tax Rate */}
        <div className="space-y-1.5">
          <Label htmlFor="tax-rate">Property Tax Rate (% / year)</Label>
          <Input
            id="tax-rate"
            type="number"
            min="0"
            step="0.01"
            value={propertyTaxRate}
            onChange={(e) => setPropertyTaxRate(e.target.value)}
          />
        </div>

        {/* Annual Insurance */}
        <div className="space-y-1.5">
          <Label htmlFor="insurance">Annual Home Insurance ($)</Label>
          <Input
            id="insurance"
            type="number"
            min="0"
            step="100"
            value={insurance}
            onChange={(e) => setInsurance(e.target.value)}
          />
        </div>

        {/* HOA */}
        <div className="space-y-1.5">
          <Label htmlFor="hoa">Monthly HOA ($)</Label>
          <Input
            id="hoa"
            type="number"
            min="0"
            step="25"
            value={hoa}
            onChange={(e) => setHoa(e.target.value)}
          />
        </div>

        {/* PMI Rate */}
        <div className="space-y-1.5">
          <Label htmlFor="pmi-rate">PMI Rate (% / year)</Label>
          <Input
            id="pmi-rate"
            type="number"
            min="0"
            step="0.1"
            value={pmiRate}
            onChange={(e) => setPmiRate(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            {downPaymentPercent >= 20
              ? "No PMI needed (20%+ down)"
              : "PMI applies until 78% LTV"}
          </p>
        </div>

        {/* Start Date */}
        <div className="space-y-1.5">
          <Label>Start Date</Label>
          <div className="flex gap-2">
            <Select value={startMonth} onValueChange={setStartMonth}>
              <SelectTrigger className="flex-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 12 }, (_, i) => (
                  <SelectItem key={i + 1} value={String(i + 1)}>
                    {new Date(2000, i).toLocaleString("en-US", {
                      month: "short",
                    })}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="number"
              className="w-24"
              value={startYear}
              onChange={(e) => setStartYear(e.target.value)}
              min="2020"
              max="2050"
            />
          </div>
        </div>

        {/* Extra Monthly Payment */}
        <div className="space-y-1.5">
          <Label htmlFor="extra-payment">Extra Monthly Payment ($)</Label>
          <Input
            id="extra-payment"
            type="number"
            min="0"
            step="50"
            value={extraPayment}
            onChange={(e) => setExtraPayment(e.target.value)}
          />
        </div>

        {/* Tax Bracket */}
        <div className="space-y-1.5">
          <Label>Federal Tax Bracket (%)</Label>
          <Select value={taxBracket} onValueChange={setTaxBracket}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TAX_BRACKETS.map((b) => (
                <SelectItem key={b} value={b}>
                  {b}%
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap items-center gap-3">
        <Button onClick={saveToHistory}>Save to History</Button>
        <label className="flex cursor-pointer items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={showBiweekly}
            onChange={(e) => setShowBiweekly(e.target.checked)}
            className="rounded"
          />
          Show biweekly savings
        </label>
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-6">
          {/* Payment Breakdown Cards */}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl bg-primary/10 p-4 text-center">
              <div className="text-xs font-medium text-muted-foreground">
                Total Monthly Payment
              </div>
              <div className="mt-1 text-2xl font-bold text-primary">
                {fmtFull(result.totalMonthly)}
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
                Total Loan Cost
              </div>
              <div className="mt-1 text-xl font-semibold">
                {fmt(result.totalPayment)}
              </div>
            </div>
            <div className="rounded-xl bg-muted p-4 text-center">
              <div className="text-xs font-medium text-muted-foreground">
                Loan Amount
              </div>
              <div className="mt-1 text-xl font-semibold">
                {fmt(result.loanAmount)}
              </div>
            </div>
          </div>

          {/* Monthly Payment Breakdown */}
          <div className="rounded-xl border p-4">
            <h3 className="mb-3 font-semibold">Monthly Payment Breakdown</h3>
            <div className="space-y-2">
              <BreakdownRow
                label="Principal & Interest"
                value={result.monthlyPI}
                total={result.totalMonthly}
                color="bg-blue-500"
              />
              <BreakdownRow
                label="Property Tax"
                value={result.monthlyTax}
                total={result.totalMonthly}
                color="bg-green-500"
              />
              <BreakdownRow
                label="Home Insurance"
                value={result.monthlyInsurance}
                total={result.totalMonthly}
                color="bg-yellow-500"
              />
              {result.monthlyPMI > 0 && (
                <BreakdownRow
                  label="PMI"
                  value={result.monthlyPMI}
                  total={result.totalMonthly}
                  color="bg-red-500"
                />
              )}
              {result.monthlyHOA > 0 && (
                <BreakdownRow
                  label="HOA"
                  value={result.monthlyHOA}
                  total={result.totalMonthly}
                  color="bg-purple-500"
                />
              )}
            </div>
          </div>

          {/* Smart Insights Panel */}
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
            <h3 className="mb-3 font-semibold text-primary">Smart Insights</h3>
            <ul className="space-y-2 text-sm">
              <li>
                Your LTV is {fmtPct(result.ltv)}.{" "}
                {result.ltv > 80
                  ? `You'll pay PMI of ${fmtFull(result.monthlyPMI)}/month until your LTV reaches 78%.`
                  : "No PMI required, great!"}
              </li>
              {result.pmiRemovalDate && (
                <li>
                  PMI drops off in <strong>{result.pmiRemovalDate}</strong> (month{" "}
                  {result.pmiRemovalMonth}). Total PMI paid:{" "}
                  <strong>{fmt(result.totalPMI)}</strong>.
                </li>
              )}
              {result.ltv > 80 && (
                <li>
                  Increasing your down payment by{" "}
                  {fmt(
                    Math.ceil(
                      (Number(homePrice) * 0.2 - downPaymentDollars) / 1000
                    ) * 1000
                  )}{" "}
                  to 20% would eliminate PMI and save you{" "}
                  {fmt(result.totalPMI)} over the life of the loan.
                </li>
              )}
              {result.extraPaymentSavings && (
                <li>
                  Adding {fmt(Number(extraPayment))}/month extra saves you{" "}
                  <strong>
                    {fmt(result.extraPaymentSavings.interestSaved)}
                  </strong>{" "}
                  in interest and pays off your loan{" "}
                  <strong>
                    {result.extraPaymentSavings.yearsSaved.toFixed(1)} years
                  </strong>{" "}
                  early.
                </li>
              )}
              <li>
                Estimated Year 1 mortgage interest tax deduction:{" "}
                <strong>{fmt(result.taxDeductionYear1)}</strong> (at{" "}
                {taxBracket}% bracket).
              </li>
            </ul>
          </div>

          {/* Biweekly Savings */}
          {showBiweekly && result.biweeklySavings && (
            <div className="rounded-xl border border-green-500/20 bg-green-50 p-4 dark:bg-green-950/20">
              <h3 className="mb-2 font-semibold text-green-700 dark:text-green-400">
                Biweekly Payment Savings
              </h3>
              <p className="text-sm">
                By paying {fmtFull(result.monthlyPI / 2)} every two weeks
                instead of {fmtFull(result.monthlyPI)}/month, you make 13 full
                payments per year instead of 12.
              </p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg bg-white/80 p-3 text-center dark:bg-black/20">
                  <div className="text-xs text-muted-foreground">
                    Interest Saved
                  </div>
                  <div className="text-lg font-bold text-green-600">
                    {fmt(result.biweeklySavings.interestSaved)}
                  </div>
                </div>
                <div className="rounded-lg bg-white/80 p-3 text-center dark:bg-black/20">
                  <div className="text-xs text-muted-foreground">
                    Years Saved
                  </div>
                  <div className="text-lg font-bold text-green-600">
                    {result.biweeklySavings.yearsSaved.toFixed(1)} years
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Charts */}
          <Tabs defaultValue="breakdown">
            <TabsList>
              <TabsTrigger value="breakdown">Payment Breakdown</TabsTrigger>
              <TabsTrigger value="overtime">Over Time</TabsTrigger>
              <TabsTrigger value="yearly">Yearly Paydown</TabsTrigger>
            </TabsList>
            <TabsContent value="breakdown" className="pt-4">
              <MortgageCharts
                type="pie"
                monthlyPI={result.monthlyPI}
                monthlyTax={result.monthlyTax}
                monthlyInsurance={result.monthlyInsurance}
                monthlyPMI={result.monthlyPMI}
                monthlyHOA={result.monthlyHOA}
              />
            </TabsContent>
            <TabsContent value="overtime" className="pt-4">
              <MortgageCharts
                type="line"
                yearSchedule={result.yearSchedule}
              />
            </TabsContent>
            <TabsContent value="yearly" className="pt-4">
              <MortgageCharts
                type="bar"
                yearSchedule={result.yearSchedule}
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
            resultText={`My estimated mortgage payment: ${fmtFull(result.totalMonthly)}/month on a ${fmt(Number(homePrice))} home.`}
            toolName="Mortgage Calculator"
            hashtags={["MortgageCalculator", "HomeBuying"]}
          />

          {/* Amortization Table */}
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

      <CalculationHistory
        toolSlug="mortgage-calculator"
        formatResult={(r) => {
          const res = r as { monthly: number }
          return `Monthly: ${fmtFull(res.monthly)}`
        }}
        formatInputs={(inputs) =>
          `${fmt(Number(inputs.homePrice))} home, ${inputs.rate}% rate, ${inputs.term}yr`
        }
      />
    </div>
  )
}

// --- Breakdown Row ---

function BreakdownRow({
  label,
  value,
  total,
  color,
}: {
  label: string
  value: number
  total: number
  color: string
}) {
  const pct = total > 0 ? (value / total) * 100 : 0
  return (
    <div className="flex items-center gap-3">
      <div className={`h-3 w-3 shrink-0 rounded-full ${color}`} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between">
          <span className="text-sm">{label}</span>
          <span className="text-sm font-medium">
            {fmtFull(value)}{" "}
            <span className="text-xs text-muted-foreground">
              ({pct.toFixed(1)}%)
            </span>
          </span>
        </div>
        <div className="mt-1 h-1.5 w-full rounded-full bg-muted">
          <div
            className={`h-full rounded-full ${color}`}
            style={{ width: `${Math.min(pct, 100)}%` }}
          />
        </div>
      </div>
    </div>
  )
}
