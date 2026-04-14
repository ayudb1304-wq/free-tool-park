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
import {
  VEHICLE_TAX_STATES,
  getVehicleTaxStateByAbbr,
  DEFAULT_VEHICLE_TAX_STATE,
} from "@/data/state-vehicle-sales-tax"
import dynamic from "next/dynamic"

const AutoLoanCharts = dynamic(() => import("./auto-loan-charts"), {
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

interface ValueVsBalancePoint {
  month: number
  balance: number
  value: number
}

interface AutoLoanResult {
  amountFinanced: number
  salesTaxAmount: number
  tradeInEquity: number // positive = equity, negative = underwater
  monthlyPayment: number
  totalInterest: number
  totalCost: number // total out of pocket: down + all payments + fees
  totalPaid: number // monthly * months
  payoffMonth: number
  monthSchedule: MonthRow[]
  yearSchedule: YearRow[]
  valueVsBalance: ValueVsBalancePoint[]
  upsideDownMonths: number // months spent underwater (negative equity)
  crossoverMonth: number | null // month when balance <= value
  monthlyDepreciationRate: number
}

// --- Calculation engine ---

function monthlyPayment(
  principal: number,
  annualRate: number,
  months: number
) {
  if (principal <= 0 || months <= 0) return 0
  const r = annualRate / 100 / 12
  if (r === 0) return principal / months
  return (
    (principal * (r * Math.pow(1 + r, months))) /
    (Math.pow(1 + r, months) - 1)
  )
}

function calculateAutoLoan(
  vehiclePrice: number,
  downPayment: number,
  tradeInValue: number,
  tradeInOwed: number,
  annualRate: number,
  termMonths: number,
  salesTaxRate: number,
  fees: number,
  taxOnTradeInReduction: boolean
): AutoLoanResult | null {
  if (vehiclePrice <= 0 || termMonths <= 0) return null

  // Trade-in equity (positive if trade is worth more than what is owed).
  const tradeInEquity = tradeInValue - tradeInOwed

  // Most states tax the vehicle price minus the trade-in value.
  // A handful tax the full price, so we expose a toggle.
  const taxableAmount = taxOnTradeInReduction
    ? Math.max(0, vehiclePrice - tradeInValue)
    : vehiclePrice
  const salesTaxAmount = (taxableAmount * salesTaxRate) / 100

  // Amount financed = price + tax + fees - down - trade-in equity.
  // If the trade-in is underwater (negative equity), the amount owed rolls
  // into the new loan.
  const amountFinanced = Math.max(
    0,
    vehiclePrice + salesTaxAmount + fees - downPayment - tradeInEquity
  )

  const pmt = monthlyPayment(amountFinanced, annualRate, termMonths)
  if (!Number.isFinite(pmt)) return null

  // Month-by-month amortization
  const monthSchedule: MonthRow[] = []
  let balance = amountFinanced
  let totalInterest = 0
  const r = annualRate / 100 / 12

  for (let m = 1; m <= termMonths; m++) {
    if (balance <= 0.0001) break
    const interestPayment = balance * r
    let principalPayment = pmt - interestPayment
    if (principalPayment > balance) principalPayment = balance
    balance -= principalPayment
    totalInterest += interestPayment
    monthSchedule.push({
      month: m,
      payment: pmt,
      principal: principalPayment,
      interest: interestPayment,
      balance: Math.max(0, balance),
    })
  }

  // Yearly schedule
  const yearSchedule: YearRow[] = []
  const years = Math.ceil(termMonths / 12)
  for (let yr = 0; yr < years; yr++) {
    const yearMonths = monthSchedule.slice(yr * 12, (yr + 1) * 12)
    if (yearMonths.length === 0) break
    yearSchedule.push({
      year: yr + 1,
      principal: yearMonths.reduce((s, m) => s + m.principal, 0),
      interest: yearMonths.reduce((s, m) => s + m.interest, 0),
      balance: yearMonths[yearMonths.length - 1].balance,
    })
  }

  // Vehicle value depreciation. New cars lose ~20% in year 1 and ~15%/yr
  // for the next 4 years, flattening to ~8%/yr after. We simplify to a
  // geometric monthly depreciation of ~1.25% that roughly matches this
  // curve for the first 5-6 years.
  const monthlyDepreciationRate = 0.0125
  const valueVsBalance: ValueVsBalancePoint[] = []
  let currentValue = vehiclePrice
  let crossoverMonth: number | null = null
  let upsideDownMonths = 0

  // Seed month 0
  valueVsBalance.push({
    month: 0,
    balance: amountFinanced,
    value: vehiclePrice,
  })

  for (let m = 1; m <= termMonths; m++) {
    currentValue = currentValue * (1 - monthlyDepreciationRate)
    const row = monthSchedule[m - 1]
    const bal = row ? row.balance : 0
    valueVsBalance.push({
      month: m,
      balance: bal,
      value: currentValue,
    })
    if (bal > currentValue) {
      upsideDownMonths++
    } else if (crossoverMonth == null && bal > 0) {
      crossoverMonth = m
    }
  }

  const payoffMonth = monthSchedule.length
  const totalPaid = pmt * payoffMonth
  // Total cost out of pocket: down payment + all monthly payments + any
  // trade-in underwater amount is already financed. Fees/tax already rolled
  // in. We don't double-count fees.
  const totalCost = downPayment + totalPaid

  return {
    amountFinanced,
    salesTaxAmount,
    tradeInEquity,
    monthlyPayment: pmt,
    totalInterest,
    totalCost,
    totalPaid,
    payoffMonth,
    monthSchedule,
    yearSchedule,
    valueVsBalance,
    upsideDownMonths,
    crossoverMonth,
    monthlyDepreciationRate,
  }
}

// --- Component ---

const LOAN_TERMS = ["24", "36", "48", "60", "72", "84"]

export default function AutoLoanCalculator() {
  // Inputs
  const [vehiclePrice, setVehiclePrice] = useState("35000")
  const [downPayment, setDownPayment] = useState("5000")
  const [tradeInValue, setTradeInValue] = useState("0")
  const [tradeInOwed, setTradeInOwed] = useState("0")
  const [rate, setRate] = useState("7.5")
  const [term, setTerm] = useState("60")
  const [state, setState] = useState(DEFAULT_VEHICLE_TAX_STATE)
  const [salesTaxRate, setSalesTaxRate] = useState(
    () =>
      getVehicleTaxStateByAbbr(DEFAULT_VEHICLE_TAX_STATE)?.salesTaxRate.toString() ??
      "7.25"
  )
  const [fees, setFees] = useState("500")
  const [taxOnTradeInReduction, setTaxOnTradeInReduction] = useState(true)
  const [showSchedule, setShowSchedule] = useState(false)

  const [, setHistory] = useLocalStorage<HistoryItem[]>(
    "auto-loan-calculator-history",
    []
  )

  // Auto-update sales tax when state changes
  const handleStateChange = useCallback((abbr: string) => {
    setState(abbr)
    const info = getVehicleTaxStateByAbbr(abbr)
    if (info) {
      setSalesTaxRate(info.salesTaxRate.toString())
    }
  }, [])

  // Calculate
  const result = useMemo(
    () =>
      calculateAutoLoan(
        Number(vehiclePrice) || 0,
        Number(downPayment) || 0,
        Number(tradeInValue) || 0,
        Number(tradeInOwed) || 0,
        Number(rate) || 0,
        Number(term) || 0,
        Number(salesTaxRate) || 0,
        Number(fees) || 0,
        taxOnTradeInReduction
      ),
    [
      vehiclePrice,
      downPayment,
      tradeInValue,
      tradeInOwed,
      rate,
      term,
      salesTaxRate,
      fees,
      taxOnTradeInReduction,
    ]
  )

  const saveToHistory = useCallback(() => {
    if (!result) return
    const params = new URLSearchParams({
      vp: vehiclePrice,
      dp: downPayment,
      tv: tradeInValue,
      to: tradeInOwed,
      r: rate,
      t: term,
      s: state,
      str: salesTaxRate,
      f: fees,
      ttr: taxOnTradeInReduction ? "1" : "0",
    })
    const url = `${window.location.origin}/tools/auto-loan-calculator?${params}`
    setHistory((prev) => [
      {
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        inputs: { vehiclePrice, downPayment, rate, term, state },
        result: {
          monthlyPayment: result.monthlyPayment,
          totalInterest: result.totalInterest,
          totalCost: result.totalCost,
        },
        shareableUrl: url,
      },
      ...prev.slice(0, 9),
    ])
  }, [
    result,
    vehiclePrice,
    downPayment,
    tradeInValue,
    tradeInOwed,
    rate,
    term,
    state,
    salesTaxRate,
    fees,
    taxOnTradeInReduction,
    setHistory,
  ])

  function getShareUrl() {
    const params = new URLSearchParams({
      vp: vehiclePrice,
      dp: downPayment,
      tv: tradeInValue,
      to: tradeInOwed,
      r: rate,
      t: term,
      s: state,
      str: salesTaxRate,
      f: fees,
      ttr: taxOnTradeInReduction ? "1" : "0",
    })
    return `${typeof window !== "undefined" ? window.location.origin : ""}/tools/auto-loan-calculator?${params}`
  }

  const summary = result
    ? `Monthly Payment: ${fmtFull(result.monthlyPayment)}\nAmount Financed: ${fmtFull(result.amountFinanced)}\nSales Tax: ${fmtFull(result.salesTaxAmount)}\nTotal Interest: ${fmtFull(result.totalInterest)}\nTotal Cost: ${fmtFull(result.totalCost)}\nPayoff: ${result.payoffMonth} months`
    : ""

  const tradeInValueNum = Number(tradeInValue) || 0
  const tradeInOwedNum = Number(tradeInOwed) || 0
  const hasTrade = tradeInValueNum > 0 || tradeInOwedNum > 0
  const underwater = tradeInOwedNum > tradeInValueNum && hasTrade

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <div className="space-y-4">
        {/* Vehicle & Financing */}
        <div className="rounded-xl border bg-muted/30 p-4">
          <h3 className="mb-3 text-sm font-semibold text-muted-foreground">
            Vehicle & Financing
          </h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-1.5">
              <Label htmlFor="vehicle-price">Vehicle Price ($)</Label>
              <Input
                id="vehicle-price"
                type="number"
                min="0"
                step="500"
                value={vehiclePrice}
                onChange={(e) => setVehiclePrice(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="down-payment">Down Payment ($)</Label>
              <Input
                id="down-payment"
                type="number"
                min="0"
                step="500"
                value={downPayment}
                onChange={(e) => setDownPayment(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="rate">APR / Interest Rate (%)</Label>
              <Input
                id="rate"
                type="number"
                min="0"
                step="0.125"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Loan Term (Months)</Label>
              <Select value={term} onValueChange={setTerm}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LOAN_TERMS.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t} months ({Number(t) / 12} years)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>State (Sales Tax)</Label>
              <Select value={state} onValueChange={handleStateChange}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {VEHICLE_TAX_STATES.map((s) => (
                    <SelectItem key={s.abbr} value={s.abbr}>
                      {s.name} ({s.salesTaxRate.toFixed(2)}%)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="sales-tax-rate">Sales Tax Rate (%)</Label>
              <Input
                id="sales-tax-rate"
                type="number"
                min="0"
                step="0.01"
                value={salesTaxRate}
                onChange={(e) => setSalesTaxRate(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="fees">Title / Registration Fees ($)</Label>
              <Input
                id="fees"
                type="number"
                min="0"
                step="50"
                value={fees}
                onChange={(e) => setFees(e.target.value)}
              />
            </div>
            <div className="flex items-end pb-1 sm:col-span-2">
              <label className="flex cursor-pointer items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={taxOnTradeInReduction}
                  onChange={(e) => setTaxOnTradeInReduction(e.target.checked)}
                  className="rounded"
                />
                <span>
                  Sales tax applies to price minus trade-in value{" "}
                  <span className="text-muted-foreground">
                    (standard in most states)
                  </span>
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Trade-in */}
        <div className="rounded-xl border bg-primary/5 p-4">
          <h3 className="mb-3 text-sm font-semibold text-primary">
            Trade-In (Optional)
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="trade-in-value">Trade-In Value ($)</Label>
              <Input
                id="trade-in-value"
                type="number"
                min="0"
                step="500"
                value={tradeInValue}
                onChange={(e) => setTradeInValue(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                What the dealer is giving you for your old car
              </p>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="trade-in-owed">Amount Owed on Trade-In ($)</Label>
              <Input
                id="trade-in-owed"
                type="number"
                min="0"
                step="500"
                value={tradeInOwed}
                onChange={(e) => setTradeInOwed(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Balance on your current auto loan
              </p>
            </div>
          </div>
          {hasTrade && result && (
            <p
              className={`mt-3 text-xs ${
                underwater ? "text-red-500" : "text-green-600 dark:text-green-400"
              }`}
            >
              {underwater ? (
                <>
                  <strong>
                    Negative equity: {fmt(Math.abs(result.tradeInEquity))}
                  </strong>{" "}
                  will be rolled into your new loan.
                </>
              ) : (
                <>
                  <strong>Trade-in equity: {fmt(result.tradeInEquity)}</strong>{" "}
                  will reduce the amount you need to finance.
                </>
              )}
            </p>
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap items-center gap-3">
        <Button onClick={saveToHistory}>Save to History</Button>
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
                Amount Financed
              </div>
              <div className="mt-1 text-xl font-semibold">
                {fmt(result.amountFinanced)}
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
                Total Cost
              </div>
              <div className="mt-1 text-xl font-semibold">
                {fmt(result.totalCost)}
              </div>
            </div>
          </div>

          {/* Cost Breakdown */}
          <div className="rounded-xl border p-4">
            <h3 className="mb-3 font-semibold">Loan Cost Breakdown</h3>
            <div className="space-y-3 text-sm">
              <Row label="Vehicle Price" value={fmt(Number(vehiclePrice))} />
              <Row
                label={`Sales Tax (${Number(salesTaxRate).toFixed(2)}%)`}
                value={fmt(result.salesTaxAmount)}
              />
              <Row label="Title / Registration Fees" value={fmt(Number(fees))} />
              <Row
                label="Down Payment"
                value={`- ${fmt(Number(downPayment))}`}
              />
              {hasTrade && (
                <Row
                  label={
                    underwater
                      ? "Negative Equity (added)"
                      : "Trade-In Equity (subtracted)"
                  }
                  value={`${underwater ? "+" : "-"} ${fmt(
                    Math.abs(result.tradeInEquity)
                  )}`}
                />
              )}
              <div className="border-t pt-3">
                <Row
                  label="Amount Financed"
                  value={fmt(result.amountFinanced)}
                  bold
                />
              </div>
              <Row
                label={`Interest over ${term} months`}
                value={fmt(result.totalInterest)}
              />
              <div className="border-t pt-3">
                <Row
                  label="Total Cost of Ownership"
                  value={fmt(result.totalCost)}
                  bold
                />
              </div>
            </div>
          </div>

          {/* Smart Insights Panel */}
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
            <h3 className="mb-3 font-semibold text-primary">Smart Insights</h3>
            <ul className="space-y-2 text-sm">
              <li>
                On a{" "}
                <strong>
                  {fmt(Number(vehiclePrice))} vehicle financed over {term}{" "}
                  months
                </strong>{" "}
                at {Number(rate).toFixed(3)}% APR, your monthly payment is{" "}
                <strong>{fmtFull(result.monthlyPayment)}</strong>.
              </li>
              {Number(term) >= 72 && (
                <li>
                  <strong className="text-amber-600 dark:text-amber-500">
                    Long loan warning:
                  </strong>{" "}
                  A {term}-month loan lowers your monthly payment but adds
                  significant interest. On your numbers you&apos;ll pay{" "}
                  <strong>{fmt(result.totalInterest)}</strong> in interest
                  alone.
                </li>
              )}
              {Number(downPayment) / Number(vehiclePrice) < 0.1 &&
                Number(vehiclePrice) > 0 && (
                  <li>
                    Your down payment is{" "}
                    <strong>
                      {(
                        (Number(downPayment) / Number(vehiclePrice)) *
                        100
                      ).toFixed(1)}
                      %
                    </strong>
                    . Most lenders and consumer advocates recommend at least
                    20% down on a new car or 10% on a used car to avoid going
                    underwater.
                  </li>
                )}
              {result.upsideDownMonths > 0 && (
                <li>
                  <strong className="text-red-600 dark:text-red-500">
                    Upside-down alert:
                  </strong>{" "}
                  Based on a typical depreciation curve, you&apos;ll owe more
                  than the car is worth for roughly{" "}
                  <strong>
                    {result.upsideDownMonths} months (
                    {(result.upsideDownMonths / 12).toFixed(1)} years)
                  </strong>
                  {result.crossoverMonth
                    ? `, crossing into positive equity around month ${result.crossoverMonth}.`
                    : ", and will still be underwater when the loan matures."}
                </li>
              )}
              {result.upsideDownMonths === 0 && (
                <li>
                  <strong className="text-green-600 dark:text-green-400">
                    Good news:
                  </strong>{" "}
                  Based on typical depreciation, your loan balance stays below
                  the vehicle&apos;s estimated value throughout the loan.
                </li>
              )}
              {underwater && (
                <li>
                  You&apos;re rolling{" "}
                  <strong>{fmt(Math.abs(result.tradeInEquity))}</strong> of
                  negative equity from your trade-in into the new loan. You
                  will start the new loan significantly underwater. Consider
                  paying off the old loan first if possible.
                </li>
              )}
              <li>
                Average monthly cost per $1,000 financed:{" "}
                <strong>
                  {fmtFull(
                    result.amountFinanced > 0
                      ? (result.monthlyPayment / result.amountFinanced) * 1000
                      : 0
                  )}
                </strong>
                . Use this to quickly compare loan offers.
              </li>
            </ul>
          </div>

          {/* Charts */}
          <Tabs defaultValue="breakdown">
            <TabsList>
              <TabsTrigger value="breakdown">Cost Breakdown</TabsTrigger>
              <TabsTrigger value="upside">Upside-Down Timeline</TabsTrigger>
              <TabsTrigger value="yearly">Principal vs Interest</TabsTrigger>
            </TabsList>
            <TabsContent value="breakdown" className="pt-4">
              <p className="mb-3 text-sm text-muted-foreground">
                How your total out-of-pocket cost splits between vehicle price,
                sales tax, fees, and interest.
              </p>
              <AutoLoanCharts
                type="breakdown"
                vehiclePrice={Number(vehiclePrice) || 0}
                salesTax={result.salesTaxAmount}
                fees={Number(fees) || 0}
                totalInterest={result.totalInterest}
              />
            </TabsContent>
            <TabsContent value="upside" className="pt-4">
              <p className="mb-3 text-sm text-muted-foreground">
                Loan balance vs. estimated vehicle value over time. When the red
                line is above the blue line, you owe more than the car is
                worth.
              </p>
              <AutoLoanCharts
                type="upside-down"
                data={result.valueVsBalance}
                crossoverMonth={result.crossoverMonth}
              />
            </TabsContent>
            <TabsContent value="yearly" className="pt-4">
              <p className="mb-3 text-sm text-muted-foreground">
                How each year&apos;s payments split between principal and
                interest. Early years are interest-heavy.
              </p>
              <AutoLoanCharts
                type="principal-interest"
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
            resultText={`My car payment: ${fmtFull(result.monthlyPayment)}/month on a ${fmt(Number(vehiclePrice))} vehicle over ${term} months.`}
            toolName="Auto Loan Calculator"
            hashtags={["AutoLoanCalculator", "CarLoan"]}
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

      <CalculationHistory
        toolSlug="auto-loan-calculator"
        formatResult={(r) => {
          const res = r as { monthlyPayment: number; totalInterest: number }
          return `${fmtFull(res.monthlyPayment)}/mo · ${fmt(res.totalInterest)} interest`
        }}
        formatInputs={(inputs) =>
          `${fmt(Number(inputs.vehiclePrice))} @ ${inputs.rate}% / ${inputs.term}mo`
        }
      />
    </div>
  )
}

function Row({
  label,
  value,
  bold,
}: {
  label: string
  value: string
  bold?: boolean
}) {
  return (
    <div className="flex items-center justify-between">
      <span className={bold ? "font-semibold" : "text-muted-foreground"}>
        {label}
      </span>
      <span className={bold ? "text-base font-semibold" : "font-medium"}>
        {value}
      </span>
    </div>
  )
}
