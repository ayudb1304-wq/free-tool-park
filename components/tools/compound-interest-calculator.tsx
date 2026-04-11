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

// --- Constants ---
const COMPOUND_FREQUENCIES = [
  { value: "1", label: "Annually", perYear: 1 },
  { value: "2", label: "Semi-Annually", perYear: 2 },
  { value: "4", label: "Quarterly", perYear: 4 },
  { value: "12", label: "Monthly", perYear: 12 },
  { value: "52", label: "Weekly", perYear: 52 },
  { value: "365", label: "Daily", perYear: 365 },
  { value: "inf", label: "Continuously", perYear: Number.POSITIVE_INFINITY },
]

const CONTRIBUTION_FREQUENCIES = [
  { value: "yearly", label: "Yearly", perYear: 1 },
  { value: "monthly", label: "Monthly", perYear: 12 },
  { value: "biweekly", label: "Bi-Weekly", perYear: 26 },
  { value: "weekly", label: "Weekly", perYear: 52 },
]

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

const fmtPct = (n: number) => `${n.toFixed(2)}%`

// --- Types ---
interface YearRow {
  year: number
  startBalance: number
  endBalance: number
  contributionsThisYear: number
  interestThisYear: number
  totalContributed: number // cumulative, including principal
  totalInterest: number // cumulative interest earned
  inflationAdjusted: number
}

interface SimulationResult {
  years: YearRow[]
  finalBalance: number
  totalContributions: number // includes initial principal
  totalInterest: number
  totalTaxPaid: number
  inflationAdjustedFinal: number
}

// --- Core math ---
// Convert an annual rate to an effective per-month rate for any compounding
// frequency, including continuous compounding. This lets us run a single
// monthly simulation loop regardless of the user's compounding choice.
function monthlyRateFromAnnual(annualRate: number, compoundsPerYear: number) {
  if (annualRate === 0) return 0
  if (compoundsPerYear === Number.POSITIVE_INFINITY) {
    return Math.expm1(annualRate / 12)
  }
  // (1 + r/n)^(n/12) - 1
  return Math.pow(1 + annualRate / compoundsPerYear, compoundsPerYear / 12) - 1
}

// Per-period contribution amount to use within a single month given the
// user's selected contribution frequency. Sub-monthly frequencies are
// aggregated to a single monthly add.
function monthlyContributionFrom(
  perPeriod: number,
  contribPerYear: number
) {
  // contributions per year × amount per contribution / 12 months
  return (perPeriod * contribPerYear) / 12
}

interface SimInputs {
  principal: number
  contributionAmount: number
  contributionsPerYear: number
  annualRate: number // e.g. 0.07 for 7%
  years: number
  compoundsPerYear: number
  inflationRate: number // e.g. 0.03 for 3%
  taxRate: number // e.g. 0.15 for 15% (applied annually to interest)
}

function simulate(input: SimInputs): SimulationResult {
  const {
    principal,
    contributionAmount,
    contributionsPerYear,
    annualRate,
    years,
    compoundsPerYear,
    inflationRate,
    taxRate,
  } = input

  const monthlyRate = monthlyRateFromAnnual(annualRate, compoundsPerYear)
  const monthlyContribution = monthlyContributionFrom(
    contributionAmount,
    contributionsPerYear
  )

  let balance = principal
  let totalContributed = principal
  let totalTaxPaid = 0

  const rows: YearRow[] = []
  const totalMonths = Math.max(0, Math.round(years * 12))

  let yearStart = balance
  let yearContrib = 0
  let yearInterest = 0

  for (let m = 1; m <= totalMonths; m++) {
    // Contribute at the start of the period, then compound.
    balance += monthlyContribution
    totalContributed += monthlyContribution
    yearContrib += monthlyContribution

    const interest = balance * monthlyRate
    balance += interest
    yearInterest += interest

    // End of year: apply annual tax on interest earned this year, record row.
    if (m % 12 === 0) {
      const taxThisYear = yearInterest * taxRate
      balance -= taxThisYear
      totalTaxPaid += taxThisYear
      const year = m / 12
      const inflationAdjusted =
        inflationRate > 0 ? balance / Math.pow(1 + inflationRate, year) : balance
      rows.push({
        year,
        startBalance: yearStart,
        endBalance: balance,
        contributionsThisYear: yearContrib,
        interestThisYear: yearInterest - taxThisYear,
        totalContributed,
        totalInterest: balance - totalContributed,
        inflationAdjusted,
      })
      yearStart = balance
      yearContrib = 0
      yearInterest = 0
    }
  }

  const inflationAdjustedFinal =
    inflationRate > 0 && years > 0
      ? balance / Math.pow(1 + inflationRate, years)
      : balance

  return {
    years: rows,
    finalBalance: balance,
    totalContributions: totalContributed,
    totalInterest: balance - totalContributed,
    totalTaxPaid,
    inflationAdjustedFinal,
  }
}

// Solve for the periodic contribution required to hit a target future value.
// Uses a bisection search that calls simulate() — works with any compounding
// and tax/inflation settings without closed-form algebra headaches.
function solveGoal(
  base: Omit<SimInputs, "contributionAmount">,
  targetFV: number
): { contribution: number; achievable: boolean } {
  // Quick check: if principal alone reaches target, no contribution needed.
  const zeroContrib = simulate({ ...base, contributionAmount: 0 })
  if (zeroContrib.finalBalance >= targetFV) {
    return { contribution: 0, achievable: true }
  }

  // Upper bound: if a huge contribution can't reach target, nothing can.
  let lo = 0
  let hi = Math.max(targetFV, 1) // start guess
  // Expand hi until the simulation reaches the target
  for (let i = 0; i < 40; i++) {
    const sim = simulate({ ...base, contributionAmount: hi })
    if (sim.finalBalance >= targetFV) break
    hi *= 2
    if (hi > 1e12) {
      return { contribution: 0, achievable: false }
    }
  }

  // Binary search for the minimum contribution
  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2
    const sim = simulate({ ...base, contributionAmount: mid })
    if (sim.finalBalance >= targetFV) {
      hi = mid
    } else {
      lo = mid
    }
    if (hi - lo < 0.01) break
  }

  return { contribution: hi, achievable: true }
}

// --- Tiny number input that lets the user clear/retype without snapping to 0 ---
function NumberInput({
  value,
  onChange,
  placeholder,
  id,
  step = "100",
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

// --- Simple stacked area chart (contributions vs interest over time) ---
function GrowthChart({
  rows,
  height = 220,
}: {
  rows: YearRow[]
  height?: number
}) {
  if (rows.length === 0) {
    return (
      <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
        Enter values above to see your growth chart.
      </div>
    )
  }

  // Prepend year 0 so the area starts at the principal amount.
  const first = rows[0]
  const points = [
    {
      year: 0,
      contributed: first.totalContributed - first.contributionsThisYear,
      interest: 0,
    },
    ...rows.map((r) => ({
      year: r.year,
      contributed: r.totalContributed,
      interest: r.totalInterest,
    })),
  ]

  const maxValue = Math.max(...points.map((p) => p.contributed + p.interest), 1)
  const maxYear = points[points.length - 1].year

  const width = 640
  const padL = 48
  const padR = 12
  const padT = 12
  const padB = 28
  const innerW = width - padL - padR
  const innerH = height - padT - padB

  const xFor = (year: number) => padL + (year / maxYear) * innerW
  const yFor = (value: number) => padT + innerH - (value / maxValue) * innerH

  // Build the contributions polygon (bottom layer)
  const contribTop = points.map((p) => `${xFor(p.year)},${yFor(p.contributed)}`)
  const contribBottom = `${xFor(maxYear)},${yFor(0)} ${xFor(0)},${yFor(0)}`
  const contribPoly = `${contribTop.join(" ")} ${contribBottom}`

  // Interest polygon sits on top of contributions
  const totalTop = points.map((p) =>
    `${xFor(p.year)},${yFor(p.contributed + p.interest)}`
  )
  const interestBottom = points
    .slice()
    .reverse()
    .map((p) => `${xFor(p.year)},${yFor(p.contributed)}`)
  const interestPoly = `${totalTop.join(" ")} ${interestBottom.join(" ")}`

  // Y-axis ticks at 0, 25, 50, 75, 100% of max
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((t) => ({
    v: t * maxValue,
    y: yFor(t * maxValue),
  }))

  return (
    <div className="w-full overflow-x-auto">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full min-w-[520px]"
        role="img"
        aria-label="Investment growth over time chart"
      >
        {/* Gridlines + Y labels */}
        {ticks.map((t, i) => (
          <g key={i}>
            <line
              x1={padL}
              x2={width - padR}
              y1={t.y}
              y2={t.y}
              className="stroke-border"
              strokeWidth={1}
              strokeDasharray={i === 0 ? "0" : "2,3"}
            />
            <text
              x={padL - 6}
              y={t.y + 3}
              textAnchor="end"
              className="fill-muted-foreground text-[10px]"
            >
              {fmt(t.v)}
            </text>
          </g>
        ))}

        {/* Contributions area (base layer) */}
        <polygon
          points={contribPoly}
          className="fill-primary/40 stroke-primary"
          strokeWidth={1.5}
        />

        {/* Interest area (top layer) */}
        <polygon
          points={interestPoly}
          className="fill-emerald-500/40 stroke-emerald-500"
          strokeWidth={1.5}
        />

        {/* X-axis labels — show 5 evenly spaced years */}
        {Array.from({ length: 5 }, (_, i) => {
          const year = Math.round(((i + 1) * maxYear) / 5)
          return (
            <text
              key={i}
              x={xFor(year)}
              y={height - 8}
              textAnchor="middle"
              className="fill-muted-foreground text-[10px]"
            >
              Yr {year}
            </text>
          )
        })}
      </svg>

      {/* Legend */}
      <div className="mt-2 flex items-center justify-center gap-4 text-xs">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded-sm bg-primary/40 ring-1 ring-primary" />
          Contributions
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded-sm bg-emerald-500/40 ring-1 ring-emerald-500" />
          Interest
        </span>
      </div>
    </div>
  )
}

// ---------------- MAIN COMPONENT ----------------
export default function CompoundInterestCalculator() {
  const [mode, setMode] = useState<"grow" | "goal">("grow")

  // Inputs shared by both modes
  const [principal, setPrincipal] = useState(10000)
  const [annualRate, setAnnualRate] = useState(7)
  const [years, setYears] = useState(25)
  const [compoundFreq, setCompoundFreq] = useState("12")
  const [contribFreq, setContribFreq] = useState("monthly")

  // Grow mode only
  const [contribution, setContribution] = useState(500)

  // Goal mode only
  const [targetFV, setTargetFV] = useState(1000000)

  // Optional
  const [useInflation, setUseInflation] = useState(true)
  const [inflationRate, setInflationRate] = useState(3)
  const [useTax, setUseTax] = useState(false)
  const [taxRate, setTaxRate] = useState(15)

  const compoundsPerYear = useMemo(() => {
    const f = COMPOUND_FREQUENCIES.find((c) => c.value === compoundFreq)
    return f?.perYear ?? 12
  }, [compoundFreq])

  const contribPerYear = useMemo(() => {
    const f = CONTRIBUTION_FREQUENCIES.find((c) => c.value === contribFreq)
    return f?.perYear ?? 12
  }, [contribFreq])

  const baseInputs = useMemo(
    () => ({
      principal: Math.max(0, principal),
      contributionsPerYear: contribPerYear,
      annualRate: annualRate / 100,
      years: Math.max(0, years),
      compoundsPerYear,
      inflationRate: useInflation ? inflationRate / 100 : 0,
      taxRate: useTax ? taxRate / 100 : 0,
    }),
    [
      principal,
      contribPerYear,
      annualRate,
      years,
      compoundsPerYear,
      useInflation,
      inflationRate,
      useTax,
      taxRate,
    ]
  )

  // Goal mode: solve for required contribution, then simulate with it
  const goalSolution = useMemo(() => {
    if (mode !== "goal") return null
    return solveGoal(baseInputs, Math.max(0, targetFV))
  }, [mode, baseInputs, targetFV])

  const result = useMemo(() => {
    const contribAmount =
      mode === "goal" && goalSolution
        ? goalSolution.contribution
        : Math.max(0, contribution)
    return simulate({ ...baseInputs, contributionAmount: contribAmount })
  }, [mode, goalSolution, contribution, baseInputs])

  const activeContribution =
    mode === "goal" && goalSolution ? goalSolution.contribution : contribution

  return (
    <div className="space-y-6">
      {/* MODE TABS */}
      <Tabs value={mode} onValueChange={(v) => setMode(v as "grow" | "goal")}>
        <TabsList className="grid w-full grid-cols-2 sm:w-[420px]">
          <TabsTrigger value="grow">Calculate Growth</TabsTrigger>
          <TabsTrigger value="goal">Reach a Goal</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* INPUTS */}
      <Card>
        <CardHeader>
          <CardTitle>
            {mode === "grow" ? "Investment Details" : "Goal Details"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="principal">Starting Amount</Label>
              <NumberInput
                id="principal"
                value={principal}
                onChange={setPrincipal}
              />
            </div>

            {mode === "grow" ? (
              <div className="space-y-1.5">
                <Label htmlFor="contribution">
                  Contribution per Period
                </Label>
                <NumberInput
                  id="contribution"
                  value={contribution}
                  onChange={setContribution}
                />
              </div>
            ) : (
              <div className="space-y-1.5">
                <Label htmlFor="target">Target Amount</Label>
                <NumberInput
                  id="target"
                  value={targetFV}
                  onChange={setTargetFV}
                  step="1000"
                />
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="rate">Annual Interest Rate (%)</Label>
              <NumberInput
                id="rate"
                value={annualRate}
                onChange={setAnnualRate}
                step="0.1"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="years">Years</Label>
              <NumberInput
                id="years"
                value={years}
                onChange={setYears}
                step="1"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="compound">Compounding Frequency</Label>
              <Select value={compoundFreq} onValueChange={setCompoundFreq}>
                <SelectTrigger id="compound">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {COMPOUND_FREQUENCIES.map((f) => (
                    <SelectItem key={f.value} value={f.value}>
                      {f.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="contribFreq">Contribution Frequency</Label>
              <Select value={contribFreq} onValueChange={setContribFreq}>
                <SelectTrigger id="contribFreq">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CONTRIBUTION_FREQUENCIES.map((f) => (
                    <SelectItem key={f.value} value={f.value}>
                      {f.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Optional toggles */}
          <div className="space-y-3 rounded-xl border bg-muted/30 p-4">
            <div className="flex flex-wrap items-center gap-3">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={useInflation}
                  onChange={(e) => setUseInflation(e.target.checked)}
                  className="h-4 w-4 accent-primary"
                />
                Adjust for inflation
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
                  <span className="text-sm text-muted-foreground">% / yr</span>
                </div>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={useTax}
                  onChange={(e) => setUseTax(e.target.checked)}
                  className="h-4 w-4 accent-primary"
                />
                Apply annual tax drag (taxable account)
              </label>
              {useTax && (
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    step="1"
                    min={0}
                    max={50}
                    value={taxRate}
                    onChange={(e) => setTaxRate(Number(e.target.value) || 0)}
                    className="h-8 w-20"
                  />
                  <span className="text-sm text-muted-foreground">
                    % on interest
                  </span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* GOAL MODE RESULT BANNER */}
      {mode === "goal" && goalSolution && (
        <div
          className={`rounded-xl border p-4 ${
            goalSolution.achievable
              ? "border-emerald-500/40 bg-emerald-500/10"
              : "border-destructive/40 bg-destructive/10"
          }`}
        >
          {goalSolution.achievable ? (
            goalSolution.contribution === 0 ? (
              <p className="text-sm">
                Your <strong>{fmt(principal)}</strong> starting balance alone
                grows past <strong>{fmt(targetFV)}</strong> in {years} years at{" "}
                {annualRate}%. No recurring contributions needed.
              </p>
            ) : (
              <p className="text-sm">
                To reach <strong>{fmt(targetFV)}</strong> in {years} years you
                need to contribute{" "}
                <strong className="text-lg">
                  {fmt(goalSolution.contribution)}
                </strong>{" "}
                {CONTRIBUTION_FREQUENCIES.find(
                  (c) => c.value === contribFreq
                )?.label.toLowerCase()}
                .
              </p>
            )
          ) : (
            <p className="text-sm">
              Target is not achievable within {years} years at {annualRate}%
              even with very large contributions. Try increasing the years,
              rate, or starting amount.
            </p>
          )}
        </div>
      )}

      {/* SUMMARY CARDS */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          label="Future Value"
          value={fmt(result.finalBalance)}
          accent
        />
        <SummaryCard
          label="Total Contributed"
          value={fmt(result.totalContributions)}
          sub={`Principal + ${fmt(result.totalContributions - principal)} added`}
        />
        <SummaryCard
          label="Interest Earned"
          value={fmt(result.totalInterest)}
          sub={
            result.totalContributions > 0
              ? `${fmtPct(
                  (result.totalInterest / result.totalContributions) * 100
                )} return on contributions`
              : undefined
          }
        />
        <SummaryCard
          label={useInflation ? "Inflation-Adjusted" : "Real (no inflation)"}
          value={fmt(result.inflationAdjustedFinal)}
          sub={
            useInflation
              ? `In today's dollars at ${inflationRate}% inflation`
              : "Toggle inflation above"
          }
        />
      </div>

      {/* CHART */}
      <Card>
        <CardHeader>
          <CardTitle>Growth Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <GrowthChart rows={result.years} />
        </CardContent>
      </Card>

      {/* YEAR-BY-YEAR TABLE */}
      <Card>
        <CardHeader>
          <CardTitle>Year-by-Year Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[580px] text-left text-xs">
              <thead className="border-b bg-muted/40 text-muted-foreground">
                <tr>
                  <th className="px-3 py-2 font-medium">Year</th>
                  <th className="px-3 py-2 text-right font-medium">
                    Contributions
                  </th>
                  <th className="px-3 py-2 text-right font-medium">
                    Interest
                  </th>
                  <th className="px-3 py-2 text-right font-medium">
                    Balance
                  </th>
                  {useInflation && (
                    <th className="px-3 py-2 text-right font-medium">
                      Real (Today&rsquo;s $)
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {result.years.map((row) => (
                  <tr key={row.year} className="border-b last:border-0">
                    <td className="px-3 py-2 font-medium">{row.year}</td>
                    <td className="whitespace-nowrap px-3 py-2 text-right tabular-nums">
                      {fmtFull(row.contributionsThisYear)}
                    </td>
                    <td className="whitespace-nowrap px-3 py-2 text-right tabular-nums text-emerald-600 dark:text-emerald-400">
                      {fmtFull(row.interestThisYear)}
                    </td>
                    <td className="whitespace-nowrap px-3 py-2 text-right font-medium tabular-nums">
                      {fmtFull(row.endBalance)}
                    </td>
                    {useInflation && (
                      <td className="whitespace-nowrap px-3 py-2 text-right tabular-nums text-muted-foreground">
                        {fmtFull(row.inflationAdjusted)}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* INSIGHTS */}
      <Card>
        <CardHeader>
          <CardTitle>Insights</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          {result.finalBalance > result.totalContributions && (
            <p>
              • Compound interest generated{" "}
              <strong className="text-foreground">
                {fmt(result.totalInterest)}
              </strong>{" "}
              — that&rsquo;s{" "}
              <strong className="text-foreground">
                {fmtPct(
                  (result.totalInterest / result.finalBalance) * 100
                )}
              </strong>{" "}
              of your final balance coming from growth, not contributions.
            </p>
          )}
          {activeContribution > 0 && (
            <p>
              • At {fmt(activeContribution)}{" "}
              {CONTRIBUTION_FREQUENCIES.find(
                (c) => c.value === contribFreq
              )?.label.toLowerCase()}
              , you contributed{" "}
              <strong className="text-foreground">
                {fmt(result.totalContributions - principal)}
              </strong>{" "}
              on top of your {fmt(principal)} starting balance.
            </p>
          )}
          {useTax && result.totalTaxPaid > 0 && (
            <p>
              • Tax drag cost you{" "}
              <strong className="text-foreground">
                {fmt(result.totalTaxPaid)}
              </strong>{" "}
              over {years} years. A Roth or tax-advantaged account would keep
              this money compounding for you.
            </p>
          )}
          {useInflation && inflationRate > 0 && years > 0 && (
            <p>
              • After {inflationRate}% annual inflation, your{" "}
              {fmt(result.finalBalance)} is worth{" "}
              <strong className="text-foreground">
                {fmt(result.inflationAdjustedFinal)}
              </strong>{" "}
              in today&rsquo;s dollars — the real purchasing power of your
              nest egg.
            </p>
          )}
        </CardContent>
      </Card>

      {/* DISCLAIMER */}
      <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 text-xs text-muted-foreground">
        <strong className="text-foreground">Estimates only.</strong> Projected
        returns assume a constant annual rate and do not account for market
        volatility, fees, sequence-of-returns risk, or changes in tax law.
        Real-world investment returns vary year to year. This calculator is
        for planning purposes and is{" "}
        <strong className="text-foreground">not financial advice</strong>.
        Consult a qualified financial advisor before making investment
        decisions.
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
