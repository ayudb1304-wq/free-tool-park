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
interface YearRow {
  age: number
  year: number
  startBalance: number
  contribution: number
  growth: number
  endBalance: number
  inflationAdjusted: number
}

interface RetirementResult {
  accumulation: YearRow[]
  withdrawal: YearRow[]
  totalAtRetirement: number
  totalAtRetirementReal: number
  totalContributed: number
  totalGrowth: number
  annualRetirementIncome: number
  annualRetirementIncomeReal: number
  yearsMoneyLasts: number
  hasSurplus: boolean
  shortfall: number
  monthlyNeeded: number
}

// --- Core math ---
function simulate(
  currentAge: number,
  retirementAge: number,
  lifeExpectancy: number,
  currentSavings: number,
  monthlyContribution: number,
  annualReturn: number,
  inflationRate: number,
  desiredAnnualIncome: number,
  withdrawalRate: number,
): RetirementResult {
  const yearsToRetirement = retirementAge - currentAge
  const yearsInRetirement = lifeExpectancy - retirementAge
  const monthlyReturn = annualReturn / 100 / 12
  const monthlyInflation = inflationRate / 100 / 12

  // Accumulation phase
  const accumulation: YearRow[] = []
  let balance = currentSavings
  let totalContributed = currentSavings
  let totalGrowth = 0
  let inflationFactor = 1

  for (let i = 0; i < yearsToRetirement; i++) {
    const startBalance = balance
    let yearContribution = 0
    let yearGrowth = 0

    for (let m = 0; m < 12; m++) {
      const growth = balance * monthlyReturn
      balance += growth + monthlyContribution
      yearGrowth += growth
      yearContribution += monthlyContribution
      inflationFactor *= 1 + monthlyInflation
    }

    totalContributed += yearContribution
    totalGrowth += yearGrowth

    accumulation.push({
      age: currentAge + i + 1,
      year: i + 1,
      startBalance,
      contribution: yearContribution,
      growth: yearGrowth,
      endBalance: balance,
      inflationAdjusted: balance / inflationFactor,
    })
  }

  const totalAtRetirement = balance
  const totalAtRetirementReal = balance / inflationFactor

  // Withdrawal phase: use the withdrawal rate to determine sustainable income,
  // OR use the desired annual income (whichever the user focuses on)
  const sustainableIncome = totalAtRetirement * (withdrawalRate / 100)
  const annualRetirementIncome = sustainableIncome
  const annualRetirementIncomeReal = sustainableIncome / inflationFactor

  // Simulate withdrawal to find how long money lasts at desired income
  const withdrawal: YearRow[] = []
  let wBalance = totalAtRetirement
  let wInflationFactor = inflationFactor
  let yearsMoneyLasts = 0
  const annualWithdrawal = desiredAnnualIncome > 0 ? desiredAnnualIncome : sustainableIncome

  // During retirement, remaining balance still earns a lower return
  const retirementReturn = Math.max(annualReturn - 1, 2) / 100 / 12

  for (let i = 0; i < yearsInRetirement && wBalance > 0; i++) {
    const startBalance = wBalance
    let yearGrowth = 0
    let yearWithdrawal = 0
    const monthlyWithdrawal = annualWithdrawal / 12

    for (let m = 0; m < 12; m++) {
      const growth = wBalance * retirementReturn
      wBalance += growth - monthlyWithdrawal
      yearGrowth += growth
      yearWithdrawal += monthlyWithdrawal
      wInflationFactor *= 1 + monthlyInflation
      if (wBalance <= 0) {
        wBalance = 0
        break
      }
    }

    yearsMoneyLasts = i + 1

    withdrawal.push({
      age: retirementAge + i + 1,
      year: i + 1,
      startBalance,
      contribution: -yearWithdrawal,
      growth: yearGrowth,
      endBalance: Math.max(wBalance, 0),
      inflationAdjusted: Math.max(wBalance, 0) / wInflationFactor,
    })

    if (wBalance <= 0) break
  }

  const hasSurplus = yearsMoneyLasts >= yearsInRetirement
  const shortfall = hasSurplus ? 0 : (yearsInRetirement - yearsMoneyLasts) * annualWithdrawal

  // How much monthly contribution would be needed to reach the desired income
  // using the 4% rule: need desiredAnnualIncome / 0.04 at retirement
  const targetNest = desiredAnnualIncome > 0 ? desiredAnnualIncome / (withdrawalRate / 100) : 0
  const futureValueOfCurrentSavings =
    currentSavings * Math.pow(1 + annualReturn / 100 / 12, yearsToRetirement * 12)
  const shortfallAmount = Math.max(targetNest - futureValueOfCurrentSavings, 0)
  const monthlyNeeded =
    shortfallAmount > 0 && yearsToRetirement > 0
      ? (shortfallAmount * (annualReturn / 100 / 12)) /
        (Math.pow(1 + annualReturn / 100 / 12, yearsToRetirement * 12) - 1)
      : 0

  return {
    accumulation,
    withdrawal,
    totalAtRetirement,
    totalAtRetirementReal,
    totalContributed,
    totalGrowth,
    annualRetirementIncome,
    annualRetirementIncomeReal,
    yearsMoneyLasts,
    hasSurplus,
    shortfall,
    monthlyNeeded: Math.max(monthlyNeeded, 0),
  }
}

// --- Component ---
export default function RetirementCalculator() {
  const [currentAge, setCurrentAge] = useState("30")
  const [retirementAge, setRetirementAge] = useState("65")
  const [lifeExpectancy, setLifeExpectancy] = useState("90")
  const [currentSavings, setCurrentSavings] = useState("50000")
  const [monthlyContribution, setMonthlyContribution] = useState("500")
  const [annualReturn, setAnnualReturn] = useState("7")
  const [inflationRate, setInflationRate] = useState("3")
  const [desiredIncome, setDesiredIncome] = useState("60000")
  const [withdrawalRate, setWithdrawalRate] = useState("4")
  const [view, setView] = useState<"summary" | "accumulation" | "withdrawal">(
    "summary"
  )

  const result = useMemo(() => {
    const ca = Number(currentAge)
    const ra = Number(retirementAge)
    const le = Number(lifeExpectancy)
    const cs = Number(currentSavings)
    const mc = Number(monthlyContribution)
    const ar = Number(annualReturn)
    const ir = Number(inflationRate)
    const di = Number(desiredIncome)
    const wr = Number(withdrawalRate)

    if (
      isNaN(ca) || isNaN(ra) || isNaN(le) || isNaN(cs) || isNaN(mc) ||
      isNaN(ar) || isNaN(ir) || isNaN(di) || isNaN(wr) ||
      ca >= ra || ra >= le || ca < 18 || le > 120
    ) {
      return null
    }

    return simulate(ca, ra, le, cs, mc, ar, ir, di, wr)
  }, [currentAge, retirementAge, lifeExpectancy, currentSavings, monthlyContribution, annualReturn, inflationRate, desiredIncome, withdrawalRate])

  return (
    <div className="space-y-6">
      {/* Disclaimer */}
      <div className="rounded-lg border border-amber-300 bg-amber-500/5 p-3 text-sm text-amber-800 dark:border-amber-700 dark:text-amber-300">
        Estimates only. Not financial advice. Consult a qualified financial advisor for personalized retirement planning.
      </div>

      {/* Inputs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="current-age">Current Age</Label>
          <Input
            id="current-age"
            type="number"
            min={18}
            max={80}
            value={currentAge}
            onChange={(e) => setCurrentAge(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="retirement-age">Retirement Age</Label>
          <Input
            id="retirement-age"
            type="number"
            min={40}
            max={80}
            value={retirementAge}
            onChange={(e) => setRetirementAge(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="life-expectancy">Life Expectancy</Label>
          <Input
            id="life-expectancy"
            type="number"
            min={65}
            max={120}
            value={lifeExpectancy}
            onChange={(e) => setLifeExpectancy(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="current-savings">Current Retirement Savings ($)</Label>
          <Input
            id="current-savings"
            type="number"
            min={0}
            value={currentSavings}
            onChange={(e) => setCurrentSavings(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="monthly-contribution">Monthly Contribution ($)</Label>
          <Input
            id="monthly-contribution"
            type="number"
            min={0}
            value={monthlyContribution}
            onChange={(e) => setMonthlyContribution(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="desired-income">Desired Annual Retirement Income ($)</Label>
          <Input
            id="desired-income"
            type="number"
            min={0}
            value={desiredIncome}
            onChange={(e) => setDesiredIncome(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="annual-return">Expected Annual Return (%)</Label>
          <Input
            id="annual-return"
            type="number"
            min={0}
            max={20}
            step={0.1}
            value={annualReturn}
            onChange={(e) => setAnnualReturn(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="inflation-rate">Inflation Rate (%)</Label>
          <Input
            id="inflation-rate"
            type="number"
            min={0}
            max={15}
            step={0.1}
            value={inflationRate}
            onChange={(e) => setInflationRate(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="withdrawal-rate">Withdrawal Rate (%)</Label>
          <Input
            id="withdrawal-rate"
            type="number"
            min={1}
            max={10}
            step={0.1}
            value={withdrawalRate}
            onChange={(e) => setWithdrawalRate(e.target.value)}
          />
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
                  Nest Egg at Retirement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-primary">
                  {fmt(result.totalAtRetirement)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {fmt(result.totalAtRetirementReal)} in today&apos;s dollars
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Sustainable Annual Income
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  {fmt(result.annualRetirementIncome)}
                </p>
                <p className="text-xs text-muted-foreground">
                  at {withdrawalRate}% withdrawal rate ({fmt(result.annualRetirementIncome / 12)}/mo)
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Contributed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  {fmt(result.totalContributed)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {fmt(result.totalGrowth)} from investment growth
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Money Lasts Until Age
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className={`text-2xl font-bold ${result.hasSurplus ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                  {Number(retirementAge) + result.yearsMoneyLasts}
                </p>
                <p className="text-xs text-muted-foreground">
                  {result.hasSurplus
                    ? `Surplus through age ${lifeExpectancy}`
                    : `Runs out ${Number(lifeExpectancy) - Number(retirementAge) - result.yearsMoneyLasts} years early`}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Smart Insights */}
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="text-lg">Smart Insights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {result.hasSurplus ? (
                <p className="text-green-700 dark:text-green-300">
                  Your retirement savings are on track. At a {withdrawalRate}% withdrawal rate, your money will last through age {lifeExpectancy} with {fmt(result.withdrawal[result.withdrawal.length - 1]?.endBalance || 0)} remaining.
                </p>
              ) : (
                <p className="text-red-700 dark:text-red-300">
                  At your desired income of {fmt(Number(desiredIncome))}/year, your savings will run out {Number(lifeExpectancy) - Number(retirementAge) - result.yearsMoneyLasts} years before age {lifeExpectancy}. Consider increasing your monthly contribution to {fmt(result.monthlyNeeded)}/month to close the gap.
                </p>
              )}
              <p className="text-muted-foreground">
                Your investments will grow from {fmt(Number(currentSavings))} to {fmt(result.totalAtRetirement)} over {Number(retirementAge) - Number(currentAge)} years. Investment growth accounts for {fmtPct((result.totalGrowth / result.totalAtRetirement) * 100)} of your final balance, which shows the power of compound returns.
              </p>
              {Number(monthlyContribution) < result.monthlyNeeded && Number(desiredIncome) > 0 && (
                <p className="text-muted-foreground">
                  To generate {fmt(Number(desiredIncome))}/year using the {withdrawalRate}% rule, you would need {fmt(Number(desiredIncome) / (Number(withdrawalRate) / 100))} at retirement. That requires saving roughly {fmt(result.monthlyNeeded)}/month (you currently save {fmt(Number(monthlyContribution))}/month).
                </p>
              )}
            </CardContent>
          </Card>

          {/* Tabs for schedule */}
          <Tabs
            value={view}
            onValueChange={(v) => setView(v as typeof view)}
          >
            <TabsList>
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="accumulation">
                Savings Growth ({result.accumulation.length} yr)
              </TabsTrigger>
              <TabsTrigger value="withdrawal">
                Withdrawal ({result.withdrawal.length} yr)
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Savings Growth Visualization */}
          {view === "summary" && (
            <div className="space-y-3">
              <h3 className="font-semibold">Savings Growth Over Time</h3>
              <div className="space-y-2">
                {result.accumulation
                  .filter((_, i) => i % 5 === 4 || i === result.accumulation.length - 1)
                  .map((row) => {
                    const maxBalance = result.totalAtRetirement
                    const pct = (row.endBalance / maxBalance) * 100
                    return (
                      <div key={row.age} className="flex items-center gap-3 text-sm">
                        <span className="w-14 shrink-0 text-muted-foreground">
                          Age {row.age}
                        </span>
                        <div className="flex-1">
                          <div
                            className="h-6 rounded bg-primary/20"
                            style={{ width: `${Math.max(pct, 1)}%` }}
                          >
                            <div
                              className="h-full rounded bg-primary"
                              style={{
                                width: `${((row.endBalance - row.growth * (row.year)) / row.endBalance) * 100}%`,
                                minWidth: "2px",
                              }}
                            />
                          </div>
                        </div>
                        <span className="w-24 shrink-0 text-right font-medium">
                          {fmt(row.endBalance)}
                        </span>
                      </div>
                    )
                  })}
              </div>
              <div className="flex gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <span className="inline-block h-3 w-3 rounded bg-primary" /> Contributions
                </span>
                <span className="flex items-center gap-1">
                  <span className="inline-block h-3 w-3 rounded bg-primary/20" /> Growth
                </span>
              </div>
            </div>
          )}

          {/* Accumulation Table */}
          {view === "accumulation" && (
            <div className="overflow-x-auto rounded-xl border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="px-3 py-2 text-left font-semibold">Age</th>
                    <th className="px-3 py-2 text-right font-semibold">Start Balance</th>
                    <th className="px-3 py-2 text-right font-semibold">Contributions</th>
                    <th className="px-3 py-2 text-right font-semibold">Growth</th>
                    <th className="px-3 py-2 text-right font-semibold">End Balance</th>
                    <th className="px-3 py-2 text-right font-semibold">Today&apos;s Dollars</th>
                  </tr>
                </thead>
                <tbody>
                  {result.accumulation.map((row) => (
                    <tr key={row.age} className="border-b last:border-0 even:bg-muted/20">
                      <td className="px-3 py-2">{row.age}</td>
                      <td className="px-3 py-2 text-right">{fmt(row.startBalance)}</td>
                      <td className="px-3 py-2 text-right">{fmt(row.contribution)}</td>
                      <td className="px-3 py-2 text-right text-green-600 dark:text-green-400">
                        +{fmt(row.growth)}
                      </td>
                      <td className="px-3 py-2 text-right font-medium">{fmt(row.endBalance)}</td>
                      <td className="px-3 py-2 text-right text-muted-foreground">
                        {fmt(row.inflationAdjusted)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Withdrawal Table */}
          {view === "withdrawal" && (
            <div className="overflow-x-auto rounded-xl border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="px-3 py-2 text-left font-semibold">Age</th>
                    <th className="px-3 py-2 text-right font-semibold">Start Balance</th>
                    <th className="px-3 py-2 text-right font-semibold">Withdrawal</th>
                    <th className="px-3 py-2 text-right font-semibold">Growth</th>
                    <th className="px-3 py-2 text-right font-semibold">End Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {result.withdrawal.map((row) => (
                    <tr
                      key={row.age}
                      className={`border-b last:border-0 even:bg-muted/20 ${row.endBalance === 0 ? "bg-red-50 dark:bg-red-950/20" : ""}`}
                    >
                      <td className="px-3 py-2">{row.age}</td>
                      <td className="px-3 py-2 text-right">{fmt(row.startBalance)}</td>
                      <td className="px-3 py-2 text-right text-red-600 dark:text-red-400">
                        {fmt(row.contribution)}
                      </td>
                      <td className="px-3 py-2 text-right text-green-600 dark:text-green-400">
                        +{fmt(row.growth)}
                      </td>
                      <td className="px-3 py-2 text-right font-medium">{fmt(row.endBalance)}</td>
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
          Enter valid values above. Current age must be less than retirement age, which must be less than life expectancy.
        </div>
      )}
    </div>
  )
}
