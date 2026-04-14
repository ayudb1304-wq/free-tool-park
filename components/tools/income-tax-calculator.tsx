"use client"

import { useMemo, useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  FILING_STATUSES,
  FEDERAL_BRACKETS_2025,
  STANDARD_DEDUCTION_2025,
  SS_RATE,
  SS_WAGE_BASE_2025,
  MEDICARE_RATE,
  ADDL_MEDICARE_RATE,
  ADDL_MEDICARE_THRESHOLDS,
  SE_TAX_RATE_SS,
  SE_TAX_RATE_MEDICARE,
  STATE_INCOME_TAX_RATES,
  DEFAULT_STATE,
  getStateRate,
  type FilingStatus,
  type TaxBracket,
} from "@/data/income-tax-data"

// --- Formatting helpers ---
const fmt = (n: number) =>
  n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })

const fmtPct = (n: number) => `${n.toFixed(2)}%`

// --- Calculation engine ---
interface BracketBreakdown {
  rate: number
  from: number
  to: number // cap used for this bracket
  amountInBracket: number
  tax: number
}

function applyBrackets(taxableIncome: number, brackets: TaxBracket[]) {
  let tax = 0
  let prev = 0
  const breakdown: BracketBreakdown[] = []
  let marginalRate = 0

  for (const b of brackets) {
    const cap = b.upTo ?? Number.POSITIVE_INFINITY
    const amountInBracket = Math.max(
      0,
      Math.min(taxableIncome, cap) - prev
    )
    const bracketTax = amountInBracket * b.rate
    tax += bracketTax
    breakdown.push({
      rate: b.rate,
      from: prev,
      to: cap,
      amountInBracket,
      tax: bracketTax,
    })
    if (taxableIncome > prev) {
      marginalRate = b.rate
    }
    if (taxableIncome <= cap) break
    prev = cap
  }

  return { tax, breakdown, marginalRate }
}

function calcFica(grossWages: number, filingStatus: FilingStatus) {
  const ss = Math.min(grossWages, SS_WAGE_BASE_2025) * SS_RATE
  const medicare = grossWages * MEDICARE_RATE
  const addlThreshold = ADDL_MEDICARE_THRESHOLDS[filingStatus]
  const addlMedicare =
    Math.max(0, grossWages - addlThreshold) * ADDL_MEDICARE_RATE
  return { ss, medicare, addlMedicare, total: ss + medicare + addlMedicare }
}

// Self-employment tax. 92.35% of SE earnings is the taxable base.
// SS portion is capped at the annual wage base; Medicare portion has no cap.
// Half of total SE tax is deductible from AGI.
function calcSeTax(seIncome: number) {
  if (seIncome <= 0) {
    return { ssPortion: 0, medicarePortion: 0, total: 0, deductible: 0 }
  }
  const base = seIncome * 0.9235
  const ssPortion = Math.min(base, SS_WAGE_BASE_2025) * SE_TAX_RATE_SS
  const medicarePortion = base * SE_TAX_RATE_MEDICARE
  const total = ssPortion + medicarePortion
  return { ssPortion, medicarePortion, total, deductible: total / 2 }
}

interface TaxInputs {
  income: number
  filingStatus: FilingStatus
  stateAbbr: string
  pretaxDeductions: number
  itemizedDeductions: number
  credits: number
  isSelfEmployed: boolean
}

interface TaxResult {
  gross: number
  agi: number
  taxableIncome: number
  deductionUsed: number
  deductionType: "standard" | "itemized"
  federalTax: number
  federalAfterCredits: number
  stateTax: number
  stateRate: number
  fica: ReturnType<typeof calcFica>
  seTax: ReturnType<typeof calcSeTax>
  totalTax: number
  takeHome: number
  monthly: number
  biweekly: number
  weekly: number
  effectiveRate: number
  marginalRate: number
  bracketBreakdown: BracketBreakdown[]
}

function calculateTaxes(input: TaxInputs): TaxResult {
  const {
    income,
    filingStatus,
    stateAbbr,
    pretaxDeductions,
    itemizedDeductions,
    credits,
    isSelfEmployed,
  } = input

  const gross = Math.max(0, income)
  const pretax = Math.max(0, pretaxDeductions)
  const itemized = Math.max(0, itemizedDeductions)
  const creditsCapped = Math.max(0, credits)

  // FICA or SE tax depending on employment type
  const wagesForFica = Math.max(0, gross - pretax)
  const fica = isSelfEmployed
    ? { ss: 0, medicare: 0, addlMedicare: 0, total: 0 }
    : calcFica(wagesForFica, filingStatus)
  const seTax = isSelfEmployed
    ? calcSeTax(Math.max(0, gross - pretax))
    : { ssPortion: 0, medicarePortion: 0, total: 0, deductible: 0 }

  // AGI: gross minus pre-tax retirement/HSA, and for SE, minus half of SE tax
  const agi = Math.max(0, gross - pretax - seTax.deductible)

  // Deduction: larger of standard or itemized
  const standardDeduction = STANDARD_DEDUCTION_2025[filingStatus]
  const deductionUsed = Math.max(standardDeduction, itemized)
  const deductionType: "standard" | "itemized" =
    itemized > standardDeduction ? "itemized" : "standard"

  const taxableIncome = Math.max(0, agi - deductionUsed)

  // Federal tax
  const brackets = FEDERAL_BRACKETS_2025[filingStatus]
  const { tax: federalTax, breakdown, marginalRate } = applyBrackets(
    taxableIncome,
    brackets
  )
  const federalAfterCredits = Math.max(0, federalTax - creditsCapped)

  // State tax: flat effective rate on taxable income (estimate)
  const stateInfo = getStateRate(stateAbbr)
  const stateRate = stateInfo.effectiveRate / 100
  const stateTax = taxableIncome * stateRate

  const totalTax = federalAfterCredits + stateTax + fica.total + seTax.total
  // Take home = gross minus pretax contributions (they don't land in pocket)
  // minus the taxes actually paid
  const takeHome = Math.max(0, gross - pretax - totalTax)

  return {
    gross,
    agi,
    taxableIncome,
    deductionUsed,
    deductionType,
    federalTax,
    federalAfterCredits,
    stateTax,
    stateRate: stateInfo.effectiveRate,
    fica,
    seTax,
    totalTax,
    takeHome,
    monthly: takeHome / 12,
    biweekly: takeHome / 26,
    weekly: takeHome / 52,
    effectiveRate: gross > 0 ? (totalTax / gross) * 100 : 0,
    marginalRate: marginalRate * 100,
    bracketBreakdown: breakdown,
  }
}

// Number input that keeps a string draft while editing so the user can clear
// the field and retype without the state resetting to 0.
function NumberInput({
  value,
  onChange,
  placeholder,
  id,
}: {
  value: number
  onChange: (n: number) => void
  placeholder?: string
  id?: string
}) {
  const [draft, setDraft] = useState<string | null>(null)
  return (
    <Input
      id={id}
      inputMode="decimal"
      type="number"
      min={0}
      step="100"
      placeholder={placeholder}
      value={draft ?? (value || value === 0 ? String(value) : "")}
      onChange={(e) => {
        setDraft(e.target.value)
        const n = Number(e.target.value)
        onChange(Number.isFinite(n) && n >= 0 ? n : 0)
      }}
      onBlur={() => setDraft(null)}
    />
  )
}

export default function IncomeTaxCalculator() {
  const [filingStatus, setFilingStatus] = useState<FilingStatus>("single")
  const [income, setIncome] = useState(75000)
  const [stateAbbr, setStateAbbr] = useState(DEFAULT_STATE)
  const [pretax, setPretax] = useState(0)
  const [itemized, setItemized] = useState(0)
  const [credits, setCredits] = useState(0)
  const [employmentType, setEmploymentType] = useState<"w2" | "se">("w2")
  const [whatIfRaise, setWhatIfRaise] = useState(0)

  const result = useMemo(
    () =>
      calculateTaxes({
        income,
        filingStatus,
        stateAbbr,
        pretaxDeductions: pretax,
        itemizedDeductions: itemized,
        credits,
        isSelfEmployed: employmentType === "se",
      }),
    [income, filingStatus, stateAbbr, pretax, itemized, credits, employmentType]
  )

  const whatIfResult = useMemo(
    () =>
      whatIfRaise !== 0
        ? calculateTaxes({
            income: income + whatIfRaise,
            filingStatus,
            stateAbbr,
            pretaxDeductions: pretax,
            itemizedDeductions: itemized,
            credits,
            isSelfEmployed: employmentType === "se",
          })
        : null,
    [
      whatIfRaise,
      income,
      filingStatus,
      stateAbbr,
      pretax,
      itemized,
      credits,
      employmentType,
    ]
  )

  const standardDeduction = STANDARD_DEDUCTION_2025[filingStatus]

  return (
    <div className="space-y-6">
      {/* INPUTS */}
      <Card>
        <CardHeader>
          <CardTitle>Your Tax Information (2025)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <Tabs
            value={employmentType}
            onValueChange={(v) => setEmploymentType(v as "w2" | "se")}
          >
            <TabsList className="grid w-full grid-cols-2 sm:w-96">
              <TabsTrigger value="w2">Employee (W-2)</TabsTrigger>
              <TabsTrigger value="se">Self-Employed</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="filingStatus">Filing Status</Label>
              <Select
                value={filingStatus}
                onValueChange={(v) => setFilingStatus(v as FilingStatus)}
              >
                <SelectTrigger id="filingStatus">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FILING_STATUSES.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="state">State</Label>
              <Select value={stateAbbr} onValueChange={setStateAbbr}>
                <SelectTrigger id="state">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="max-h-80">
                  {STATE_INCOME_TAX_RATES.map((s) => (
                    <SelectItem key={s.abbr} value={s.abbr}>
                      {s.name}
                      {s.effectiveRate === 0 ? " (0%)" : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="income">
                {employmentType === "w2"
                  ? "Annual Gross Income"
                  : "Annual Self-Employment Income"}
              </Label>
              <NumberInput
                id="income"
                value={income}
                onChange={setIncome}
                placeholder="75000"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="pretax">Pre-Tax Deductions (401k, HSA)</Label>
              <NumberInput
                id="pretax"
                value={pretax}
                onChange={setPretax}
                placeholder="0"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="itemized">
                Itemized Deductions{" "}
                <span className="text-muted-foreground">
                  (standard: {fmt(standardDeduction)})
                </span>
              </Label>
              <NumberInput
                id="itemized"
                value={itemized}
                onChange={setItemized}
                placeholder="0"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="credits">Tax Credits</Label>
              <NumberInput
                id="credits"
                value={credits}
                onChange={setCredits}
                placeholder="0"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SUMMARY RESULTS */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          label="Take-Home Pay"
          value={fmt(result.takeHome)}
          sub={`${fmt(result.monthly)}/mo`}
          accent
        />
        <SummaryCard
          label="Total Tax"
          value={fmt(result.totalTax)}
          sub={`Effective ${fmtPct(result.effectiveRate)}`}
        />
        <SummaryCard
          label="Federal Tax"
          value={fmt(result.federalAfterCredits)}
          sub={`Marginal ${fmtPct(result.marginalRate)}`}
        />
        <SummaryCard
          label={employmentType === "w2" ? "FICA" : "SE Tax"}
          value={fmt(
            employmentType === "w2" ? result.fica.total : result.seTax.total
          )}
          sub={
            employmentType === "w2"
              ? "SS + Medicare"
              : "SS + Medicare (half deductible)"
          }
        />
      </div>

      {/* BREAKDOWN */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Tax Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <Row label="Gross Income" value={fmt(result.gross)} />
            <Row
              label="Pre-Tax Deductions"
              value={`-${fmt(pretax)}`}
              muted
            />
            {employmentType === "se" && result.seTax.total > 0 && (
              <Row
                label="½ SE Tax (deducted from AGI)"
                value={`-${fmt(result.seTax.deductible)}`}
                muted
              />
            )}
            <Row
              label="Adjusted Gross Income"
              value={fmt(result.agi)}
              bold
            />
            <Row
              label={`${result.deductionType === "itemized" ? "Itemized" : "Standard"} Deduction`}
              value={`-${fmt(result.deductionUsed)}`}
              muted
            />
            <Row
              label="Taxable Income"
              value={fmt(result.taxableIncome)}
              bold
            />
            <div className="my-2 border-t" />
            <Row
              label="Federal Income Tax"
              value={fmt(result.federalTax)}
            />
            {credits > 0 && (
              <Row label="Tax Credits" value={`-${fmt(credits)}`} muted />
            )}
            <Row
              label={`State Tax (${getStateRate(stateAbbr).name}, ${fmtPct(
                result.stateRate
              )})`}
              value={fmt(result.stateTax)}
            />
            {employmentType === "w2" ? (
              <>
                <Row
                  label="Social Security (6.2%)"
                  value={fmt(result.fica.ss)}
                />
                <Row
                  label="Medicare (1.45%)"
                  value={fmt(result.fica.medicare)}
                />
                {result.fica.addlMedicare > 0 && (
                  <Row
                    label="Additional Medicare (0.9%)"
                    value={fmt(result.fica.addlMedicare)}
                  />
                )}
              </>
            ) : (
              <>
                <Row
                  label="SE Social Security"
                  value={fmt(result.seTax.ssPortion)}
                />
                <Row
                  label="SE Medicare"
                  value={fmt(result.seTax.medicarePortion)}
                />
              </>
            )}
            <div className="my-2 border-t" />
            <Row
              label="Total Taxes"
              value={fmt(result.totalTax)}
              bold
            />
            <Row
              label="Take-Home Pay"
              value={fmt(result.takeHome)}
              bold
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pay Period Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <Row label="Annual" value={fmt(result.takeHome)} bold />
            <Row label="Monthly" value={fmt(result.monthly)} />
            <Row label="Bi-Weekly (26)" value={fmt(result.biweekly)} />
            <Row label="Weekly" value={fmt(result.weekly)} />
            <div className="my-3 border-t" />
            <div className="space-y-1 text-xs text-muted-foreground">
              <div>
                <strong className="text-foreground">Effective rate:</strong>{" "}
                {fmtPct(result.effectiveRate)} of gross paid in total taxes
              </div>
              <div>
                <strong className="text-foreground">Marginal rate:</strong>{" "}
                {fmtPct(result.marginalRate)} federal, the rate on your next
                dollar earned
              </div>
              <div>
                <strong className="text-foreground">Deduction used:</strong>{" "}
                {result.deductionType === "itemized"
                  ? "Itemized (higher than standard)"
                  : "Standard (higher than itemized)"}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* BRACKET VISUALIZATION */}
      <Card>
        <CardHeader>
          <CardTitle>Federal Bracket Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {result.bracketBreakdown
              .filter((b) => b.amountInBracket > 0)
              .map((b, i) => {
                const pct =
                  result.taxableIncome > 0
                    ? (b.amountInBracket / result.taxableIncome) * 100
                    : 0
                return (
                  <div key={i} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium">
                        {fmtPct(b.rate * 100)} bracket
                        <span className="ml-2 text-muted-foreground">
                          ({fmt(b.from)} to{" "}
                          {b.to === Number.POSITIVE_INFINITY
                            ? "∞"
                            : fmt(b.to)}
                          )
                        </span>
                      </span>
                      <span className="tabular-nums text-muted-foreground">
                        {fmt(b.amountInBracket)} →{" "}
                        <span className="font-medium text-foreground">
                          {fmt(b.tax)}
                        </span>
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full bg-primary"
                        style={{ width: `${Math.max(pct, 1)}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            {result.bracketBreakdown.filter((b) => b.amountInBracket > 0)
              .length === 0 && (
              <p className="text-sm text-muted-foreground">
                Your taxable income is zero after deductions, so no federal
                income tax owed.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* WHAT-IF SCENARIO */}
      <Card>
        <CardHeader>
          <CardTitle>What-If: Income Change</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="whatif">
              Raise / Bonus: {whatIfRaise >= 0 ? "+" : ""}
              {fmt(whatIfRaise)}
            </Label>
            <input
              id="whatif"
              type="range"
              min={-50000}
              max={100000}
              step={1000}
              value={whatIfRaise}
              onChange={(e) => setWhatIfRaise(Number(e.target.value))}
              className="w-full accent-primary"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>-$50k</span>
              <span>0</span>
              <span>+$100k</span>
            </div>
          </div>
          {whatIfResult && (
            <div className="grid gap-3 rounded-xl border bg-muted/30 p-3 text-sm sm:grid-cols-3">
              <Row
                label="New Take-Home"
                value={fmt(whatIfResult.takeHome)}
                bold
              />
              <Row
                label="Change"
                value={`${whatIfResult.takeHome - result.takeHome >= 0 ? "+" : ""}${fmt(
                  whatIfResult.takeHome - result.takeHome
                )}`}
                bold
              />
              <Row
                label="Keep from raise"
                value={
                  whatIfRaise !== 0
                    ? fmtPct(
                        ((whatIfResult.takeHome - result.takeHome) /
                          whatIfRaise) *
                          100
                      )
                    : "-"
                }
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* DISCLAIMER */}
      <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 text-xs text-muted-foreground">
        <strong className="text-foreground">Estimates only.</strong> This
        calculator uses 2025 federal tax brackets and simplified state
        effective rates. It does not model every deduction, credit, AMT, QBI,
        or phase-out rule. Results are for planning purposes and are{" "}
        <strong className="text-foreground">not tax advice</strong>. Consult a
        CPA or tax professional before filing.
      </div>
    </div>
  )
}

// --- Subcomponents ---
function SummaryCard({
  label,
  value,
  sub,
  accent,
}: {
  label: string
  value: string
  sub?: string
  accent?: boolean
}) {
  return (
    <div
      className={`rounded-2xl border p-4 ${
        accent ? "bg-primary/10 ring-1 ring-primary/30" : "bg-card"
      }`}
    >
      <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </div>
      <div className="mt-1 font-heading text-2xl font-semibold tabular-nums">
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
