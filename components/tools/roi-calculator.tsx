"use client"

import { useMemo, useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { HugeiconsIcon } from "@hugeicons/react"
import { Add01Icon, Delete02Icon } from "@hugeicons/core-free-icons"

type Mode = "marketing" | "real-estate" | "project"

// --- Formatting ---
const fmt = (n: number) =>
  n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })

const fmtFull = (n: number) =>
  n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

const fmtPct = (n: number) =>
  `${n >= 0 ? "" : "-"}${Math.abs(n).toFixed(2)}%`

const fmtNum = (n: number, digits = 2) =>
  n.toLocaleString("en-US", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })

// --- Number input helper ---
function NumberInput({
  value,
  onChange,
  placeholder,
  id,
  step = "0.01",
  min = 0,
}: {
  value: number
  onChange: (n: number) => void
  placeholder?: string
  id?: string
  step?: string
  min?: number
}) {
  const [draft, setDraft] = useState<string | null>(null)
  return (
    <Input
      id={id}
      type="number"
      inputMode="decimal"
      step={step}
      min={min}
      placeholder={placeholder}
      value={draft ?? (Number.isFinite(value) ? String(value) : "")}
      onChange={(e) => {
        setDraft(e.target.value)
        const n = Number(e.target.value)
        onChange(Number.isFinite(n) ? n : 0)
      }}
      onBlur={() => setDraft(null)}
    />
  )
}

// --- Marketing math ---
function calcMarketing(
  adSpend: number,
  revenue: number,
  conversions: number,
  cogs: number
) {
  const roasValue = adSpend > 0 ? revenue / adSpend : 0
  const profit = revenue - adSpend - cogs
  const roiPct = adSpend + cogs > 0 ? (profit / (adSpend + cogs)) * 100 : 0
  const cpa = conversions > 0 ? adSpend / conversions : 0
  const revPerConv = conversions > 0 ? revenue / conversions : 0
  const grossMargin = revenue > 0 ? ((revenue - cogs) / revenue) * 100 : 0
  return { roasValue, profit, roiPct, cpa, revPerConv, grossMargin }
}

// --- Real Estate math ---
// Standard monthly mortgage payment for a fixed-rate loan
function monthlyMortgage(principal: number, annualRate: number, years: number) {
  if (principal <= 0 || years <= 0) return 0
  const n = years * 12
  const r = annualRate / 100 / 12
  if (r === 0) return principal / n
  return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
}

interface RealEstateInputs {
  purchasePrice: number
  downPaymentPct: number
  closingCosts: number
  mortgageRate: number
  loanTermYears: number
  monthlyRent: number
  annualExpenses: number
  vacancyPct: number
  appreciationPct: number
  holdingYears: number
}

function calcRealEstate(i: RealEstateInputs) {
  const downPayment = i.purchasePrice * (i.downPaymentPct / 100)
  const loanAmount = Math.max(0, i.purchasePrice - downPayment)
  const totalCashInvested = downPayment + i.closingCosts

  const monthlyPI = monthlyMortgage(
    loanAmount,
    i.mortgageRate,
    i.loanTermYears
  )
  const annualMortgage = monthlyPI * 12

  const grossRent = i.monthlyRent * 12
  const vacancy = grossRent * (i.vacancyPct / 100)
  const effectiveRent = grossRent - vacancy
  const noi = effectiveRent - i.annualExpenses
  const capRate = i.purchasePrice > 0 ? (noi / i.purchasePrice) * 100 : 0

  const annualCashFlow = noi - annualMortgage
  const monthlyCashFlow = annualCashFlow / 12
  const cashOnCash =
    totalCashInvested > 0 ? (annualCashFlow / totalCashInvested) * 100 : 0

  const futureValue =
    i.purchasePrice * Math.pow(1 + i.appreciationPct / 100, i.holdingYears)
  const appreciationGain = futureValue - i.purchasePrice

  // Rough loan balance at sale using the standard amortization formula
  const r = i.mortgageRate / 100 / 12
  const n = i.loanTermYears * 12
  const paidMonths = Math.min(n, i.holdingYears * 12)
  let loanBalanceAtSale = 0
  if (loanAmount > 0) {
    if (r === 0) {
      loanBalanceAtSale = Math.max(0, loanAmount - (loanAmount / n) * paidMonths)
    } else {
      loanBalanceAtSale =
        loanAmount *
        ((Math.pow(1 + r, n) - Math.pow(1 + r, paidMonths)) /
          (Math.pow(1 + r, n) - 1))
    }
  }
  const principalPaydown = loanAmount - loanBalanceAtSale

  const cumulativeCashFlow = annualCashFlow * i.holdingYears
  const totalProfit =
    appreciationGain + cumulativeCashFlow + principalPaydown - i.closingCosts
  const totalRoi =
    totalCashInvested > 0 ? (totalProfit / totalCashInvested) * 100 : 0
  const annualizedRoi =
    i.holdingYears > 0 && totalCashInvested > 0 && totalProfit > -totalCashInvested
      ? (Math.pow(1 + totalProfit / totalCashInvested, 1 / i.holdingYears) - 1) *
        100
      : 0

  return {
    downPayment,
    loanAmount,
    totalCashInvested,
    monthlyPI,
    grossRent,
    vacancy,
    effectiveRent,
    noi,
    capRate,
    annualCashFlow,
    monthlyCashFlow,
    cashOnCash,
    futureValue,
    appreciationGain,
    principalPaydown,
    cumulativeCashFlow,
    totalProfit,
    totalRoi,
    annualizedRoi,
  }
}

// --- Project math: NPV, IRR, payback period ---
function npv(rate: number, cashFlows: number[]): number {
  return cashFlows.reduce(
    (sum, cf, i) => sum + cf / Math.pow(1 + rate, i),
    0
  )
}

// Bisection solver for IRR. cashFlows[0] is typically the negative initial
// investment and cashFlows[1..n] are positive annual inflows. Returns null
// if no sign change exists (no real IRR) or the numbers are degenerate.
function irr(cashFlows: number[]): number | null {
  if (cashFlows.length < 2) return null
  const hasNeg = cashFlows.some((cf) => cf < 0)
  const hasPos = cashFlows.some((cf) => cf > 0)
  if (!hasNeg || !hasPos) return null

  let lo = -0.99
  let hi = 10
  let loVal = npv(lo, cashFlows)
  let hiVal = npv(hi, cashFlows)
  // Expand hi until we bracket a root, up to 100,000%
  for (let i = 0; i < 30 && loVal * hiVal > 0; i++) {
    hi *= 2
    hiVal = npv(hi, cashFlows)
    if (hi > 1000) break
  }
  if (loVal * hiVal > 0) return null

  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2
    const midVal = npv(mid, cashFlows)
    if (Math.abs(midVal) < 0.01) return mid
    if (loVal * midVal < 0) {
      hi = mid
      hiVal = midVal
    } else {
      lo = mid
      loVal = midVal
    }
  }
  return (lo + hi) / 2
}

// Payback period interpolated across years
function paybackPeriod(initial: number, cashFlows: number[]): number | null {
  let running = -Math.abs(initial)
  for (let i = 0; i < cashFlows.length; i++) {
    const before = running
    running += cashFlows[i]
    if (running >= 0) {
      // interpolate into this year
      return i + (0 - before) / cashFlows[i]
    }
  }
  return null
}

// ---------------- MAIN COMPONENT ----------------
export default function RoiCalculator() {
  const [mode, setMode] = useState<Mode>("marketing")

  return (
    <div className="space-y-6">
      <Tabs value={mode} onValueChange={(v) => setMode(v as Mode)}>
        <TabsList className="grid w-full grid-cols-3 sm:w-[560px]">
          <TabsTrigger value="marketing">Marketing</TabsTrigger>
          <TabsTrigger value="real-estate">Real Estate</TabsTrigger>
          <TabsTrigger value="project">Business Project</TabsTrigger>
        </TabsList>
      </Tabs>

      {mode === "marketing" && <MarketingMode />}
      {mode === "real-estate" && <RealEstateMode />}
      {mode === "project" && <ProjectMode />}

      <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 text-xs text-muted-foreground">
        <strong className="text-foreground">Estimates only.</strong> This
        calculator uses simplified models and does not account for taxes,
        inflation, regulatory risks, vacancy growth, expense escalation, or
        any other real-world variable that affects actual returns. Results
        are{" "}
        <strong className="text-foreground">
          not investment or business advice
        </strong>
        . Consult a qualified professional before making decisions based on
        these numbers.
      </div>
    </div>
  )
}

// ---------------- MARKETING MODE ----------------
function MarketingMode() {
  const [adSpend, setAdSpend] = useState(5000)
  const [revenue, setRevenue] = useState(22500)
  const [conversions, setConversions] = useState(180)
  const [cogs, setCogs] = useState(0)

  const m = useMemo(
    () => calcMarketing(adSpend, revenue, conversions, cogs),
    [adSpend, revenue, conversions, cogs]
  )

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Marketing Campaign Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="spend">Ad Spend</Label>
              <NumberInput
                id="spend"
                value={adSpend}
                onChange={setAdSpend}
                step="100"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="revenue">Revenue Generated</Label>
              <NumberInput
                id="revenue"
                value={revenue}
                onChange={setRevenue}
                step="100"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="conversions">Conversions (optional)</Label>
              <NumberInput
                id="conversions"
                value={conversions}
                onChange={setConversions}
                step="1"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cogs">Cost of Goods Sold (optional)</Label>
              <NumberInput
                id="cogs"
                value={cogs}
                onChange={setCogs}
                step="100"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          label="ROAS"
          value={`${fmtNum(m.roasValue, 2)}x`}
          sub={
            m.roasValue >= 4
              ? "Strong (4x or better)"
              : m.roasValue >= 2
                ? "Profitable (2x to 4x)"
                : m.roasValue >= 1
                  ? "Break-even area"
                  : "Losing money"
          }
          accent
          tone={
            m.roasValue >= 2
              ? "positive"
              : m.roasValue >= 1
                ? "neutral"
                : "negative"
          }
        />
        <SummaryCard
          label="ROI %"
          value={fmtPct(m.roiPct)}
          sub="Return on marketing spend"
          tone={m.roiPct >= 0 ? "positive" : "negative"}
        />
        <SummaryCard
          label="Net Profit"
          value={fmt(m.profit)}
          sub="Revenue minus spend minus COGS"
          tone={m.profit >= 0 ? "positive" : "negative"}
        />
        <SummaryCard
          label={conversions > 0 ? "Cost per Acquisition" : "Gross Margin"}
          value={
            conversions > 0 ? fmtFull(m.cpa) : fmtPct(m.grossMargin)
          }
          sub={
            conversions > 0
              ? `${fmtFull(m.revPerConv)} revenue per conversion`
              : "Revenue minus COGS, as % of revenue"
          }
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Campaign Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <Row label="Ad spend" value={fmt(adSpend)} />
          {cogs > 0 && <Row label="Cost of goods sold" value={fmt(cogs)} />}
          <Row label="Revenue generated" value={fmt(revenue)} />
          <div className="my-2 border-t" />
          <Row label="Net profit" value={fmt(m.profit)} bold />
          <Row label="ROAS" value={`${fmtNum(m.roasValue, 2)}x`} />
          <Row label="ROI" value={fmtPct(m.roiPct)} />
          {conversions > 0 && (
            <>
              <div className="my-2 border-t" />
              <Row label="Conversions" value={conversions.toString()} />
              <Row label="Cost per conversion" value={fmtFull(m.cpa)} />
              <Row
                label="Revenue per conversion"
                value={fmtFull(m.revPerConv)}
              />
            </>
          )}
        </CardContent>
      </Card>
    </>
  )
}

// ---------------- REAL ESTATE MODE ----------------
function RealEstateMode() {
  const [purchasePrice, setPurchasePrice] = useState(400000)
  const [downPaymentPct, setDownPaymentPct] = useState(20)
  const [closingCosts, setClosingCosts] = useState(8000)
  const [mortgageRate, setMortgageRate] = useState(6.5)
  const [loanTermYears, setLoanTermYears] = useState(30)
  const [monthlyRent, setMonthlyRent] = useState(3200)
  const [annualExpenses, setAnnualExpenses] = useState(9600)
  const [vacancyPct, setVacancyPct] = useState(5)
  const [appreciationPct, setAppreciationPct] = useState(3)
  const [holdingYears, setHoldingYears] = useState(10)

  const r = useMemo(
    () =>
      calcRealEstate({
        purchasePrice,
        downPaymentPct,
        closingCosts,
        mortgageRate,
        loanTermYears,
        monthlyRent,
        annualExpenses,
        vacancyPct,
        appreciationPct,
        holdingYears,
      }),
    [
      purchasePrice,
      downPaymentPct,
      closingCosts,
      mortgageRate,
      loanTermYears,
      monthlyRent,
      annualExpenses,
      vacancyPct,
      appreciationPct,
      holdingYears,
    ]
  )

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Property &amp; Financing</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="price">Purchase Price</Label>
              <NumberInput
                id="price"
                value={purchasePrice}
                onChange={setPurchasePrice}
                step="1000"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="down">Down Payment %</Label>
              <NumberInput
                id="down"
                value={downPaymentPct}
                onChange={setDownPaymentPct}
                step="1"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="closing">Closing Costs</Label>
              <NumberInput
                id="closing"
                value={closingCosts}
                onChange={setClosingCosts}
                step="500"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="rate">Mortgage Rate %</Label>
              <NumberInput
                id="rate"
                value={mortgageRate}
                onChange={setMortgageRate}
                step="0.1"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="term">Loan Term (years)</Label>
              <NumberInput
                id="term"
                value={loanTermYears}
                onChange={setLoanTermYears}
                step="1"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="rent">Monthly Rent</Label>
              <NumberInput
                id="rent"
                value={monthlyRent}
                onChange={setMonthlyRent}
                step="50"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="expenses">
                Annual Operating Expenses
                <span className="ml-1 text-xs text-muted-foreground">
                  (taxes, insurance, maintenance, HOA)
                </span>
              </Label>
              <NumberInput
                id="expenses"
                value={annualExpenses}
                onChange={setAnnualExpenses}
                step="100"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="vacancy">Vacancy Rate %</Label>
              <NumberInput
                id="vacancy"
                value={vacancyPct}
                onChange={setVacancyPct}
                step="1"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="appreciation">Annual Appreciation %</Label>
              <NumberInput
                id="appreciation"
                value={appreciationPct}
                onChange={setAppreciationPct}
                step="0.1"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="holding">Holding Period (Years)</Label>
              <NumberInput
                id="holding"
                value={holdingYears}
                onChange={setHoldingYears}
                step="1"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          label="Cap Rate"
          value={fmtPct(r.capRate)}
          sub="Unleveraged yield (NOI / price)"
          accent
          tone={
            r.capRate >= 6
              ? "positive"
              : r.capRate >= 4
                ? "neutral"
                : "negative"
          }
        />
        <SummaryCard
          label="Cash-on-Cash Return"
          value={fmtPct(r.cashOnCash)}
          sub="Annual cash flow / cash invested"
          tone={
            r.cashOnCash >= 8
              ? "positive"
              : r.cashOnCash >= 0
                ? "neutral"
                : "negative"
          }
        />
        <SummaryCard
          label="Monthly Cash Flow"
          value={fmt(r.monthlyCashFlow)}
          sub={`${fmt(r.annualCashFlow)} per year`}
          tone={r.monthlyCashFlow >= 0 ? "positive" : "negative"}
        />
        <SummaryCard
          label="Total ROI"
          value={fmtPct(r.totalRoi)}
          sub={`${fmtPct(r.annualizedRoi)} annualized`}
          tone={r.totalRoi >= 0 ? "positive" : "negative"}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Cash Flow &amp; NOI</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <Row label="Gross annual rent" value={fmt(r.grossRent)} />
            <Row
              label={`Vacancy (${vacancyPct}%)`}
              value={`-${fmt(r.vacancy)}`}
              muted
            />
            <Row label="Effective rental income" value={fmt(r.effectiveRent)} />
            <Row
              label="Operating expenses"
              value={`-${fmt(annualExpenses)}`}
              muted
            />
            <Row label="Net Operating Income (NOI)" value={fmt(r.noi)} bold />
            <div className="my-2 border-t" />
            <Row
              label="Monthly P&amp;I payment"
              value={fmtFull(r.monthlyPI)}
            />
            <Row
              label="Annual mortgage payment"
              value={`-${fmt(r.monthlyPI * 12)}`}
              muted
            />
            <Row
              label="Annual cash flow"
              value={fmt(r.annualCashFlow)}
              bold
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Return Over {holdingYears} Years</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <Row label="Down payment" value={fmt(r.downPayment)} />
            <Row label="Closing costs" value={fmt(closingCosts)} />
            <Row
              label="Total cash invested"
              value={fmt(r.totalCashInvested)}
              bold
            />
            <div className="my-2 border-t" />
            <Row
              label="Appreciation gain"
              value={fmt(r.appreciationGain)}
            />
            <Row
              label="Principal paydown"
              value={fmt(r.principalPaydown)}
            />
            <Row
              label="Cumulative cash flow"
              value={fmt(r.cumulativeCashFlow)}
            />
            <Row
              label="Total profit"
              value={fmt(r.totalProfit)}
              bold
            />
            <div className="my-2 border-t" />
            <Row label="Future property value" value={fmt(r.futureValue)} />
            <Row label="Total ROI" value={fmtPct(r.totalRoi)} bold />
            <Row
              label="Annualized ROI"
              value={fmtPct(r.annualizedRoi)}
              muted
            />
          </CardContent>
        </Card>
      </div>
    </>
  )
}

// ---------------- PROJECT MODE ----------------
function ProjectMode() {
  const [initial, setInitial] = useState(50000)
  const [discountRate, setDiscountRate] = useState(8)
  const [cashFlows, setCashFlows] = useState<number[]>([
    15000, 18000, 20000, 22000, 22000,
  ])

  const updateFlow = (i: number, val: number) => {
    setCashFlows((prev) => prev.map((v, idx) => (idx === i ? val : v)))
  }

  const addYear = () => {
    if (cashFlows.length >= 15) return
    setCashFlows((prev) => [...prev, prev[prev.length - 1] ?? 0])
  }

  const removeYear = () => {
    if (cashFlows.length <= 1) return
    setCashFlows((prev) => prev.slice(0, -1))
  }

  const metrics = useMemo(() => {
    // cashFlows[0] is year 1 (not year 0 which is -initial)
    const fullFlows = [-initial, ...cashFlows]
    const totalInflow = cashFlows.reduce((s, v) => s + v, 0)
    const totalProfit = totalInflow - initial
    const totalRoi = initial > 0 ? (totalProfit / initial) * 100 : 0
    const years = cashFlows.length
    const annualizedRoi =
      years > 0 && initial > 0 && totalInflow > 0
        ? (Math.pow(totalInflow / initial, 1 / years) - 1) * 100
        : 0
    const npvValue = npv(discountRate / 100, fullFlows)
    const irrValue = irr(fullFlows)
    const payback = paybackPeriod(initial, cashFlows)

    // Build the display schedule with running cumulative totals. Using a
    // prefix-sum over the input array keeps the computation pure (no `let`
    // mutation) so it passes react-hooks/immutability. n is tiny (max 15).
    const schedule = cashFlows.map((cf, i) => {
      const cumulative =
        -initial + cashFlows.slice(0, i + 1).reduce((a, b) => a + b, 0)
      return {
        year: i + 1,
        cashFlow: cf,
        cumulative,
        discounted: cf / Math.pow(1 + discountRate / 100, i + 1),
      }
    })

    return {
      totalInflow,
      totalProfit,
      totalRoi,
      annualizedRoi,
      npvValue,
      irrValue,
      payback,
      schedule,
    }
  }, [initial, cashFlows, discountRate])

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Project Investment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="initial">Initial Investment</Label>
              <NumberInput
                id="initial"
                value={initial}
                onChange={setInitial}
                step="1000"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="discount">
                Discount Rate % (for NPV)
              </Label>
              <NumberInput
                id="discount"
                value={discountRate}
                onChange={setDiscountRate}
                step="0.5"
              />
            </div>
          </div>

          <div>
            <div className="mb-3 flex items-center justify-between">
              <Label>Annual Cash Flows</Label>
              <div className="flex gap-1.5">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={removeYear}
                  disabled={cashFlows.length <= 1}
                >
                  <HugeiconsIcon icon={Delete02Icon} size={14} />
                  Remove Year
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addYear}
                  disabled={cashFlows.length >= 15}
                >
                  <HugeiconsIcon icon={Add01Icon} size={14} />
                  Add Year
                </Button>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {cashFlows.map((cf, i) => (
                <div key={i} className="space-y-1">
                  <Label className="text-xs">Year {i + 1}</Label>
                  <NumberInput
                    value={cf}
                    onChange={(n) => updateFlow(i, n)}
                    step="500"
                  />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          label="NPV"
          value={fmt(metrics.npvValue)}
          sub={`At ${discountRate}% discount rate`}
          accent
          tone={metrics.npvValue >= 0 ? "positive" : "negative"}
        />
        <SummaryCard
          label="IRR"
          value={
            metrics.irrValue !== null
              ? fmtPct(metrics.irrValue * 100)
              : "N/A"
          }
          sub={
            metrics.irrValue !== null
              ? metrics.irrValue * 100 > discountRate
                ? "Beats your discount rate"
                : "Below your discount rate"
              : "No solution found"
          }
          tone={
            metrics.irrValue !== null && metrics.irrValue * 100 > discountRate
              ? "positive"
              : "negative"
          }
        />
        <SummaryCard
          label="Payback Period"
          value={
            metrics.payback !== null
              ? `${fmtNum(metrics.payback, 2)} yrs`
              : "Not reached"
          }
          sub={
            metrics.payback !== null
              ? "When cumulative cash flow equals initial investment"
              : `Not recovered within ${cashFlows.length} years`
          }
        />
        <SummaryCard
          label="Total ROI"
          value={fmtPct(metrics.totalRoi)}
          sub={`${fmtPct(metrics.annualizedRoi)} annualized`}
          tone={metrics.totalRoi >= 0 ? "positive" : "negative"}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Cash Flow Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[480px] text-left text-xs">
              <thead className="border-b bg-muted/40 text-muted-foreground">
                <tr>
                  <th className="px-3 py-2 font-medium">Year</th>
                  <th className="px-3 py-2 text-right font-medium">
                    Cash Flow
                  </th>
                  <th className="px-3 py-2 text-right font-medium">
                    Cumulative
                  </th>
                  <th className="px-3 py-2 text-right font-medium">
                    Discounted
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="px-3 py-2 font-medium">0 (Investment)</td>
                  <td className="whitespace-nowrap px-3 py-2 text-right text-destructive tabular-nums">
                    {fmt(-initial)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-2 text-right tabular-nums">
                    {fmt(-initial)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-2 text-right tabular-nums">
                    {fmt(-initial)}
                  </td>
                </tr>
                {metrics.schedule.map((row) => (
                  <tr key={row.year} className="border-b last:border-0">
                    <td className="px-3 py-2 font-medium">Year {row.year}</td>
                    <td className="whitespace-nowrap px-3 py-2 text-right tabular-nums">
                      {fmt(row.cashFlow)}
                    </td>
                    <td
                      className={`whitespace-nowrap px-3 py-2 text-right tabular-nums ${
                        row.cumulative >= 0
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-destructive"
                      }`}
                    >
                      {fmt(row.cumulative)}
                    </td>
                    <td className="whitespace-nowrap px-3 py-2 text-right tabular-nums text-muted-foreground">
                      {fmt(row.discounted)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </>
  )
}

// --- Shared subcomponents ---
function SummaryCard({
  label,
  value,
  sub,
  tone = "neutral",
  accent,
}: {
  label: string
  value: string
  sub?: string
  tone?: "positive" | "negative" | "neutral"
  accent?: boolean
}) {
  const toneClass =
    tone === "positive"
      ? "text-emerald-600 dark:text-emerald-400"
      : tone === "negative"
        ? "text-destructive"
        : ""
  return (
    <div
      className={`rounded-2xl border p-4 ${
        accent ? "bg-primary/10 ring-1 ring-primary/30" : "bg-card"
      }`}
    >
      <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </div>
      <div
        className={`mt-1 font-heading text-2xl font-semibold tabular-nums ${toneClass}`}
      >
        {value}
      </div>
      {sub && (
        <div className="mt-0.5 text-xs text-muted-foreground">{sub}</div>
      )}
    </div>
  )
}

function Row({
  label,
  value,
  bold,
  muted,
}: {
  label: string
  value: string
  bold?: boolean
  muted?: boolean
}) {
  return (
    <div
      className={`flex items-center justify-between gap-4 ${
        bold ? "font-semibold" : ""
      } ${muted ? "text-muted-foreground" : ""}`}
    >
      <span>{label}</span>
      <span className="whitespace-nowrap tabular-nums">{value}</span>
    </div>
  )
}
