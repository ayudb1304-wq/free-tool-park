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

// --- Types ---
type Gender = "male" | "female"
type UnitSystem = "metric" | "imperial"
type Activity = "sedentary" | "light" | "moderate" | "active" | "very-active"
type Goal = "cut" | "maintain" | "bulk"
type DietPreset = "balanced" | "low-carb" | "high-protein" | "keto" | "paleo" | "iifym"

// --- Constants ---
const ACTIVITY_LEVELS: { key: Activity; label: string; factor: number }[] = [
  { key: "sedentary", label: "Sedentary (little or no exercise)", factor: 1.2 },
  { key: "light", label: "Lightly active (1 to 3 days/week)", factor: 1.375 },
  { key: "moderate", label: "Moderately active (3 to 5 days/week)", factor: 1.55 },
  { key: "active", label: "Very active (6 to 7 days/week)", factor: 1.725 },
  { key: "very-active", label: "Extra active (athlete / physical job)", factor: 1.9 },
]

const GOALS: { key: Goal; label: string; adjustment: number; desc: string }[] = [
  { key: "cut", label: "Cut (lose fat)", adjustment: -500, desc: "500 cal deficit" },
  { key: "maintain", label: "Maintain", adjustment: 0, desc: "Stay at current weight" },
  { key: "bulk", label: "Bulk (build muscle)", adjustment: 500, desc: "500 cal surplus" },
]

// Macro splits as percentage of total calories: [protein, carbs, fat]
const DIET_PRESETS: {
  key: DietPreset
  label: string
  protein: number
  carbs: number
  fat: number
  desc: string
}[] = [
  { key: "balanced", label: "Balanced", protein: 30, carbs: 40, fat: 30, desc: "30/40/30 split, works for most people" },
  { key: "high-protein", label: "High Protein", protein: 40, carbs: 30, fat: 30, desc: "40/30/30 split, for muscle building" },
  { key: "low-carb", label: "Low Carb", protein: 35, carbs: 20, fat: 45, desc: "35/20/45 split, reduced carbohydrate intake" },
  { key: "keto", label: "Keto", protein: 20, carbs: 5, fat: 75, desc: "20/5/75 split, very low carb, high fat" },
  { key: "paleo", label: "Paleo", protein: 35, carbs: 25, fat: 40, desc: "35/25/40 split, whole foods emphasis" },
  { key: "iifym", label: "IIFYM (Custom)", protein: 30, carbs: 40, fat: 30, desc: "Set your own percentages" },
]

const MEAL_COUNTS = [2, 3, 4, 5, 6] as const

// --- Formatting ---
const fmtCal = (n: number) => `${Math.round(n).toLocaleString("en-US")} cal`
const fmtG = (n: number) => `${Math.round(n)}g`

// --- Number input helper ---
function NumberInput({
  value,
  onChange,
  placeholder,
  id,
  step = "1",
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

// --- BMR calculation (Mifflin-St Jeor) ---
function calcBMR(gender: Gender, weightKg: number, heightCm: number, age: number): number {
  if (gender === "male") return 10 * weightKg + 6.25 * heightCm - 5 * age + 5
  return 10 * weightKg + 6.25 * heightCm - 5 * age - 161
}

// --- Macro results ---
interface MacroResult {
  bmr: number
  tdee: number
  targetCalories: number
  proteinG: number
  carbsG: number
  fatG: number
  proteinCal: number
  carbsCal: number
  fatCal: number
  proteinPct: number
  carbsPct: number
  fatPct: number
}

function calcMacros(
  bmr: number,
  activityFactor: number,
  goalAdj: number,
  proteinPct: number,
  carbsPct: number,
  fatPct: number
): MacroResult {
  const tdee = Math.round(bmr * activityFactor)
  const targetCalories = Math.max(1200, tdee + goalAdj)

  const proteinCal = targetCalories * (proteinPct / 100)
  const carbsCal = targetCalories * (carbsPct / 100)
  const fatCal = targetCalories * (fatPct / 100)

  // Protein: 4 cal/g, Carbs: 4 cal/g, Fat: 9 cal/g
  const proteinG = proteinCal / 4
  const carbsG = carbsCal / 4
  const fatG = fatCal / 9

  return {
    bmr,
    tdee,
    targetCalories,
    proteinG,
    carbsG,
    fatG,
    proteinCal,
    carbsCal,
    fatCal,
    proteinPct,
    carbsPct,
    fatPct,
  }
}

// ---------------- MAIN COMPONENT ----------------
export default function MacroCalculator() {
  const [mode, setMode] = useState<"calculator" | "meals">("calculator")

  // Body stats
  const [gender, setGender] = useState<Gender>("male")
  const [unit, setUnit] = useState<UnitSystem>("imperial")
  const [age, setAge] = useState(30)
  const [weight, setWeight] = useState(170)
  const [height, setHeight] = useState(69)
  const [activity, setActivity] = useState<Activity>("moderate")

  // Goal and diet
  const [goal, setGoal] = useState<Goal>("maintain")
  const [dietPreset, setDietPreset] = useState<DietPreset>("balanced")
  const [customProtein, setCustomProtein] = useState(30)
  const [customCarbs, setCustomCarbs] = useState(40)
  const [customFat, setCustomFat] = useState(30)

  // Meals
  const [mealCount, setMealCount] = useState(3)

  // Unit conversions
  const weightKg = unit === "imperial" ? weight * 0.453592 : weight
  const heightCm = unit === "imperial" ? height * 2.54 : height

  const bmr = calcBMR(gender, weightKg, heightCm, age)
  const activityFactor =
    ACTIVITY_LEVELS.find((a) => a.key === activity)?.factor ?? 1.55
  const goalAdj = GOALS.find((g) => g.key === goal)?.adjustment ?? 0

  // Get macro percentages from preset or custom
  const preset = DIET_PRESETS.find((d) => d.key === dietPreset)
  const isCustom = dietPreset === "iifym"
  const proteinPct = isCustom ? customProtein : (preset?.protein ?? 30)
  const carbsPct = isCustom ? customCarbs : (preset?.carbs ?? 40)
  const fatPct = isCustom ? customFat : (preset?.fat ?? 30)
  const totalPct = proteinPct + carbsPct + fatPct

  const result = useMemo(
    () => calcMacros(bmr, activityFactor, goalAdj, proteinPct, carbsPct, fatPct),
    [bmr, activityFactor, goalAdj, proteinPct, carbsPct, fatPct]
  )

  const isValid = age > 0 && weight > 0 && height > 0

  return (
    <div className="space-y-6">
      <Tabs value={mode} onValueChange={(v) => setMode(v as "calculator" | "meals")}>
        <TabsList className="grid w-full grid-cols-2 sm:w-[360px]">
          <TabsTrigger value="calculator">Calculator</TabsTrigger>
          <TabsTrigger value="meals">Meal Breakdown</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Body stats (shared across both tabs) */}
      <Card>
        <CardHeader>
          <CardTitle>Your Stats</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={unit === "imperial" ? "default" : "secondary"}
              size="sm"
              onClick={() => {
                if (unit !== "imperial") {
                  setWeight(Math.round(weight * 2.20462))
                  setHeight(Math.round(height / 2.54))
                  setUnit("imperial")
                }
              }}
            >
              Imperial (lb/in)
            </Button>
            <Button
              variant={unit === "metric" ? "default" : "secondary"}
              size="sm"
              onClick={() => {
                if (unit !== "metric") {
                  setWeight(Math.round(weight * 0.453592))
                  setHeight(Math.round(height * 2.54))
                  setUnit("metric")
                }
              }}
            >
              Metric (kg/cm)
            </Button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-1.5">
              <Label>Gender</Label>
              <div className="flex gap-2">
                <Button
                  variant={gender === "male" ? "default" : "secondary"}
                  size="sm"
                  onClick={() => setGender("male")}
                >
                  Male
                </Button>
                <Button
                  variant={gender === "female" ? "default" : "secondary"}
                  size="sm"
                  onClick={() => setGender("female")}
                >
                  Female
                </Button>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="age">Age</Label>
              <NumberInput id="age" value={age} onChange={setAge} placeholder="30" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="weight">
                Weight ({unit === "imperial" ? "lbs" : "kg"})
              </Label>
              <NumberInput
                id="weight"
                value={weight}
                onChange={setWeight}
                placeholder={unit === "imperial" ? "170" : "77"}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="height">
                Height ({unit === "imperial" ? "inches" : "cm"})
              </Label>
              <NumberInput
                id="height"
                value={height}
                onChange={setHeight}
                placeholder={unit === "imperial" ? "69" : "175"}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Activity Level</Label>
            <Select value={activity} onValueChange={(v) => setActivity(v as Activity)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ACTIVITY_LEVELS.map((a) => (
                  <SelectItem key={a.key} value={a.key}>
                    {a.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Goal selection */}
      <Card>
        <CardHeader>
          <CardTitle>Goal</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-3">
            {GOALS.map((g) => (
              <button
                key={g.key}
                onClick={() => setGoal(g.key)}
                className={`rounded-xl border p-4 text-left transition-colors ${
                  goal === g.key
                    ? "border-primary bg-primary/10 ring-1 ring-primary/30"
                    : "hover:bg-muted/50"
                }`}
              >
                <div className="font-medium">{g.label}</div>
                <div className="mt-0.5 text-xs text-muted-foreground">
                  {g.desc}
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Diet preset */}
      <Card>
        <CardHeader>
          <CardTitle>Diet Preset</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {DIET_PRESETS.map((d) => (
              <button
                key={d.key}
                onClick={() => setDietPreset(d.key)}
                className={`rounded-xl border p-3 text-left transition-colors ${
                  dietPreset === d.key
                    ? "border-primary bg-primary/10 ring-1 ring-primary/30"
                    : "hover:bg-muted/50"
                }`}
              >
                <div className="font-medium">{d.label}</div>
                <div className="mt-0.5 text-xs text-muted-foreground">
                  {d.desc}
                </div>
              </button>
            ))}
          </div>

          {isCustom && (
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-1.5">
                <Label htmlFor="custProt">Protein %</Label>
                <NumberInput
                  id="custProt"
                  value={customProtein}
                  onChange={setCustomProtein}
                  step="5"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="custCarbs">Carbs %</Label>
                <NumberInput
                  id="custCarbs"
                  value={customCarbs}
                  onChange={setCustomCarbs}
                  step="5"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="custFat">Fat %</Label>
                <NumberInput
                  id="custFat"
                  value={customFat}
                  onChange={setCustomFat}
                  step="5"
                />
              </div>
            </div>
          )}

          {totalPct !== 100 && (
            <p className="text-xs text-amber-600 dark:text-amber-400">
              Macro percentages total {totalPct}%. They should add up to 100%
              for accurate results.
            </p>
          )}
        </CardContent>
      </Card>

      {isValid && mode === "calculator" && (
        <CalculatorResults result={result} weightKg={weightKg} goal={goal} />
      )}

      {isValid && mode === "meals" && (
        <MealBreakdown
          result={result}
          mealCount={mealCount}
          setMealCount={setMealCount}
        />
      )}

      <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 text-xs text-muted-foreground">
        <strong className="text-foreground">For informational purposes only.</strong>{" "}
        This calculator provides general estimates based on standard formulas. It
        is not a substitute for guidance from a registered dietitian, physician,
        or certified nutritionist. Individual needs vary based on medical
        conditions, metabolism, and training history.
      </div>
    </div>
  )
}

// ---------------- CALCULATOR RESULTS ----------------
function CalculatorResults({
  result,
  weightKg,
  goal,
}: {
  result: MacroResult
  weightKg: number
  goal: Goal
}) {
  const proteinPerKg = weightKg > 0 ? result.proteinG / weightKg : 0

  return (
    <>
      {/* Calorie summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        <SummaryCard
          label="BMR"
          value={fmtCal(result.bmr)}
          sub="Basal Metabolic Rate"
        />
        <SummaryCard
          label="TDEE"
          value={fmtCal(result.tdee)}
          sub="Total Daily Energy Expenditure"
        />
        <SummaryCard
          label="Target Calories"
          value={fmtCal(result.targetCalories)}
          sub={
            goal === "cut"
              ? "500 cal deficit for fat loss"
              : goal === "bulk"
                ? "500 cal surplus for muscle gain"
                : "Maintenance calories"
          }
          accent
        />
      </div>

      {/* Macro breakdown cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <MacroCard
          label="Protein"
          grams={result.proteinG}
          calories={result.proteinCal}
          pct={result.proteinPct}
          color="bg-blue-500"
          sub={`${proteinPerKg.toFixed(1)}g per kg body weight`}
        />
        <MacroCard
          label="Carbs"
          grams={result.carbsG}
          calories={result.carbsCal}
          pct={result.carbsPct}
          color="bg-amber-500"
        />
        <MacroCard
          label="Fat"
          grams={result.fatG}
          calories={result.fatCal}
          pct={result.fatPct}
          color="bg-rose-500"
        />
      </div>

      {/* Visual macro bar */}
      <Card>
        <CardHeader>
          <CardTitle>Macro Split</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex h-8 w-full overflow-hidden rounded-full">
            <div
              className="flex items-center justify-center bg-blue-500 text-[10px] font-semibold text-white"
              style={{ width: `${result.proteinPct}%` }}
            >
              {result.proteinPct >= 10 && `P ${result.proteinPct}%`}
            </div>
            <div
              className="flex items-center justify-center bg-amber-500 text-[10px] font-semibold text-white"
              style={{ width: `${result.carbsPct}%` }}
            >
              {result.carbsPct >= 10 && `C ${result.carbsPct}%`}
            </div>
            <div
              className="flex items-center justify-center bg-rose-500 text-[10px] font-semibold text-white"
              style={{ width: `${result.fatPct}%` }}
            >
              {result.fatPct >= 10 && `F ${result.fatPct}%`}
            </div>
          </div>
          <div className="flex flex-wrap gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded bg-blue-500" />
              <span>Protein ({result.proteinPct}%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded bg-amber-500" />
              <span>Carbs ({result.carbsPct}%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded bg-rose-500" />
              <span>Fat ({result.fatPct}%)</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Smart insights */}
      <Card>
        <CardHeader>
          <CardTitle>Insights</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          {proteinPerKg < 1.2 && goal !== "cut" && (
            <InsightRow tone="warn">
              Your protein intake is {proteinPerKg.toFixed(1)}g per kg. Most
              fitness guidelines recommend 1.6 to 2.2g per kg for muscle
              maintenance or growth. Consider a higher-protein preset.
            </InsightRow>
          )}
          {proteinPerKg >= 1.6 && proteinPerKg <= 2.2 && (
            <InsightRow tone="good">
              Your protein intake of {proteinPerKg.toFixed(1)}g per kg is in the
              optimal range (1.6 to 2.2g/kg) for muscle building and recovery.
            </InsightRow>
          )}
          {proteinPerKg > 2.5 && (
            <InsightRow tone="warn">
              Your protein intake is {proteinPerKg.toFixed(1)}g per kg, which is
              above the typical upper range. Most people do not benefit from more
              than 2.2g per kg unless directed by a professional.
            </InsightRow>
          )}
          {result.carbsPct <= 10 && (
            <InsightRow tone="info">
              Very low carb intake ({result.carbsPct}%). This may support ketosis
              but can be difficult to sustain. Make sure you are getting adequate
              fiber from vegetables.
            </InsightRow>
          )}
          {result.fatPct >= 60 && (
            <InsightRow tone="info">
              High fat intake ({result.fatPct}%). Prioritize healthy fats from
              avocado, olive oil, nuts, and fatty fish rather than processed
              sources.
            </InsightRow>
          )}
          {goal === "cut" && result.targetCalories <= 1500 && (
            <InsightRow tone="warn">
              Your target is {Math.round(result.targetCalories)} calories. Very
              low calorie diets should be supervised by a healthcare provider to
              avoid nutrient deficiencies.
            </InsightRow>
          )}
          <InsightRow tone="info">
            These macros are a starting point. Track for 2 to 3 weeks, then
            adjust based on how your body responds: energy levels, weight
            changes, and workout performance.
          </InsightRow>
        </CardContent>
      </Card>

      {/* Goal comparison table */}
      <Card>
        <CardHeader>
          <CardTitle>All Goals at a Glance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[420px] text-left text-xs">
              <thead className="border-b bg-muted/40 text-muted-foreground">
                <tr>
                  <th className="px-3 py-2 font-medium">Goal</th>
                  <th className="px-3 py-2 text-right font-medium">Calories</th>
                  <th className="px-3 py-2 text-right font-medium">Protein</th>
                  <th className="px-3 py-2 text-right font-medium">Carbs</th>
                  <th className="px-3 py-2 text-right font-medium">Fat</th>
                </tr>
              </thead>
              <tbody>
                {GOALS.map((g) => {
                  const r = calcMacros(
                    result.bmr,
                    result.tdee / result.bmr,
                    g.adjustment,
                    result.proteinPct,
                    result.carbsPct,
                    result.fatPct
                  )
                  const isCurrent = g.key === goal
                  return (
                    <tr
                      key={g.key}
                      className={`border-b last:border-0 ${
                        isCurrent ? "bg-primary/5 font-semibold" : ""
                      }`}
                    >
                      <td className="px-3 py-2">
                        {g.label}
                        {isCurrent && (
                          <span className="ml-1.5 text-[10px] font-medium uppercase text-primary">
                            Selected
                          </span>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-3 py-2 text-right tabular-nums">
                        {fmtCal(r.targetCalories)}
                      </td>
                      <td className="whitespace-nowrap px-3 py-2 text-right tabular-nums">
                        {fmtG(r.proteinG)}
                      </td>
                      <td className="whitespace-nowrap px-3 py-2 text-right tabular-nums">
                        {fmtG(r.carbsG)}
                      </td>
                      <td className="whitespace-nowrap px-3 py-2 text-right tabular-nums">
                        {fmtG(r.fatG)}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </>
  )
}

// ---------------- MEAL BREAKDOWN ----------------
function MealBreakdown({
  result,
  mealCount,
  setMealCount,
}: {
  result: MacroResult
  mealCount: number
  setMealCount: (n: number) => void
}) {
  // Distribute macros across meals with slight variation
  const meals = useMemo(() => {
    return Array.from({ length: mealCount }, (_, i) => {
      let share: number
      if (mealCount <= 3) {
        // Larger meals: breakfast slightly smaller, lunch/dinner equal
        if (i === 0) share = 0.25
        else share = 0.75 / (mealCount - 1)
      } else {
        // More meals: distribute more evenly with main meals slightly larger
        const isMainMeal = i === 0 || i === Math.floor(mealCount / 2) || i === mealCount - 1
        if (isMainMeal) {
          const mainCount = mealCount <= 4 ? 3 : 3
          const snackCount = mealCount - mainCount
          share = 0.7 / mainCount
          if (snackCount > 0 && !isMainMeal) share = 0.3 / snackCount
        } else {
          const mainCount = 3
          const snackCount = mealCount - mainCount
          share = snackCount > 0 ? 0.3 / snackCount : 1 / mealCount
        }
      }

      const label =
        mealCount <= 3
          ? ["Breakfast", "Lunch", "Dinner"][i]
          : mealCount === 4
            ? ["Breakfast", "Lunch", "Snack", "Dinner"][i]
            : mealCount === 5
              ? ["Breakfast", "Snack", "Lunch", "Snack", "Dinner"][i]
              : ["Breakfast", "Snack", "Lunch", "Snack", "Dinner", "Snack"][i]

      return {
        label: label ?? `Meal ${i + 1}`,
        calories: result.targetCalories * share,
        proteinG: result.proteinG * share,
        carbsG: result.carbsG * share,
        fatG: result.fatG * share,
        share,
      }
    })
  }, [mealCount, result])

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Number of Meals</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {MEAL_COUNTS.map((n) => (
              <Button
                key={n}
                variant={mealCount === n ? "default" : "secondary"}
                size="sm"
                onClick={() => setMealCount(n)}
              >
                {n} meals
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Daily totals reminder */}
      <div className="grid gap-4 sm:grid-cols-4">
        <SummaryCard
          label="Daily Calories"
          value={fmtCal(result.targetCalories)}
          accent
        />
        <SummaryCard
          label="Daily Protein"
          value={fmtG(result.proteinG)}
          sub={`${result.proteinPct}%`}
        />
        <SummaryCard
          label="Daily Carbs"
          value={fmtG(result.carbsG)}
          sub={`${result.carbsPct}%`}
        />
        <SummaryCard
          label="Daily Fat"
          value={fmtG(result.fatG)}
          sub={`${result.fatPct}%`}
        />
      </div>

      {/* Per-meal breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Per-Meal Targets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[420px] text-left text-xs">
              <thead className="border-b bg-muted/40 text-muted-foreground">
                <tr>
                  <th className="px-3 py-2 font-medium">Meal</th>
                  <th className="px-3 py-2 text-right font-medium">Calories</th>
                  <th className="px-3 py-2 text-right font-medium">Protein</th>
                  <th className="px-3 py-2 text-right font-medium">Carbs</th>
                  <th className="px-3 py-2 text-right font-medium">Fat</th>
                </tr>
              </thead>
              <tbody>
                {meals.map((meal, i) => (
                  <tr key={i} className="border-b last:border-0">
                    <td className="px-3 py-2 font-medium">{meal.label}</td>
                    <td className="whitespace-nowrap px-3 py-2 text-right tabular-nums">
                      {Math.round(meal.calories)}
                    </td>
                    <td className="whitespace-nowrap px-3 py-2 text-right tabular-nums text-blue-600 dark:text-blue-400">
                      {fmtG(meal.proteinG)}
                    </td>
                    <td className="whitespace-nowrap px-3 py-2 text-right tabular-nums text-amber-600 dark:text-amber-400">
                      {fmtG(meal.carbsG)}
                    </td>
                    <td className="whitespace-nowrap px-3 py-2 text-right tabular-nums text-rose-600 dark:text-rose-400">
                      {fmtG(meal.fatG)}
                    </td>
                  </tr>
                ))}
                <tr className="border-t-2 font-semibold">
                  <td className="px-3 py-2">Total</td>
                  <td className="whitespace-nowrap px-3 py-2 text-right tabular-nums">
                    {Math.round(result.targetCalories)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-2 text-right tabular-nums text-blue-600 dark:text-blue-400">
                    {fmtG(result.proteinG)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-2 text-right tabular-nums text-amber-600 dark:text-amber-400">
                    {fmtG(result.carbsG)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-2 text-right tabular-nums text-rose-600 dark:text-rose-400">
                    {fmtG(result.fatG)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Per-meal visual cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {meals.map((meal, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="mb-2 font-medium">{meal.label}</div>
              <div className="mb-3 text-lg font-semibold tabular-nums">
                {Math.round(meal.calories)} cal
              </div>
              {/* Mini macro bar */}
              <div className="mb-2 flex h-2 w-full overflow-hidden rounded-full">
                <div className="bg-blue-500" style={{ width: `${result.proteinPct}%` }} />
                <div className="bg-amber-500" style={{ width: `${result.carbsPct}%` }} />
                <div className="bg-rose-500" style={{ width: `${result.fatPct}%` }} />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span className="text-blue-600 dark:text-blue-400">
                  P: {fmtG(meal.proteinG)}
                </span>
                <span className="text-amber-600 dark:text-amber-400">
                  C: {fmtG(meal.carbsG)}
                </span>
                <span className="text-rose-600 dark:text-rose-400">
                  F: {fmtG(meal.fatG)}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
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

function MacroCard({
  label,
  grams,
  calories,
  pct,
  color,
  sub,
}: {
  label: string
  grams: number
  calories: number
  pct: number
  color: string
  sub?: string
}) {
  return (
    <div className="rounded-2xl border bg-card p-4">
      <div className="flex items-center gap-2">
        <div className={`h-3 w-3 rounded ${color}`} />
        <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label} ({pct}%)
        </div>
      </div>
      <div className="mt-1 font-heading text-2xl font-semibold tabular-nums">
        {fmtG(grams)}
      </div>
      <div className="mt-0.5 text-xs text-muted-foreground tabular-nums">
        {Math.round(calories)} calories
      </div>
      {sub && (
        <div className="mt-0.5 text-xs text-muted-foreground">{sub}</div>
      )}
    </div>
  )
}

function InsightRow({
  children,
  tone,
}: {
  children: React.ReactNode
  tone: "good" | "warn" | "info"
}) {
  const icon = tone === "good" ? "+" : tone === "warn" ? "!" : "i"
  const colorClass =
    tone === "good"
      ? "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
      : tone === "warn"
        ? "text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20"
        : "text-blue-600 dark:text-blue-400 bg-blue-500/10 border-blue-500/20"

  return (
    <div className={`flex gap-2 rounded-lg border p-2.5 text-xs ${colorClass}`}>
      <span className="mt-px font-bold">{icon}</span>
      <span>{children}</span>
    </div>
  )
}
