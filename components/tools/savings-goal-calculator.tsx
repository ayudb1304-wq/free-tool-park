"use client"

import { useMemo, useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

// --- Formatting ---
const fmt = (n: number) =>
  n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })

const fmtPct = (n: number) => `${n.toFixed(1)}%`

// --- Types ---
interface MonthRow {
  month: number
  deposit: number
  interest: number
  balance: number
  progress: number // 0 to 100
}

interface Milestone {
  label: string
  amount: number
  monthReached: number | null
}

interface SavingsResult {
  schedule: MonthRow[]
  totalMonths: number
  totalDeposits: number
  totalInterest: number
  finalBalance: number
  goalReached: boolean
  monthlyNeeded: number
  milestones: Milestone[]
}

// --- Core math ---
function simulateSavings(
  goalAmount: number,
  currentSavings: number,
  monthlyDeposit: number,
  annualReturn: number,
  targetMonths: number,
): SavingsResult {
  const monthlyRate = annualReturn / 100 / 12
  const schedule: MonthRow[] = []
  let balance = currentSavings
  let totalDeposits = currentSavings
  let totalInterest = 0
  let goalReached = false
  let totalMonths = 0

  // Define milestones at 25%, 50%, 75%, 100%
  const milestoneTargets: Milestone[] = [
    { label: "25%", amount: goalAmount * 0.25, monthReached: null },
    { label: "50%", amount: goalAmount * 0.5, monthReached: null },
    { label: "75%", amount: goalAmount * 0.75, monthReached: null },
    { label: "100%", amount: goalAmount, monthReached: null },
  ]

  // Check if starting balance already passes milestones
  for (const m of milestoneTargets) {
    if (balance >= m.amount && m.monthReached === null) {
      m.monthReached = 0
    }
  }

  // Simulate up to target months or until goal is reached (whichever is longer, capped at 600 months / 50 years)
  const maxMonths = Math.max(targetMonths, 600)

  for (let i = 1; i <= maxMonths; i++) {
    const interest = balance * monthlyRate
    balance += interest + monthlyDeposit
    totalDeposits += monthlyDeposit
    totalInterest += interest

    const progress = Math.min((balance / goalAmount) * 100, 100)

    schedule.push({
      month: i,
      deposit: monthlyDeposit,
      interest,
      balance,
      progress,
    })

    // Check milestones
    for (const m of milestoneTargets) {
      if (balance >= m.amount && m.monthReached === null) {
        m.monthReached = i
      }
    }

    if (!goalReached && balance >= goalAmount) {
      goalReached = true
      totalMonths = i
    }

    // Stop if goal is reached and we have gone past the target period
    if (goalReached && i >= targetMonths) break
    // Also stop if no goal reached and past max
    if (i >= maxMonths) {
      totalMonths = maxMonths
      break
    }
  }

  if (!goalReached) {
    totalMonths = maxMonths
  }

  // Calculate monthly needed to hit goal in target months
  const remaining = goalAmount - currentSavings
  let monthlyNeeded = 0
  if (remaining > 0 && targetMonths > 0) {
    if (monthlyRate === 0) {
      monthlyNeeded = remaining / targetMonths
    } else {
      // PMT formula: PMT = (FV - PV*(1+r)^n) * r / ((1+r)^n - 1)
      const compoundFactor = Math.pow(1 + monthlyRate, targetMonths)
      const fvCurrentSavings = currentSavings * compoundFactor
      const gap = goalAmount - fvCurrentSavings
      if (gap > 0) {
        monthlyNeeded = (gap * monthlyRate) / (compoundFactor - 1)
      }
    }
  }

  return {
    schedule,
    totalMonths: goalReached ? totalMonths : -1,
    totalDeposits,
    totalInterest,
    finalBalance: balance,
    goalReached,
    monthlyNeeded: Math.max(monthlyNeeded, 0),
    milestones: milestoneTargets,
  }
}

function formatMonths(months: number): string {
  const years = Math.floor(months / 12)
  const remaining = months % 12
  if (years === 0) return `${remaining} month${remaining !== 1 ? "s" : ""}`
  if (remaining === 0) return `${years} year${years !== 1 ? "s" : ""}`
  return `${years} yr ${remaining} mo`
}

// --- Component ---
export default function SavingsGoalCalculator() {
  const [goalAmount, setGoalAmount] = useState("50000")
  const [currentSavings, setCurrentSavings] = useState("5000")
  const [monthlyDeposit, setMonthlyDeposit] = useState("500")
  const [annualReturn, setAnnualReturn] = useState("4.5")
  const [targetYears, setTargetYears] = useState("5")
  const [view, setView] = useState<"summary" | "schedule">("summary")

  const result = useMemo(() => {
    const ga = Number(goalAmount)
    const cs = Number(currentSavings)
    const md = Number(monthlyDeposit)
    const ar = Number(annualReturn)
    const ty = Number(targetYears)

    if (
      [ga, cs, md, ar, ty].some(isNaN) ||
      ga <= 0 ||
      cs < 0 ||
      md < 0 ||
      ar < 0 ||
      ty <= 0 ||
      ty > 50
    ) {
      return null
    }

    return simulateSavings(ga, cs, md, ar, Math.round(ty * 12))
  }, [goalAmount, currentSavings, monthlyDeposit, annualReturn, targetYears])

  const targetMonths = Math.round(Number(targetYears) * 12)

  return (
    <div className="space-y-6">
      {/* Disclaimer */}
      <div className="rounded-lg border border-amber-300 bg-amber-500/5 p-3 text-sm text-amber-800 dark:border-amber-700 dark:text-amber-300">
        Estimates only. Not financial advice. Returns are not guaranteed and actual results will vary. Consult a financial advisor for personalized guidance.
      </div>

      {/* Inputs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="sg-goal">Savings Goal ($)</Label>
          <Input id="sg-goal" type="number" min={1} value={goalAmount} onChange={(e) => setGoalAmount(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="sg-current">Current Savings ($)</Label>
          <Input id="sg-current" type="number" min={0} value={currentSavings} onChange={(e) => setCurrentSavings(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="sg-monthly">Monthly Deposit ($)</Label>
          <Input id="sg-monthly" type="number" min={0} value={monthlyDeposit} onChange={(e) => setMonthlyDeposit(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="sg-return">Annual Return (%)</Label>
          <Input id="sg-return" type="number" min={0} max={20} step={0.1} value={annualReturn} onChange={(e) => setAnnualReturn(e.target.value)} />
          <p className="text-xs text-muted-foreground">HYSA: 4 to 5%, CDs: 4 to 5%, Bonds: 3 to 5%, Index funds: 7 to 10%</p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="sg-years">Target Timeframe (years)</Label>
          <Input id="sg-years" type="number" min={0.5} max={50} step={0.5} value={targetYears} onChange={(e) => setTargetYears(e.target.value)} />
        </div>
      </div>

      {/* Results */}
      {result && (
        <>
          {/* Summary Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Time to Reach Goal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className={`text-2xl font-bold ${result.goalReached ? (result.totalMonths <= targetMonths ? "text-green-600 dark:text-green-400" : "text-amber-600 dark:text-amber-400") : "text-red-600 dark:text-red-400"}`}>
                  {result.goalReached ? formatMonths(result.totalMonths) : "50+ years"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {result.goalReached && result.totalMonths <= targetMonths
                    ? `On track (${formatMonths(targetMonths - result.totalMonths)} ahead of schedule)`
                    : result.goalReached
                      ? `${formatMonths(result.totalMonths - targetMonths)} behind your ${targetYears}-year target`
                      : `Goal not reachable at current rate`}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Monthly Deposit Needed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-primary">
                  {fmt(result.monthlyNeeded)}
                </p>
                <p className="text-xs text-muted-foreground">
                  to reach {fmt(Number(goalAmount))} in {targetYears} years
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Deposits
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  {fmt(result.totalDeposits)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {fmt(Number(currentSavings))} initial + {fmt(result.totalDeposits - Number(currentSavings))} monthly
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Interest Earned
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {fmt(result.totalInterest)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {fmtPct((result.totalInterest / result.finalBalance) * 100)} of final balance
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Milestone Tracker */}
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="text-lg">Milestone Tracker</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {result.milestones.map((m) => (
                  <div key={m.label} className="flex items-center gap-3">
                    <div className="w-10 text-sm font-medium">{m.label}</div>
                    <div className="flex-1">
                      <div className="h-4 rounded-full bg-muted">
                        <div
                          className={`h-full rounded-full transition-all ${m.monthReached !== null ? "bg-primary" : "bg-muted-foreground/20"}`}
                          style={{
                            width: m.monthReached !== null ? "100%" : `${Math.min((result.finalBalance / m.amount) * 100, 99)}%`,
                          }}
                        />
                      </div>
                    </div>
                    <div className="w-28 text-right text-sm">
                      {m.monthReached !== null ? (
                        <span className="text-green-600 dark:text-green-400">
                          {m.monthReached === 0 ? "Already there" : formatMonths(m.monthReached)}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">Not reached</span>
                      )}
                    </div>
                    <div className="w-20 text-right text-xs text-muted-foreground">
                      {fmt(m.amount)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Smart Insights */}
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="text-lg">Smart Insights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {result.goalReached && result.totalMonths <= targetMonths && (
                <p className="text-green-700 dark:text-green-300">
                  At {fmt(Number(monthlyDeposit))}/month with a {annualReturn}% return, you will reach your {fmt(Number(goalAmount))} goal in {formatMonths(result.totalMonths)}, which is {formatMonths(targetMonths - result.totalMonths)} ahead of your target. You could reduce your monthly deposit to {fmt(result.monthlyNeeded)} and still hit your goal on time.
                </p>
              )}
              {result.goalReached && result.totalMonths > targetMonths && (
                <p className="text-amber-700 dark:text-amber-300">
                  At your current savings rate, you will reach {fmt(Number(goalAmount))} in {formatMonths(result.totalMonths)}, which is {formatMonths(result.totalMonths - targetMonths)} after your target date. Increase your monthly deposit from {fmt(Number(monthlyDeposit))} to {fmt(result.monthlyNeeded)} to get back on track.
                </p>
              )}
              {!result.goalReached && (
                <p className="text-red-700 dark:text-red-300">
                  At your current savings rate, you will not reach {fmt(Number(goalAmount))} within 50 years. You need to deposit at least {fmt(result.monthlyNeeded)}/month to reach your goal in {targetYears} years.
                </p>
              )}
              <p className="text-muted-foreground">
                Interest earns you {fmt(result.totalInterest)} on top of your {fmt(result.totalDeposits)} in deposits.
                {result.totalInterest > result.totalDeposits - Number(currentSavings)
                  ? " Your money is working harder than you are. Interest exceeds your total monthly deposits."
                  : ` Over time, compound interest will make up an increasingly larger share of your balance.`}
              </p>
              {Number(annualReturn) === 0 && (
                <p className="text-muted-foreground">
                  You have the return rate set to 0%. Even a high-yield savings account at 4 to 5% APY would significantly reduce the time to reach your goal.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Tabs */}
          <Tabs value={view} onValueChange={(v) => setView(v as typeof view)}>
            <TabsList>
              <TabsTrigger value="summary">Growth Chart</TabsTrigger>
              <TabsTrigger value="schedule">Monthly Schedule</TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Growth visualization */}
          {view === "summary" && (
            <div className="space-y-3">
              <h3 className="font-semibold">Savings Growth Over Time</h3>
              <div className="space-y-2">
                {result.schedule
                  .filter((_, i, arr) => {
                    // Show every 6 months for short periods, every 12 for long
                    const interval = arr.length > 60 ? 12 : 6
                    return i % interval === interval - 1 || i === arr.length - 1
                  })
                  .slice(0, 20) // Cap at 20 bars
                  .map((row) => {
                    const pct = (row.balance / Number(goalAmount)) * 100
                    const cappedPct = Math.min(pct, 100)
                    return (
                      <div key={row.month} className="flex items-center gap-3 text-sm">
                        <span className="w-16 shrink-0 text-muted-foreground">
                          {formatMonths(row.month)}
                        </span>
                        <div className="flex-1 relative">
                          <div
                            className={`h-6 rounded ${pct >= 100 ? "bg-green-500/30" : "bg-primary/20"}`}
                            style={{ width: `${Math.max(cappedPct, 1)}%` }}
                          />
                          {/* Goal line */}
                          <div className="absolute top-0 right-0 h-6 w-px border-r-2 border-dashed border-muted-foreground/40" />
                        </div>
                        <span className="w-20 shrink-0 text-right font-medium">
                          {fmt(row.balance)}
                        </span>
                      </div>
                    )
                  })}
              </div>
              <div className="flex gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <span className="inline-block h-3 w-3 rounded bg-primary/20" /> Balance
                </span>
                <span className="flex items-center gap-1">
                  <span className="inline-block h-3 w-3 rounded bg-green-500/30" /> Goal reached
                </span>
                <span>Dashed line = {fmt(Number(goalAmount))} goal</span>
              </div>
            </div>
          )}

          {/* Monthly schedule table */}
          {view === "schedule" && (
            <div className="overflow-x-auto rounded-xl border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="px-3 py-2 text-left font-semibold">Month</th>
                    <th className="px-3 py-2 text-right font-semibold">Deposit</th>
                    <th className="px-3 py-2 text-right font-semibold">Interest</th>
                    <th className="px-3 py-2 text-right font-semibold">Balance</th>
                    <th className="px-3 py-2 text-right font-semibold">Progress</th>
                  </tr>
                </thead>
                <tbody>
                  {result.schedule
                    .filter((_, i, arr) => {
                      // Show every month for short periods, every 3 for medium, every 6 for long
                      if (arr.length <= 36) return true
                      if (arr.length <= 120) return i % 3 === 2 || i === arr.length - 1
                      return i % 6 === 5 || i === arr.length - 1
                    })
                    .map((row) => (
                      <tr
                        key={row.month}
                        className={`border-b last:border-0 even:bg-muted/20 ${row.progress >= 100 ? "bg-green-50 dark:bg-green-950/20" : ""}`}
                      >
                        <td className="px-3 py-2">{formatMonths(row.month)}</td>
                        <td className="px-3 py-2 text-right">{fmt(row.deposit)}</td>
                        <td className="px-3 py-2 text-right text-green-600 dark:text-green-400">
                          +{fmt(row.interest)}
                        </td>
                        <td className="px-3 py-2 text-right font-medium">{fmt(row.balance)}</td>
                        <td className="px-3 py-2 text-right">
                          <span className={row.progress >= 100 ? "text-green-600 dark:text-green-400 font-medium" : ""}>
                            {fmtPct(row.progress)}
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {!result && (
        <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
          Enter a savings goal greater than zero and a timeframe of 1 to 50 years.
        </div>
      )}
    </div>
  )
}
