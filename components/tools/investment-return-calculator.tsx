"use client"

import { useMemo, useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { HugeiconsIcon } from "@hugeicons/react"
import { Add01Icon, Delete02Icon } from "@hugeicons/core-free-icons"

type Mode = "single" | "compare"

type InvestmentType =
  | "stocks"
  | "bonds"
  | "real-estate"
  | "crypto"
  | "business"
  | "other"

const INVESTMENT_TYPES: { value: InvestmentType; label: string }[] = [
  { value: "stocks", label: "Stocks / ETFs" },
  { value: "bonds", label: "Bonds" },
  { value: "real-estate", label: "Real Estate" },
  { value: "crypto", label: "Crypto" },
  { value: "business", label: "Business / Private Equity" },
  { value: "other", label: "Other" },
]

// Long-term capital gains brackets (2025, Single filer) used only for the
// educational "estimated capital gains tax" note. Not intended to be a
// substitute for the Income Tax Calculator.
const LONG_TERM_CG_BRACKETS: { upTo: number; rate: number }[] = [
  { upTo: 47025, rate: 0 },
  { upTo: 518900, rate: 0.15 },
  { upTo: Number.POSITIVE_INFINITY, rate: 0.2 },
]

// --- Formatting ---
const fmt = (n: number) =>
  n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })

const fmtPct = (n: number) =>
  `${n >= 0 ? "" : "-"}${Math.abs(n).toFixed(2)}%`

// --- Calculation ---
interface InvestmentInputs {
  initial: number
  finalValue: number
  years: number
  dividends: number
  contributions: number
  inflationRate: number
}

interface InvestmentResult {
  totalGain: number
  totalReturnPct: number
  cagr: number
  realCagr: number
  annualizedGain: number
  isLongTerm: boolean
  classification: "gain" | "loss" | "flat"
  estCapGainsTax: number
  afterTaxGain: number
  benchmarkGain: number // what a 10% S&P 500 portfolio would have done
}

// Average historical S&P 500 total return used as a benchmark comparison
const SP500_HISTORICAL_CAGR = 0.1

function longTermCapGainsRate(gain: number): number {
  // Use a blended estimate across the brackets for a Single filer.
  let remaining = gain
  let prev = 0
  let tax = 0
  for (const b of LONG_TERM_CG_BRACKETS) {
    if (remaining <= 0) break
    const slice = Math.min(remaining, b.upTo - prev)
    if (slice > 0) {
      tax += slice * b.rate
      remaining -= slice
    }
    prev = b.upTo
  }
  return gain > 0 ? tax / gain : 0
}

function calculate({
  initial,
  finalValue,
  years,
  dividends,
  contributions,
  inflationRate,
}: InvestmentInputs): InvestmentResult {
  const cleanInitial = Math.max(0, initial)
  const cleanFinal = Math.max(0, finalValue)
  const cleanYears = Math.max(0, years)
  const cleanDividends = Math.max(0, dividends)
  const cleanContribs = Math.max(0, contributions)

  const totalInvested = cleanInitial + cleanContribs
  const totalReceived = cleanFinal + cleanDividends
  const totalGain = totalReceived - totalInvested

  const totalReturnPct =
    totalInvested > 0 ? (totalGain / totalInvested) * 100 : 0

  // CAGR assumes the gain compounds evenly over the full period. When there
  // are additional contributions we use the simple ratio; this is a rough
  // approximation since contributions did not have the full holding period
  // to grow, so CAGR will slightly overstate performance if contributions
  // were large relative to initial.
  const cagr =
    cleanYears > 0 && cleanInitial > 0 && totalReceived > 0
      ? (Math.pow(totalReceived / totalInvested, 1 / cleanYears) - 1) * 100
      : 0

  // Real (inflation-adjusted) CAGR using the Fisher equation approximation
  const realCagr =
    inflationRate > 0
      ? ((1 + cagr / 100) / (1 + inflationRate / 100) - 1) * 100
      : cagr

  const annualizedGain = cleanYears > 0 ? totalGain / cleanYears : 0
  const isLongTerm = cleanYears >= 1

  let classification: "gain" | "loss" | "flat" = "flat"
  if (totalGain > 0.5) classification = "gain"
  else if (totalGain < -0.5) classification = "loss"

  const capGainsRate = isLongTerm
    ? longTermCapGainsRate(totalGain)
    : 0.22 // rough ordinary income placeholder for short-term gains
  const estCapGainsTax = totalGain > 0 ? totalGain * capGainsRate : 0
  const afterTaxGain = totalGain - estCapGainsTax

  const benchmarkGain =
    cleanInitial * Math.pow(1 + SP500_HISTORICAL_CAGR, cleanYears) -
    cleanInitial

  return {
    totalGain,
    totalReturnPct,
    cagr,
    realCagr,
    annualizedGain,
    isLongTerm,
    classification,
    estCapGainsTax,
    afterTaxGain,
    benchmarkGain,
  }
}

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

// ---------------- MAIN COMPONENT ----------------
interface CompareRow {
  id: string
  name: string
  initial: number
  finalValue: number
  years: number
}

const newCompareRow = (name: string, initial = 10000): CompareRow => ({
  id: Math.random().toString(36).slice(2, 10),
  name,
  initial,
  finalValue: initial * 1.5,
  years: 5,
})

export default function InvestmentReturnCalculator() {
  const [mode, setMode] = useState<Mode>("single")

  // Single mode state
  const [investmentType, setInvestmentType] =
    useState<InvestmentType>("stocks")
  const [initial, setInitial] = useState(10000)
  const [finalValue, setFinalValue] = useState(17500)
  const [years, setYears] = useState(5)
  const [dividends, setDividends] = useState(0)
  const [contributions, setContributions] = useState(0)
  const [useInflation, setUseInflation] = useState(false)
  const [inflationRate, setInflationRate] = useState(3)

  const result = useMemo(
    () =>
      calculate({
        initial,
        finalValue,
        years,
        dividends,
        contributions,
        inflationRate: useInflation ? inflationRate : 0,
      }),
    [
      initial,
      finalValue,
      years,
      dividends,
      contributions,
      useInflation,
      inflationRate,
    ]
  )

  // Compare mode state
  const [compareRows, setCompareRows] = useState<CompareRow[]>([
    newCompareRow("Investment A", 10000),
    newCompareRow("Investment B", 10000),
  ])

  const addRow = () => {
    if (compareRows.length >= 4) return
    setCompareRows((prev) => [
      ...prev,
      newCompareRow(`Investment ${String.fromCharCode(65 + prev.length)}`),
    ])
  }

  const removeRow = (id: string) => {
    if (compareRows.length <= 2) return
    setCompareRows((prev) => prev.filter((r) => r.id !== id))
  }

  const updateRow = (id: string, patch: Partial<CompareRow>) => {
    setCompareRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...patch } : r))
    )
  }

  const compareResults = useMemo(
    () =>
      compareRows.map((row) => ({
        row,
        result: calculate({
          initial: row.initial,
          finalValue: row.finalValue,
          years: row.years,
          dividends: 0,
          contributions: 0,
          inflationRate: 0,
        }),
      })),
    [compareRows]
  )

  // Winner: highest CAGR
  const winnerId = useMemo(() => {
    if (compareResults.length === 0) return null
    return compareResults.reduce((best, cur) =>
      cur.result.cagr > best.result.cagr ? cur : best
    ).row.id
  }, [compareResults])

  return (
    <div className="space-y-6">
      <Tabs value={mode} onValueChange={(v) => setMode(v as Mode)}>
        <TabsList className="grid w-full grid-cols-2 sm:w-[420px]">
          <TabsTrigger value="single">Single Investment</TabsTrigger>
          <TabsTrigger value="compare">Compare (up to 4)</TabsTrigger>
        </TabsList>
      </Tabs>

      {mode === "single" ? (
        <>
          {/* INPUTS */}
          <Card>
            <CardHeader>
              <CardTitle>Investment Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="type">Investment Type</Label>
                  <Select
                    value={investmentType}
                    onValueChange={(v) =>
                      setInvestmentType(v as InvestmentType)
                    }
                  >
                    <SelectTrigger id="type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {INVESTMENT_TYPES.map((t) => (
                        <SelectItem key={t.value} value={t.value}>
                          {t.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="years">Holding Period (Years)</Label>
                  <NumberInput
                    id="years"
                    value={years}
                    onChange={setYears}
                    step="0.25"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="initial">Initial Investment</Label>
                  <NumberInput
                    id="initial"
                    value={initial}
                    onChange={setInitial}
                    step="100"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="final">Final / Current Value</Label>
                  <NumberInput
                    id="final"
                    value={finalValue}
                    onChange={setFinalValue}
                    step="100"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="dividends">
                    Dividends / Income Received (total)
                  </Label>
                  <NumberInput
                    id="dividends"
                    value={dividends}
                    onChange={setDividends}
                    step="50"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="contributions">
                    Additional Contributions (total)
                  </Label>
                  <NumberInput
                    id="contributions"
                    value={contributions}
                    onChange={setContributions}
                    step="100"
                  />
                </div>
              </div>

              {/* Inflation toggle */}
              <div className="flex flex-wrap items-center gap-3 rounded-xl border bg-muted/30 p-4">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={useInflation}
                    onChange={(e) => setUseInflation(e.target.checked)}
                    className="h-4 w-4 accent-primary"
                  />
                  Show real return (inflation-adjusted)
                </label>
                {useInflation && (
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      step="0.1"
                      min={0}
                      value={inflationRate}
                      onChange={(e) =>
                        setInflationRate(Number(e.target.value) || 0)
                      }
                      className="h-8 w-20"
                    />
                    <span className="text-sm text-muted-foreground">
                      % / yr
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* SUMMARY */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <SummaryCard
              label="Total Gain / Loss"
              value={fmt(result.totalGain)}
              sub={
                result.classification === "gain"
                  ? "You made money"
                  : result.classification === "loss"
                    ? "You lost money"
                    : "Break even"
              }
              tone={
                result.classification === "gain"
                  ? "positive"
                  : result.classification === "loss"
                    ? "negative"
                    : "neutral"
              }
              accent
            />
            <SummaryCard
              label="Total Return"
              value={fmtPct(result.totalReturnPct)}
              sub="Over the full holding period"
              tone={
                result.totalReturnPct >= 0 ? "positive" : "negative"
              }
            />
            <SummaryCard
              label="CAGR (Annualized)"
              value={fmtPct(result.cagr)}
              sub={
                useInflation
                  ? `${fmtPct(result.realCagr)} after inflation`
                  : "Compound annual growth rate"
              }
              tone={result.cagr >= 0 ? "positive" : "negative"}
            />
            <SummaryCard
              label="Holding Period"
              value={result.isLongTerm ? "Long-Term" : "Short-Term"}
              sub={
                result.isLongTerm
                  ? "12+ months, lower tax rates"
                  : "Under 12 months, taxed as income"
              }
            />
          </div>

          {/* DETAIL CARDS */}
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Return Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <Row
                  label="Starting value"
                  value={fmt(initial)}
                />
                {contributions > 0 && (
                  <Row
                    label="+ Contributions added"
                    value={fmt(contributions)}
                  />
                )}
                <Row
                  label="Ending value"
                  value={fmt(finalValue)}
                />
                {dividends > 0 && (
                  <Row
                    label="+ Dividends / income"
                    value={fmt(dividends)}
                  />
                )}
                <div className="my-2 border-t" />
                <Row
                  label="Total gain"
                  value={fmt(result.totalGain)}
                  bold
                />
                <Row
                  label="Annualized gain"
                  value={fmt(result.annualizedGain)}
                />
                <Row
                  label="CAGR"
                  value={fmtPct(result.cagr)}
                  bold
                />
                {useInflation && (
                  <Row
                    label="Real CAGR (after inflation)"
                    value={fmtPct(result.realCagr)}
                    muted
                  />
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tax &amp; Benchmark</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p className="text-muted-foreground">
                  {result.isLongTerm
                    ? "Held 12 months or more, so gains qualify for long-term capital gains rates (0%, 15%, or 20% depending on your income)."
                    : "Held less than 12 months, so gains are taxed as ordinary income at your marginal rate (often 22% to 32%)."}
                </p>
                {result.totalGain > 0 && (
                  <>
                    <div className="my-2 border-t" />
                    <Row
                      label="Est. capital gains tax"
                      value={fmt(result.estCapGainsTax)}
                      muted
                    />
                    <Row
                      label="Est. after-tax gain"
                      value={fmt(result.afterTaxGain)}
                      bold
                    />
                  </>
                )}
                <div className="my-2 border-t" />
                <Row
                  label={`S&P 500 (${(
                    SP500_HISTORICAL_CAGR * 100
                  ).toFixed(0)}% historical)`}
                  value={fmt(result.benchmarkGain)}
                  muted
                />
                <p className="pt-1 text-xs text-muted-foreground">
                  What {fmt(initial)} invested in a broad stock index
                  would have grown by over {years} year(s) at the long-term
                  S&amp;P 500 average. Compare to your actual total gain of{" "}
                  {fmt(result.totalGain)}.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* INVESTMENT TYPE NOTE */}
          <Card>
            <CardHeader>
              <CardTitle>
                Notes for{" "}
                {
                  INVESTMENT_TYPES.find((t) => t.value === investmentType)
                    ?.label
                }
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              {investmentType === "stocks" && (
                <p>
                  Stocks and ETFs held in a taxable brokerage account are
                  subject to capital gains tax on sale (long-term rates if
                  held 12+ months). Qualified dividends are typically taxed
                  at long-term rates; ordinary dividends are taxed as
                  income. Holdings inside a Roth IRA, Traditional IRA, or
                  401(k) are tax-sheltered.
                </p>
              )}
              {investmentType === "bonds" && (
                <p>
                  Bond interest is generally taxed as ordinary income, not
                  capital gains, unless the bond is sold at a gain. Treasury
                  bonds are exempt from state tax. Municipal bond interest
                  is typically exempt from federal tax (and state tax if
                  you live in the issuing state).
                </p>
              )}
              {investmentType === "real-estate" && (
                <p>
                  Real estate gains qualify for long-term capital gains
                  rates if held 12+ months. Primary residences get a
                  $250,000 (single) or $500,000 (MFJ) gain exclusion under
                  Section 121 if you lived there for 2 of the last 5 years.
                  Rental properties allow depreciation deductions but trigger
                  depreciation recapture on sale. A 1031 exchange can defer
                  capital gains on investment properties.
                </p>
              )}
              {investmentType === "crypto" && (
                <p>
                  Crypto is treated as property by the IRS. Every sale or
                  trade (even crypto-to-crypto) is a taxable event. Held
                  12+ months qualifies for long-term capital gains rates;
                  under 12 months is ordinary income. Like-kind exchange
                  rules do not apply to crypto. Wash sale rules do not
                  currently apply either, which enables tax-loss harvesting.
                </p>
              )}
              {investmentType === "business" && (
                <p>
                  Business and private equity gains can qualify for long-term
                  capital gains rates after 12 months. QSBS (qualified small
                  business stock) held for 5+ years may exclude up to
                  $10 million of gain under Section 1202. Consult a CPA
                  before any sale or buyout.
                </p>
              )}
              {investmentType === "other" && (
                <p>
                  For collectibles (art, gold, coins, antiques), long-term
                  gains are taxed at a higher 28% rate instead of the
                  standard capital gains rates. For other asset types,
                  consult a tax professional for specific treatment.
                </p>
              )}
            </CardContent>
          </Card>
        </>
      ) : (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Compare Investments</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={addRow}
                disabled={compareRows.length >= 4}
              >
                <HugeiconsIcon icon={Add01Icon} size={14} />
                Add
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {compareResults.map(({ row, result: r }) => (
              <div
                key={row.id}
                className={`space-y-3 rounded-2xl border p-4 ${
                  row.id === winnerId && compareRows.length > 1
                    ? "border-emerald-500/40 bg-emerald-500/5 ring-1 ring-emerald-500/30"
                    : "bg-muted/20"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <Input
                    value={row.name}
                    onChange={(e) =>
                      updateRow(row.id, { name: e.target.value })
                    }
                    className="h-8 max-w-[220px] font-medium"
                  />
                  {row.id === winnerId && compareRows.length > 1 && (
                    <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                      Best CAGR
                    </span>
                  )}
                  {compareRows.length > 2 && (
                    <button
                      type="button"
                      onClick={() => removeRow(row.id)}
                      className="rounded p-1 text-muted-foreground transition hover:text-destructive"
                      aria-label={`Remove ${row.name}`}
                    >
                      <HugeiconsIcon icon={Delete02Icon} size={16} />
                    </button>
                  )}
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Initial</Label>
                    <NumberInput
                      value={row.initial}
                      onChange={(n) => updateRow(row.id, { initial: n })}
                      step="100"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Final Value</Label>
                    <NumberInput
                      value={row.finalValue}
                      onChange={(n) => updateRow(row.id, { finalValue: n })}
                      step="100"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Years</Label>
                    <NumberInput
                      value={row.years}
                      onChange={(n) => updateRow(row.id, { years: n })}
                      step="0.25"
                    />
                  </div>
                </div>
                <div className="grid gap-2 text-xs sm:grid-cols-3">
                  <div className="rounded-lg bg-card px-3 py-2">
                    <div className="text-muted-foreground">Gain</div>
                    <div
                      className={`font-heading text-lg font-semibold tabular-nums ${
                        r.totalGain >= 0
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-destructive"
                      }`}
                    >
                      {fmt(r.totalGain)}
                    </div>
                  </div>
                  <div className="rounded-lg bg-card px-3 py-2">
                    <div className="text-muted-foreground">Total Return</div>
                    <div className="font-heading text-lg font-semibold tabular-nums">
                      {fmtPct(r.totalReturnPct)}
                    </div>
                  </div>
                  <div className="rounded-lg bg-card px-3 py-2">
                    <div className="text-muted-foreground">CAGR</div>
                    <div className="font-heading text-lg font-semibold tabular-nums">
                      {fmtPct(r.cagr)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* DISCLAIMER */}
      <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 text-xs text-muted-foreground">
        <strong className="text-foreground">Estimates only.</strong> This
        calculator computes gross returns and a simplified capital gains tax
        estimate for educational use. It does not account for fees, expense
        ratios, state taxes, the Net Investment Income Tax (NIIT), wash-sale
        rules, or your specific tax situation. Results are{" "}
        <strong className="text-foreground">not tax or investment advice</strong>
        . Consult a CPA or financial advisor before making decisions based on
        these numbers.
      </div>
    </div>
  )
}

// --- Subcomponents ---
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
