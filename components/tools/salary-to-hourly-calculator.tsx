"use client"

import { useMemo, useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

type Mode = "salaryToHourly" | "hourlyToSalary"

// --- Formatting ---
const fmtMoney = (n: number) =>
  n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })

const fmtMoneyFull = (n: number) =>
  n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

const fmtNum = (n: number) =>
  n.toLocaleString("en-US", { maximumFractionDigits: 1 })

// --- Core math ---
interface CalcInputs {
  annualSalary: number
  hourlyRate: number
  hoursPerWeek: number
  ptoDays: number
  holidayDays: number
  otHoursPerWeek: number
  otMultiplier: number
  mode: Mode
}

interface CalcResult {
  annual: number
  monthly: number
  biweekly: number
  weekly: number
  daily: number
  hourly: number
  trueHourly: number // adjusted for PTO + holidays
  workingWeeks: number
  workingHours: number
  regularHoursPerYear: number
  otHoursPerYear: number
  otPayPerYear: number
  totalAnnualWithOt: number
  totalHoursWithOt: number
}

function calculate({
  annualSalary,
  hourlyRate,
  hoursPerWeek,
  ptoDays,
  holidayDays,
  otHoursPerWeek,
  otMultiplier,
  mode,
}: CalcInputs): CalcResult {
  const hpw = Math.max(0, hoursPerWeek)
  const workingDaysPerWeek = hpw > 0 ? Math.min(5, hpw / 8) : 5
  const offWeeks =
    workingDaysPerWeek > 0
      ? (ptoDays + holidayDays) / workingDaysPerWeek
      : 0
  const workingWeeks = Math.max(0, 52 - offWeeks)
  const workingHours = workingWeeks * hpw

  // Compute base annual either from salary input or from hourly × standard
  // 52-week hours. The "standard" hourly view assumes 52 paid weeks (vacation
  // and holidays are paid), which matches how annual salaries convert back
  // to hourly for a typical US salaried employee.
  const standardHoursPerYear = 52 * hpw
  let baseAnnual: number
  let baseHourly: number
  if (mode === "salaryToHourly") {
    baseAnnual = Math.max(0, annualSalary)
    baseHourly = standardHoursPerYear > 0 ? baseAnnual / standardHoursPerYear : 0
  } else {
    baseHourly = Math.max(0, hourlyRate)
    baseAnnual = baseHourly * standardHoursPerYear
  }

  // Overtime adds on top (only meaningful for hourly workers, but the math
  // still holds for salaried folks wondering about side overtime shifts).
  const otHoursPerYear = Math.max(0, otHoursPerWeek) * workingWeeks
  const otPayPerYear = otHoursPerYear * baseHourly * Math.max(0, otMultiplier)

  const totalAnnualWithOt = baseAnnual + otPayPerYear
  const totalHoursWithOt = workingHours + otHoursPerYear

  // True hourly rate: annual salary divided by hours actually worked
  // (PTO and holidays are paid but not worked, so the real $/hour is higher).
  const trueHourly = workingHours > 0 ? baseAnnual / workingHours : 0

  // Daily is based on an 8-hour work day
  const daily = baseHourly * 8

  return {
    annual: baseAnnual,
    monthly: baseAnnual / 12,
    biweekly: baseAnnual / 26,
    weekly: baseAnnual / 52,
    daily,
    hourly: baseHourly,
    trueHourly,
    workingWeeks,
    workingHours,
    regularHoursPerYear: workingHours,
    otHoursPerYear,
    otPayPerYear,
    totalAnnualWithOt,
    totalHoursWithOt,
  }
}

// --- Number input helper (lets user clear/retype without snapping to 0) ---
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

const HOURS_PRESETS = [20, 25, 30, 32, 35, 37.5, 40, 45, 50]

// ---------------- MAIN COMPONENT ----------------
export default function SalaryToHourlyCalculator() {
  const [mode, setMode] = useState<Mode>("salaryToHourly")
  const [annualSalary, setAnnualSalary] = useState(75000)
  const [hourlyRate, setHourlyRate] = useState(36)
  const [hoursPerWeek, setHoursPerWeek] = useState(40)
  const [ptoDays, setPtoDays] = useState(10)
  const [holidayDays, setHolidayDays] = useState(10)
  const [includeOt, setIncludeOt] = useState(false)
  const [otHoursPerWeek, setOtHoursPerWeek] = useState(0)
  const [otMultiplier, setOtMultiplier] = useState(1.5)

  const result = useMemo(
    () =>
      calculate({
        annualSalary,
        hourlyRate,
        hoursPerWeek,
        ptoDays,
        holidayDays,
        otHoursPerWeek: includeOt ? otHoursPerWeek : 0,
        otMultiplier,
        mode,
      }),
    [
      annualSalary,
      hourlyRate,
      hoursPerWeek,
      ptoDays,
      holidayDays,
      includeOt,
      otHoursPerWeek,
      otMultiplier,
      mode,
    ]
  )

  const trueHourlyBoost =
    result.hourly > 0
      ? ((result.trueHourly - result.hourly) / result.hourly) * 100
      : 0

  return (
    <div className="space-y-6">
      {/* MODE TABS */}
      <Tabs value={mode} onValueChange={(v) => setMode(v as Mode)}>
        <TabsList className="grid w-full grid-cols-2 sm:w-[420px]">
          <TabsTrigger value="salaryToHourly">Salary to Hourly</TabsTrigger>
          <TabsTrigger value="hourlyToSalary">Hourly to Salary</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* INPUTS */}
      <Card>
        <CardHeader>
          <CardTitle>Your Pay Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            {mode === "salaryToHourly" ? (
              <div className="space-y-1.5">
                <Label htmlFor="annual">Annual Salary</Label>
                <NumberInput
                  id="annual"
                  value={annualSalary}
                  onChange={setAnnualSalary}
                  step="1000"
                  placeholder="75000"
                />
              </div>
            ) : (
              <div className="space-y-1.5">
                <Label htmlFor="hourly">Hourly Rate</Label>
                <NumberInput
                  id="hourly"
                  value={hourlyRate}
                  onChange={setHourlyRate}
                  step="0.25"
                  placeholder="36"
                />
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="hpw">Hours per Week</Label>
              <NumberInput
                id="hpw"
                value={hoursPerWeek}
                onChange={setHoursPerWeek}
                step="0.5"
              />
              <div className="flex flex-wrap gap-1.5 pt-1">
                {HOURS_PRESETS.map((h) => (
                  <button
                    key={h}
                    type="button"
                    onClick={() => setHoursPerWeek(h)}
                    className={`rounded-full border px-2.5 py-0.5 text-xs transition ${
                      hoursPerWeek === h
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    {h}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="pto">PTO / Vacation Days</Label>
              <NumberInput
                id="pto"
                value={ptoDays}
                onChange={setPtoDays}
                step="1"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="holidays">Paid Holidays</Label>
              <NumberInput
                id="holidays"
                value={holidayDays}
                onChange={setHolidayDays}
                step="1"
              />
            </div>
          </div>

          {/* Overtime section */}
          <div className="space-y-3 rounded-xl border bg-muted/30 p-4">
            <label className="flex items-center gap-2 text-sm font-medium">
              <input
                type="checkbox"
                checked={includeOt}
                onChange={(e) => setIncludeOt(e.target.checked)}
                className="h-4 w-4 accent-primary"
              />
              Include overtime hours
            </label>
            {includeOt && (
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="otHours">Overtime Hours per Week</Label>
                  <NumberInput
                    id="otHours"
                    value={otHoursPerWeek}
                    onChange={setOtHoursPerWeek}
                    step="0.5"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="otMult">OT Rate Multiplier</Label>
                  <NumberInput
                    id="otMult"
                    value={otMultiplier}
                    onChange={setOtMultiplier}
                    step="0.1"
                  />
                  <div className="flex gap-1.5">
                    {[1.5, 2].map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setOtMultiplier(m)}
                        className={`rounded-full border px-2.5 py-0.5 text-xs transition ${
                          otMultiplier === m
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border text-muted-foreground hover:bg-muted"
                        }`}
                      >
                        {m === 1.5 ? "1.5x (time and a half)" : "2x (double)"}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* ALL PAY FREQUENCIES */}
      <Card>
        <CardHeader>
          <CardTitle>Your Pay at Every Frequency</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <PayCell label="Annual" value={fmtMoney(result.annual)} highlight />
            <PayCell label="Monthly" value={fmtMoney(result.monthly)} />
            <PayCell
              label="Bi-Weekly"
              value={fmtMoney(result.biweekly)}
              sub="26 paychecks/year"
            />
            <PayCell label="Weekly" value={fmtMoney(result.weekly)} />
            <PayCell
              label="Daily"
              value={fmtMoney(result.daily)}
              sub="8-hour day"
            />
            <PayCell
              label="Hourly"
              value={fmtMoneyFull(result.hourly)}
              sub={`${fmtNum(52 * hoursPerWeek)} paid hours/year`}
            />
          </div>
        </CardContent>
      </Card>

      {/* TRUE HOURLY + OVERTIME */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>True Hourly Rate</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p className="text-muted-foreground">
              Your &ldquo;true&rdquo; hourly rate accounts for PTO and paid
              holidays. Since you&rsquo;re getting paid during time off, each
              hour you actually work is worth more than the basic annual
              divided by 52 weeks.
            </p>
            <div className="mt-3 rounded-xl border bg-primary/10 p-4 ring-1 ring-primary/30">
              <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                True $/hour worked
              </div>
              <div className="mt-1 font-heading text-3xl font-semibold tabular-nums">
                {fmtMoneyFull(result.trueHourly)}
              </div>
              {trueHourlyBoost > 0 && (
                <div className="mt-1 text-xs text-muted-foreground">
                  That is {trueHourlyBoost.toFixed(1)}% higher than your
                  standard hourly, because {ptoDays + holidayDays} paid days
                  off make each working hour more valuable.
                </div>
              )}
            </div>
            <div className="space-y-1 pt-2 text-xs text-muted-foreground">
              <Row
                label="Paid weeks per year"
                value="52"
              />
              <Row
                label="Actual working weeks"
                value={fmtNum(result.workingWeeks)}
              />
              <Row
                label="Actual working hours"
                value={`${fmtNum(result.workingHours)} hrs`}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              {includeOt && otHoursPerWeek > 0
                ? "With Overtime"
                : "Overtime Estimator"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {includeOt && otHoursPerWeek > 0 ? (
              <>
                <Row
                  label={`OT hours/year (${otHoursPerWeek}/wk)`}
                  value={`${fmtNum(result.otHoursPerYear)} hrs`}
                />
                <Row
                  label="OT pay rate"
                  value={fmtMoneyFull(result.hourly * otMultiplier)}
                />
                <Row
                  label="Total OT pay/year"
                  value={fmtMoney(result.otPayPerYear)}
                  bold
                />
                <div className="my-2 border-t" />
                <Row
                  label="Base annual"
                  value={fmtMoney(result.annual)}
                />
                <Row
                  label="+ Overtime"
                  value={fmtMoney(result.otPayPerYear)}
                />
                <Row
                  label="Total annual"
                  value={fmtMoney(result.totalAnnualWithOt)}
                  bold
                />
                <Row
                  label="Total hours/year"
                  value={`${fmtNum(result.totalHoursWithOt)} hrs`}
                  muted
                />
              </>
            ) : (
              <p className="text-muted-foreground">
                Check the &ldquo;Include overtime hours&rdquo; box above to
                estimate how much extra weekly hours at time-and-a-half or
                double time would add to your annual pay.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* DISCLAIMER */}
      <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 text-xs text-muted-foreground">
        <strong className="text-foreground">Estimates only.</strong> This
        calculator does not account for payroll taxes, health insurance, 401(k)
        contributions, or bonuses. Your actual take-home pay will be lower
        than the numbers shown here. To estimate taxes and take-home pay, use
        the Income Tax Calculator.
      </div>
    </div>
  )
}

// --- Subcomponents ---
function PayCell({
  label,
  value,
  sub,
  highlight,
}: {
  label: string
  value: string
  sub?: string
  highlight?: boolean
}) {
  return (
    <div
      className={`rounded-2xl border p-4 ${
        highlight ? "bg-primary/10 ring-1 ring-primary/30" : "bg-card"
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
