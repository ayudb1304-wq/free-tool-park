"use client"

import { useMemo, useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

// --- Constants ---
const CONTRIBUTION_LIMIT_2026 = 23500
const CATCHUP_LIMIT_2026 = 7500
const SUPER_CATCHUP_LIMIT_2026 = 11250 // Ages 60-63 (SECURE 2.0)

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
  salary: number
  employeeContrib: number
  employerContrib: number
  growth: number
  endBalance: number
  inflationAdjusted: number
}

interface Result401k {
  schedule: YearRow[]
  balanceAtRetirement: number
  balanceAtRetirementReal: number
  totalEmployeeContrib: number
  totalEmployerContrib: number
  totalGrowth: number
  effectiveMatchPct: number
  annualIncomeAt4Pct: number
  annualIncomeAt4PctReal: number
  taxSavingsPerYear: number
}

// --- Core math ---
function simulate401k(
  currentAge: number,
  retirementAge: number,
  currentBalance: number,
  annualSalary: number,
  employeePct: number,
  employerMatchPct: number,
  employerMatchLimit: number,
  annualReturn: number,
  salaryIncrease: number,
  inflationRate: number,
  taxBracket: number,
): Result401k {
  const years = retirementAge - currentAge
  const monthlyReturn = annualReturn / 100 / 12
  const schedule: YearRow[] = []

  let balance = currentBalance
  let salary = annualSalary
  let totalEmployeeContrib = 0
  let totalEmployerContrib = 0
  let totalGrowth = 0
  let inflationFactor = 1

  for (let i = 0; i < years; i++) {
    const age = currentAge + i
    // Determine annual contribution limit based on age
    let annualLimit = CONTRIBUTION_LIMIT_2026
    if (age >= 60 && age <= 63) {
      annualLimit += SUPER_CATCHUP_LIMIT_2026
    } else if (age >= 50) {
      annualLimit += CATCHUP_LIMIT_2026
    }

    // Employee contribution (capped at IRS limit)
    const rawEmployeeContrib = salary * (employeePct / 100)
    const employeeContrib = Math.min(rawEmployeeContrib, annualLimit)

    // Employer match: match X% of salary up to Y% of salary
    const matchableSalary = salary * (employerMatchLimit / 100)
    const employerContrib = Math.min(
      matchableSalary,
      salary * (employeePct / 100),
    ) * (employerMatchPct / 100)

    // Monthly simulation for compound growth
    const monthlyEmployee = employeeContrib / 12
    const monthlyEmployer = employerContrib / 12
    let yearGrowth = 0

    for (let m = 0; m < 12; m++) {
      const growth = balance * monthlyReturn
      balance += growth + monthlyEmployee + monthlyEmployer
      yearGrowth += growth
      inflationFactor *= 1 + inflationRate / 100 / 12
    }

    totalEmployeeContrib += employeeContrib
    totalEmployerContrib += employerContrib
    totalGrowth += yearGrowth

    schedule.push({
      age: age + 1,
      year: i + 1,
      salary,
      employeeContrib,
      employerContrib,
      growth: yearGrowth,
      endBalance: balance,
      inflationAdjusted: balance / inflationFactor,
    })

    // Salary increases for next year
    salary *= 1 + salaryIncrease / 100
  }

  const effectiveMatchPct =
    totalEmployerContrib > 0 && totalEmployeeContrib > 0
      ? (totalEmployerContrib / totalEmployeeContrib) * 100
      : 0

  const taxSavingsPerYear = annualSalary * (employeePct / 100) * (taxBracket / 100)

  return {
    schedule,
    balanceAtRetirement: balance,
    balanceAtRetirementReal: balance / inflationFactor,
    totalEmployeeContrib,
    totalEmployerContrib,
    totalGrowth,
    effectiveMatchPct,
    annualIncomeAt4Pct: balance * 0.04,
    annualIncomeAt4PctReal: (balance / inflationFactor) * 0.04,
    taxSavingsPerYear,
  }
}

// --- Component ---
export default function FourOhOneKCalculator() {
  const [currentAge, setCurrentAge] = useState("30")
  const [retirementAge, setRetirementAge] = useState("65")
  const [currentBalance, setCurrentBalance] = useState("25000")
  const [annualSalary, setAnnualSalary] = useState("75000")
  const [employeePct, setEmployeePct] = useState("10")
  const [employerMatchPct, setEmployerMatchPct] = useState("50")
  const [employerMatchLimit, setEmployerMatchLimit] = useState("6")
  const [annualReturn, setAnnualReturn] = useState("7")
  const [salaryIncrease, setSalaryIncrease] = useState("3")
  const [inflationRate, setInflationRate] = useState("3")
  const [taxBracket, setTaxBracket] = useState("22")
  const [view, setView] = useState<"summary" | "schedule">("summary")

  const result = useMemo(() => {
    const ca = Number(currentAge)
    const ra = Number(retirementAge)
    const cb = Number(currentBalance)
    const as = Number(annualSalary)
    const ep = Number(employeePct)
    const emp = Number(employerMatchPct)
    const eml = Number(employerMatchLimit)
    const ar = Number(annualReturn)
    const si = Number(salaryIncrease)
    const ir = Number(inflationRate)
    const tb = Number(taxBracket)

    if (
      [ca, ra, cb, as, ep, emp, eml, ar, si, ir, tb].some(isNaN) ||
      ca >= ra ||
      ca < 18 ||
      ra > 80 ||
      as <= 0
    ) {
      return null
    }

    return simulate401k(ca, ra, cb, as, ep, emp, eml, ar, si, ir, tb)
  }, [currentAge, retirementAge, currentBalance, annualSalary, employeePct, employerMatchPct, employerMatchLimit, annualReturn, salaryIncrease, inflationRate, taxBracket])

  return (
    <div className="space-y-6">
      {/* Disclaimer */}
      <div className="rounded-lg border border-amber-300 bg-amber-500/5 p-3 text-sm text-amber-800 dark:border-amber-700 dark:text-amber-300">
        Estimates only. Not financial advice. 2026 IRS contribution limits used ($23,500 base, $7,500 catch-up for 50+, $11,250 super catch-up for ages 60 to 63). Consult a financial advisor for personalized guidance.
      </div>

      {/* Inputs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="401k-current-age">Current Age</Label>
          <Input id="401k-current-age" type="number" min={18} max={79} value={currentAge} onChange={(e) => setCurrentAge(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="401k-retirement-age">Retirement Age</Label>
          <Input id="401k-retirement-age" type="number" min={40} max={80} value={retirementAge} onChange={(e) => setRetirementAge(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="401k-current-balance">Current 401(k) Balance ($)</Label>
          <Input id="401k-current-balance" type="number" min={0} value={currentBalance} onChange={(e) => setCurrentBalance(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="401k-annual-salary">Annual Salary ($)</Label>
          <Input id="401k-annual-salary" type="number" min={1} value={annualSalary} onChange={(e) => setAnnualSalary(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="401k-employee-pct">Your Contribution (%)</Label>
          <Input id="401k-employee-pct" type="number" min={0} max={100} step={0.5} value={employeePct} onChange={(e) => setEmployeePct(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="401k-employer-match-pct">Employer Match Rate (%)</Label>
          <Input id="401k-employer-match-pct" type="number" min={0} max={200} step={1} value={employerMatchPct} onChange={(e) => setEmployerMatchPct(e.target.value)} />
          <p className="text-xs text-muted-foreground">e.g. 50 means employer matches 50 cents per dollar</p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="401k-employer-match-limit">Employer Match Limit (% of salary)</Label>
          <Input id="401k-employer-match-limit" type="number" min={0} max={100} step={0.5} value={employerMatchLimit} onChange={(e) => setEmployerMatchLimit(e.target.value)} />
          <p className="text-xs text-muted-foreground">Employer matches up to this % of your salary</p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="401k-annual-return">Expected Annual Return (%)</Label>
          <Input id="401k-annual-return" type="number" min={0} max={20} step={0.1} value={annualReturn} onChange={(e) => setAnnualReturn(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="401k-salary-increase">Annual Salary Increase (%)</Label>
          <Input id="401k-salary-increase" type="number" min={0} max={20} step={0.1} value={salaryIncrease} onChange={(e) => setSalaryIncrease(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="401k-inflation-rate">Inflation Rate (%)</Label>
          <Input id="401k-inflation-rate" type="number" min={0} max={15} step={0.1} value={inflationRate} onChange={(e) => setInflationRate(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="401k-tax-bracket">Federal Tax Bracket (%)</Label>
          <Input id="401k-tax-bracket" type="number" min={0} max={50} step={1} value={taxBracket} onChange={(e) => setTaxBracket(e.target.value)} />
          <p className="text-xs text-muted-foreground">Used to estimate annual tax savings from contributions</p>
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
                  Balance at Retirement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-primary">
                  {fmt(result.balanceAtRetirement)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {fmt(result.balanceAtRetirementReal)} in today&apos;s dollars
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Your Total Contributions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  {fmt(result.totalEmployeeContrib)}
                </p>
                <p className="text-xs text-muted-foreground">
                  + {fmt(result.totalEmployerContrib)} from employer
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Investment Growth
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {fmt(result.totalGrowth)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {fmtPct((result.totalGrowth / result.balanceAtRetirement) * 100)} of final balance
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Retirement Income (4% Rule)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  {fmt(result.annualIncomeAt4Pct)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {fmt(result.annualIncomeAt4PctReal)}/yr in today&apos;s dollars
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
              <p className="text-muted-foreground">
                Over {Number(retirementAge) - Number(currentAge)} years, your 401(k) will grow from {fmt(Number(currentBalance))} to {fmt(result.balanceAtRetirement)}. You contribute {fmt(result.totalEmployeeContrib)} and your employer adds {fmt(result.totalEmployerContrib)} in matching funds (an effective {fmtPct(result.effectiveMatchPct)} match on your contributions).
              </p>
              {Number(employeePct) < Number(employerMatchLimit) && (
                <p className="text-amber-700 dark:text-amber-300">
                  You are contributing {employeePct}% of your salary, but your employer matches up to {employerMatchLimit}%. By increasing your contribution to at least {employerMatchLimit}%, you would capture the full employer match. Leaving match money on the table is like turning down free money.
                </p>
              )}
              {Number(employeePct) >= Number(employerMatchLimit) && (
                <p className="text-green-700 dark:text-green-300">
                  You are contributing enough to capture your full employer match. That is the most important first step in 401(k) planning.
                </p>
              )}
              <p className="text-muted-foreground">
                Your traditional 401(k) contributions save you approximately {fmt(result.taxSavingsPerYear)} per year in federal taxes at the {taxBracket}% bracket. Over {Number(retirementAge) - Number(currentAge)} years, that is roughly {fmt(result.taxSavingsPerYear * (Number(retirementAge) - Number(currentAge)))} in tax deferral.
              </p>
              <p className="text-muted-foreground">
                Investment growth accounts for {fmtPct((result.totalGrowth / result.balanceAtRetirement) * 100)} of your final balance, demonstrating the power of compound returns over time.
              </p>
            </CardContent>
          </Card>

          {/* Tabs */}
          <Tabs value={view} onValueChange={(v) => setView(v as typeof view)}>
            <TabsList>
              <TabsTrigger value="summary">Growth Chart</TabsTrigger>
              <TabsTrigger value="schedule">
                Year-by-Year ({result.schedule.length} yr)
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Growth visualization */}
          {view === "summary" && (
            <div className="space-y-3">
              <h3 className="font-semibold">401(k) Growth Over Time</h3>
              <div className="space-y-2">
                {result.schedule
                  .filter((_, i) => i % 5 === 4 || i === result.schedule.length - 1)
                  .map((row) => {
                    const maxBalance = result.balanceAtRetirement
                    const pct = (row.endBalance / maxBalance) * 100
                    const contribPct =
                      ((result.totalEmployeeContrib + result.totalEmployerContrib) /
                        result.balanceAtRetirement) *
                      100
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
                                width: `${Math.min(contribPct, 100)}%`,
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

          {/* Year-by-year table */}
          {view === "schedule" && (
            <div className="overflow-x-auto rounded-xl border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="px-3 py-2 text-left font-semibold">Age</th>
                    <th className="px-3 py-2 text-right font-semibold">Salary</th>
                    <th className="px-3 py-2 text-right font-semibold">Your Contrib</th>
                    <th className="px-3 py-2 text-right font-semibold">Employer</th>
                    <th className="px-3 py-2 text-right font-semibold">Growth</th>
                    <th className="px-3 py-2 text-right font-semibold">Balance</th>
                    <th className="px-3 py-2 text-right font-semibold">Today&apos;s $</th>
                  </tr>
                </thead>
                <tbody>
                  {result.schedule.map((row) => (
                    <tr key={row.age} className="border-b last:border-0 even:bg-muted/20">
                      <td className="px-3 py-2">{row.age}</td>
                      <td className="px-3 py-2 text-right">{fmt(row.salary)}</td>
                      <td className="px-3 py-2 text-right">{fmt(row.employeeContrib)}</td>
                      <td className="px-3 py-2 text-right text-blue-600 dark:text-blue-400">
                        +{fmt(row.employerContrib)}
                      </td>
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
        </>
      )}

      {!result && (
        <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
          Enter valid values above. Current age must be less than retirement age.
        </div>
      )}
    </div>
  )
}
