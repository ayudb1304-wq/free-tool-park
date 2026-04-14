"use client"

import { useMemo, useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// --- Types ---
type Gender = "male" | "female"
type UnitSystem = "metric" | "imperial"

// --- Constants ---
const BF_CATEGORIES_MALE = [
  { label: "Essential Fat", min: 2, max: 5, tone: "warn" as const },
  { label: "Athletes", min: 6, max: 13, tone: "good" as const },
  { label: "Fitness", min: 14, max: 17, tone: "good" as const },
  { label: "Average", min: 18, max: 24, tone: "neutral" as const },
  { label: "Above Average", min: 25, max: 100, tone: "warn" as const },
]

const BF_CATEGORIES_FEMALE = [
  { label: "Essential Fat", min: 10, max: 13, tone: "warn" as const },
  { label: "Athletes", min: 14, max: 20, tone: "good" as const },
  { label: "Fitness", min: 21, max: 24, tone: "good" as const },
  { label: "Average", min: 25, max: 31, tone: "neutral" as const },
  { label: "Above Average", min: 32, max: 100, tone: "warn" as const },
]

// --- Formatting ---
const fmtPct = (n: number) => `${n.toFixed(1)}%`
const fmtLbs = (n: number) => `${Math.round(n)} lbs`
const fmtKg = (n: number) => `${n.toFixed(1)} kg`

// --- Number input helper ---
function NumberInput({
  value,
  onChange,
  placeholder,
  id,
  step = "0.1",
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

// --- Body fat formulas ---

// 1. US Navy Method
function navyBF(gender: Gender, heightCm: number, waistCm: number, neckCm: number, hipCm: number): number {
  if (heightCm <= 0 || waistCm <= 0 || neckCm <= 0) return NaN
  if (gender === "male") {
    const diff = waistCm - neckCm
    if (diff <= 0) return NaN
    return 495 / (1.0324 - 0.19077 * Math.log10(diff) + 0.15456 * Math.log10(heightCm)) - 450
  }
  if (hipCm <= 0) return NaN
  const diff = waistCm + hipCm - neckCm
  if (diff <= 0) return NaN
  return 495 / (1.29579 - 0.35004 * Math.log10(diff) + 0.22100 * Math.log10(heightCm)) - 450
}

// 2. BMI-based estimate (Deurenberg et al.)
function bmiBF(gender: Gender, bmi: number, age: number): number {
  if (bmi <= 0 || age <= 0) return NaN
  const sexFactor = gender === "male" ? 1 : 0
  return 1.20 * bmi + 0.23 * age - 10.8 * sexFactor - 5.4
}

// 3. Jackson-Pollock 3-site
// Male: chest, abdomen, thigh
// Female: tricep, suprailiac, thigh
function jp3BF(gender: Gender, age: number, s1: number, s2: number, s3: number): number {
  if (s1 <= 0 || s2 <= 0 || s3 <= 0 || age <= 0) return NaN
  const sum = s1 + s2 + s3
  let bodyDensity: number
  if (gender === "male") {
    bodyDensity = 1.10938 - 0.0008267 * sum + 0.0000016 * sum * sum - 0.0002574 * age
  } else {
    bodyDensity = 1.0994921 - 0.0009929 * sum + 0.0000023 * sum * sum - 0.0001392 * age
  }
  return (495 / bodyDensity) - 450
}

// 4. Jackson-Pollock 7-site
// Male & Female: chest, midaxillary, tricep, subscapular, abdomen, suprailiac, thigh
function jp7BF(gender: Gender, age: number, sites: number[]): number {
  if (sites.length < 7 || sites.some((s) => s <= 0) || age <= 0) return NaN
  const sum = sites.reduce((a, b) => a + b, 0)
  let bodyDensity: number
  if (gender === "male") {
    bodyDensity = 1.112 - 0.00043499 * sum + 0.00000055 * sum * sum - 0.00028826 * age
  } else {
    bodyDensity = 1.097 - 0.00046971 * sum + 0.00000056 * sum * sum - 0.00012828 * age
  }
  return (495 / bodyDensity) - 450
}

// 5. BIA estimate (simplified formula using weight, height, age, gender)
// This is an approximation since actual BIA requires impedance measurement
function biaBF(gender: Gender, weightKg: number, heightCm: number, age: number): number {
  if (weightKg <= 0 || heightCm <= 0 || age <= 0) return NaN
  const heightM = heightCm / 100
  const bmi = weightKg / (heightM * heightM)
  // Using a regression model similar to published BIA prediction equations
  if (gender === "male") {
    return 0.742 * bmi + 0.175 * age - 15.4
  }
  return 0.637 * bmi + 0.147 * age - 6.56
}

// --- Category lookup ---
function getCategory(gender: Gender, bf: number) {
  const categories = gender === "male" ? BF_CATEGORIES_MALE : BF_CATEGORIES_FEMALE
  return categories.find((c) => bf >= c.min && bf <= c.max) ?? categories[categories.length - 1]
}

// --- Method result interface ---
interface MethodResult {
  name: string
  shortName: string
  bodyFat: number
  valid: boolean
  leanMass: number
  fatMass: number
}

// ---------------- MAIN COMPONENT ----------------
export default function BodyFatCalculator() {
  // Body stats
  const [gender, setGender] = useState<Gender>("male")
  const [unit, setUnit] = useState<UnitSystem>("imperial")
  const [age, setAge] = useState(30)
  const [weight, setWeight] = useState(180)
  const [height, setHeight] = useState(70)

  // Navy method measurements
  const [waist, setWaist] = useState(34)
  const [neck, setNeck] = useState(15)
  const [hip, setHip] = useState(38)

  // Skinfold measurements (in mm)
  const [showSkinfold, setShowSkinfold] = useState(false)
  // JP3: male = chest/abdomen/thigh, female = tricep/suprailiac/thigh
  const [sf1, setSf1] = useState(0)
  const [sf2, setSf2] = useState(0)
  const [sf3, setSf3] = useState(0)
  // JP7 additional: midaxillary, tricep (male), subscapular, suprailiac (male)
  const [sfChest, setSfChest] = useState(0)
  const [sfMidax, setSfMidax] = useState(0)
  const [sfTricep, setSfTricep] = useState(0)
  const [sfSubscap, setSfSubscap] = useState(0)
  const [sfAbdomen, setSfAbdomen] = useState(0)
  const [sfSuprailiac, setSfSuprailiac] = useState(0)
  const [sfThigh, setSfThigh] = useState(0)

  // Conversions
  const weightKg = unit === "imperial" ? weight * 0.453592 : weight
  const heightCm = unit === "imperial" ? height * 2.54 : height
  const waistCm = unit === "imperial" ? waist * 2.54 : waist
  const neckCm = unit === "imperial" ? neck * 2.54 : neck
  const hipCm = unit === "imperial" ? hip * 2.54 : hip
  const heightM = heightCm / 100
  const bmi = heightM > 0 ? weightKg / (heightM * heightM) : 0

  // Calculate all methods
  const results = useMemo<MethodResult[]>(() => {
    const methods: MethodResult[] = []

    // 1. US Navy
    const navyVal = navyBF(gender, heightCm, waistCm, neckCm, hipCm)
    methods.push({
      name: "US Navy Method",
      shortName: "Navy",
      bodyFat: navyVal,
      valid: Number.isFinite(navyVal) && navyVal > 0 && navyVal < 70,
      leanMass: Number.isFinite(navyVal) ? weightKg * (1 - navyVal / 100) : 0,
      fatMass: Number.isFinite(navyVal) ? weightKg * (navyVal / 100) : 0,
    })

    // 2. BMI-based
    const bmiVal = bmiBF(gender, bmi, age)
    methods.push({
      name: "BMI-Based Estimate",
      shortName: "BMI",
      bodyFat: bmiVal,
      valid: Number.isFinite(bmiVal) && bmiVal > 0 && bmiVal < 70,
      leanMass: Number.isFinite(bmiVal) ? weightKg * (1 - bmiVal / 100) : 0,
      fatMass: Number.isFinite(bmiVal) ? weightKg * (bmiVal / 100) : 0,
    })

    // 3. BIA Estimate
    const biaVal = biaBF(gender, weightKg, heightCm, age)
    methods.push({
      name: "BIA Estimate",
      shortName: "BIA",
      bodyFat: biaVal,
      valid: Number.isFinite(biaVal) && biaVal > 0 && biaVal < 70,
      leanMass: Number.isFinite(biaVal) ? weightKg * (1 - biaVal / 100) : 0,
      fatMass: Number.isFinite(biaVal) ? weightKg * (biaVal / 100) : 0,
    })

    // 4. Jackson-Pollock 3-site
    const jp3Val = jp3BF(gender, age, sf1, sf2, sf3)
    methods.push({
      name: "Jackson-Pollock 3-Site",
      shortName: "JP3",
      bodyFat: jp3Val,
      valid: Number.isFinite(jp3Val) && jp3Val > 0 && jp3Val < 70,
      leanMass: Number.isFinite(jp3Val) ? weightKg * (1 - jp3Val / 100) : 0,
      fatMass: Number.isFinite(jp3Val) ? weightKg * (jp3Val / 100) : 0,
    })

    // 5. Jackson-Pollock 7-site
    const jp7Val = jp7BF(gender, age, [
      sfChest, sfMidax, sfTricep, sfSubscap, sfAbdomen, sfSuprailiac, sfThigh,
    ])
    methods.push({
      name: "Jackson-Pollock 7-Site",
      shortName: "JP7",
      bodyFat: jp7Val,
      valid: Number.isFinite(jp7Val) && jp7Val > 0 && jp7Val < 70,
      leanMass: Number.isFinite(jp7Val) ? weightKg * (1 - jp7Val / 100) : 0,
      fatMass: Number.isFinite(jp7Val) ? weightKg * (jp7Val / 100) : 0,
    })

    return methods
  }, [gender, heightCm, waistCm, neckCm, hipCm, age, bmi, weightKg, sf1, sf2, sf3, sfChest, sfMidax, sfTricep, sfSubscap, sfAbdomen, sfSuprailiac, sfThigh])

  const validResults = results.filter((r) => r.valid)
  const primaryResult = validResults[0]
  const categories = gender === "male" ? BF_CATEGORIES_MALE : BF_CATEGORIES_FEMALE

  return (
    <div className="space-y-6">
      {/* Unit toggle */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={unit === "imperial" ? "default" : "secondary"}
          size="sm"
          onClick={() => {
            if (unit !== "imperial") {
              setWeight(Math.round(weight * 2.20462))
              setHeight(Math.round(height / 2.54))
              setWaist(Math.round(waist / 2.54 * 10) / 10)
              setNeck(Math.round(neck / 2.54 * 10) / 10)
              setHip(Math.round(hip / 2.54 * 10) / 10)
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
              setWeight(Math.round(weight * 0.453592 * 10) / 10)
              setHeight(Math.round(height * 2.54 * 10) / 10)
              setWaist(Math.round(waist * 2.54 * 10) / 10)
              setNeck(Math.round(neck * 2.54 * 10) / 10)
              setHip(Math.round(hip * 2.54 * 10) / 10)
              setUnit("metric")
            }
          }}
        >
          Metric (kg/cm)
        </Button>
      </div>

      {/* Basic info */}
      <Card>
        <CardHeader>
          <CardTitle>Your Stats</CardTitle>
        </CardHeader>
        <CardContent>
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
              <NumberInput id="age" value={age} onChange={setAge} step="1" placeholder="30" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="weight">
                Weight ({unit === "imperial" ? "lbs" : "kg"})
              </Label>
              <NumberInput
                id="weight"
                value={weight}
                onChange={setWeight}
                step="1"
                placeholder={unit === "imperial" ? "180" : "82"}
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
                step="1"
                placeholder={unit === "imperial" ? "70" : "178"}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navy method measurements */}
      <Card>
        <CardHeader>
          <CardTitle>
            Body Measurements
            <span className="ml-2 text-xs font-normal text-muted-foreground">
              (for Navy method)
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1.5">
              <Label htmlFor="waist">
                Waist ({unit === "imperial" ? "inches" : "cm"})
                <span className="ml-1 text-xs text-muted-foreground">at navel</span>
              </Label>
              <NumberInput id="waist" value={waist} onChange={setWaist} step="0.5" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="neck">
                Neck ({unit === "imperial" ? "inches" : "cm"})
                <span className="ml-1 text-xs text-muted-foreground">below larynx</span>
              </Label>
              <NumberInput id="neck" value={neck} onChange={setNeck} step="0.5" />
            </div>
            {gender === "female" && (
              <div className="space-y-1.5">
                <Label htmlFor="hip">
                  Hip ({unit === "imperial" ? "inches" : "cm"})
                  <span className="ml-1 text-xs text-muted-foreground">widest point</span>
                </Label>
                <NumberInput id="hip" value={hip} onChange={setHip} step="0.5" />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Skinfold measurements (collapsible) */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>
            Skinfold Measurements
            <span className="ml-2 text-xs font-normal text-muted-foreground">
              (optional, for Jackson-Pollock methods)
            </span>
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSkinfold(!showSkinfold)}
          >
            {showSkinfold ? "Hide" : "Show"}
          </Button>
        </CardHeader>
        {showSkinfold && (
          <CardContent className="space-y-4">
            <div>
              <p className="mb-3 text-xs text-muted-foreground">
                {gender === "male"
                  ? "3-site: chest, abdomen, thigh. 7-site: all fields below. Measurements in millimeters (mm)."
                  : "3-site: tricep, suprailiac, thigh. 7-site: all fields below. Measurements in millimeters (mm)."}
              </p>
              <p className="mb-3 text-xs font-medium">
                3-Site Measurements
              </p>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-1.5">
                  <Label htmlFor="sf1">
                    {gender === "male" ? "Chest (mm)" : "Tricep (mm)"}
                  </Label>
                  <NumberInput id="sf1" value={sf1} onChange={setSf1} step="1" placeholder="10" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="sf2">
                    {gender === "male" ? "Abdomen (mm)" : "Suprailiac (mm)"}
                  </Label>
                  <NumberInput id="sf2" value={sf2} onChange={setSf2} step="1" placeholder="15" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="sf3">Thigh (mm)</Label>
                  <NumberInput id="sf3" value={sf3} onChange={setSf3} step="1" placeholder="12" />
                </div>
              </div>
            </div>

            <div>
              <p className="mb-3 text-xs font-medium">
                Additional 7-Site Measurements
              </p>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-1.5">
                  <Label htmlFor="sfChest">Chest (mm)</Label>
                  <NumberInput id="sfChest" value={sfChest} onChange={setSfChest} step="1" placeholder="8" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="sfMidax">Midaxillary (mm)</Label>
                  <NumberInput id="sfMidax" value={sfMidax} onChange={setSfMidax} step="1" placeholder="10" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="sfTricep">Tricep (mm)</Label>
                  <NumberInput id="sfTricep" value={sfTricep} onChange={setSfTricep} step="1" placeholder="9" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="sfSubscap">Subscapular (mm)</Label>
                  <NumberInput id="sfSubscap" value={sfSubscap} onChange={setSfSubscap} step="1" placeholder="12" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="sfAbdomen">Abdomen (mm)</Label>
                  <NumberInput id="sfAbdomen" value={sfAbdomen} onChange={setSfAbdomen} step="1" placeholder="15" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="sfSuprailiac">Suprailiac (mm)</Label>
                  <NumberInput id="sfSuprailiac" value={sfSuprailiac} onChange={setSfSuprailiac} step="1" placeholder="10" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="sfThigh">Thigh (mm)</Label>
                  <NumberInput id="sfThigh" value={sfThigh} onChange={setSfThigh} step="1" placeholder="12" />
                </div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Primary result */}
      {primaryResult && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <ResultCard
              label="Body Fat (Navy)"
              value={fmtPct(primaryResult.bodyFat)}
              sub={getCategory(gender, primaryResult.bodyFat).label}
              accent
              tone={getCategory(gender, primaryResult.bodyFat).tone}
            />
            <ResultCard
              label="Fat Mass"
              value={unit === "imperial" ? fmtLbs(primaryResult.fatMass * 2.20462) : fmtKg(primaryResult.fatMass)}
              sub="Body fat weight"
            />
            <ResultCard
              label="Lean Mass"
              value={unit === "imperial" ? fmtLbs(primaryResult.leanMass * 2.20462) : fmtKg(primaryResult.leanMass)}
              sub="Muscle, bone, water"
              tone="positive"
            />
            <ResultCard
              label="BMI"
              value={bmi.toFixed(1)}
              sub={bmi < 18.5 ? "Underweight" : bmi < 25 ? "Normal" : bmi < 30 ? "Overweight" : "Obese"}
            />
          </div>

          {/* Body fat range visualization */}
          <Card>
            <CardHeader>
              <CardTitle>Body Fat Categories ({gender === "male" ? "Male" : "Female"})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {categories.slice(0, -1).map((cat) => {
                const isActive = primaryResult.bodyFat >= cat.min && primaryResult.bodyFat <= cat.max
                return (
                  <div key={cat.label} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className={`font-medium ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
                        {cat.label}
                      </span>
                      <span className="tabular-nums text-muted-foreground">
                        {cat.min}% to {cat.max}%
                      </span>
                    </div>
                    <div className="relative h-3 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className={`absolute left-0 top-0 h-full rounded-full ${
                          cat.tone === "good"
                            ? "bg-emerald-500"
                            : cat.tone === "warn"
                              ? "bg-amber-500"
                              : "bg-blue-500"
                        }`}
                        style={{
                          left: `${(cat.min / 50) * 100}%`,
                          width: `${((cat.max - cat.min) / 50) * 100}%`,
                        }}
                      />
                      {isActive && (
                        <div
                          className="absolute top-0 h-full w-0.5 bg-foreground"
                          style={{ left: `${(primaryResult.bodyFat / 50) * 100}%` }}
                        />
                      )}
                    </div>
                  </div>
                )
              })}
              {primaryResult && (
                <p className="pt-1 text-xs text-muted-foreground">
                  Your estimated body fat of {fmtPct(primaryResult.bodyFat)} falls in the{" "}
                  <strong className="text-foreground">
                    {getCategory(gender, primaryResult.bodyFat).label}
                  </strong>{" "}
                  range for {gender === "male" ? "males" : "females"}.
                </p>
              )}
            </CardContent>
          </Card>
        </>
      )}

      {/* Compare all methods */}
      {validResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>All Methods Compared</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-3 text-xs text-muted-foreground">
              Different methods produce different estimates. The US Navy and
              skinfold methods use physical measurements while BMI-based and BIA
              methods use statistical models. Comparing multiple methods gives a
              more reliable picture than relying on any single formula.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[500px] text-left text-xs">
                <thead className="border-b bg-muted/40 text-muted-foreground">
                  <tr>
                    <th className="px-3 py-2 font-medium">Method</th>
                    <th className="px-3 py-2 text-right font-medium">Body Fat %</th>
                    <th className="px-3 py-2 text-right font-medium">Category</th>
                    <th className="px-3 py-2 text-right font-medium">Fat Mass</th>
                    <th className="px-3 py-2 text-right font-medium">Lean Mass</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((r) => {
                    const cat = r.valid ? getCategory(gender, r.bodyFat) : null
                    return (
                      <tr key={r.shortName} className="border-b last:border-0">
                        <td className="px-3 py-2 font-medium">{r.name}</td>
                        <td className="whitespace-nowrap px-3 py-2 text-right tabular-nums">
                          {r.valid ? (
                            <span
                              className={
                                cat?.tone === "good"
                                  ? "text-emerald-600 dark:text-emerald-400"
                                  : cat?.tone === "warn"
                                    ? "text-amber-600 dark:text-amber-400"
                                    : ""
                              }
                            >
                              {fmtPct(r.bodyFat)}
                            </span>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </td>
                        <td className="whitespace-nowrap px-3 py-2 text-right text-muted-foreground">
                          {cat?.label ?? "-"}
                        </td>
                        <td className="whitespace-nowrap px-3 py-2 text-right tabular-nums">
                          {r.valid
                            ? unit === "imperial"
                              ? fmtLbs(r.fatMass * 2.20462)
                              : fmtKg(r.fatMass)
                            : "-"}
                        </td>
                        <td className="whitespace-nowrap px-3 py-2 text-right tabular-nums">
                          {r.valid
                            ? unit === "imperial"
                              ? fmtLbs(r.leanMass * 2.20462)
                              : fmtKg(r.leanMass)
                            : "-"}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            {validResults.length >= 2 && (
              <div className="mt-3 rounded-lg border bg-muted/30 p-3 text-xs text-muted-foreground">
                <strong className="text-foreground">Range:</strong>{" "}
                {fmtPct(Math.min(...validResults.map((r) => r.bodyFat)))} to{" "}
                {fmtPct(Math.max(...validResults.map((r) => r.bodyFat)))}
                {" | "}
                <strong className="text-foreground">Average:</strong>{" "}
                {fmtPct(
                  validResults.reduce((s, r) => s + r.bodyFat, 0) / validResults.length
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Visual comparison bars */}
      {validResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Visual Comparison</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {results.map((r) => {
              if (!r.valid) return null
              const maxBF = 50
              const barW = Math.min(100, (r.bodyFat / maxBF) * 100)
              const cat = getCategory(gender, r.bodyFat)
              return (
                <div key={r.shortName} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium">{r.shortName}</span>
                    <span className="tabular-nums">{fmtPct(r.bodyFat)}</span>
                  </div>
                  <div className="h-4 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className={`h-full rounded-full transition-all ${
                        cat.tone === "good"
                          ? "bg-emerald-500"
                          : cat.tone === "warn"
                            ? "bg-amber-500"
                            : "bg-blue-500"
                      }`}
                      style={{ width: `${barW}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
      )}

      {/* Insights */}
      {primaryResult && (
        <Card>
          <CardHeader>
            <CardTitle>Insights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <InsightRow tone={getCategory(gender, primaryResult.bodyFat).tone === "good" ? "good" : "info"}>
              Your primary estimate ({fmtPct(primaryResult.bodyFat)}) places you
              in the <strong className="text-foreground">{getCategory(gender, primaryResult.bodyFat).label}</strong> range
              for {gender === "male" ? "males" : "females"}.
            </InsightRow>
            {validResults.length >= 3 && (
              <InsightRow tone="info">
                With {validResults.length} methods calculated, your range
                is {fmtPct(Math.min(...validResults.map((r) => r.bodyFat)))} to{" "}
                {fmtPct(Math.max(...validResults.map((r) => r.bodyFat)))}. A
                spread under 5 percentage points is typical. Wider spreads
                suggest some measurements may need rechecking.
              </InsightRow>
            )}
            {primaryResult.bodyFat < (gender === "male" ? 6 : 14) && (
              <InsightRow tone="warn">
                Your estimated body fat is below typical healthy levels. Very low
                body fat can affect hormone function and energy levels. Consult a
                healthcare professional if maintaining this level long-term.
              </InsightRow>
            )}
            {!showSkinfold && (
              <InsightRow tone="info">
                For more accurate results, expand the Skinfold Measurements
                section and enter caliper readings. The Jackson-Pollock methods
                are considered more precise than circumference-based estimates.
              </InsightRow>
            )}
          </CardContent>
        </Card>
      )}

      {/* Method explainer */}
      <Card>
        <CardHeader>
          <CardTitle>About These Methods</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-xs text-muted-foreground">
          <MethodExplainer
            name="US Navy Method"
            desc="Uses neck, waist, and hip circumference measurements. Developed by the US Department of Defense for fitness assessments. Accuracy is plus or minus 3 to 4% compared to hydrostatic weighing."
          />
          <MethodExplainer
            name="BMI-Based Estimate"
            desc="Uses the Deurenberg equation to estimate body fat from BMI, age, and gender. Convenient but less accurate for muscular individuals since BMI does not distinguish muscle from fat."
          />
          <MethodExplainer
            name="BIA Estimate"
            desc="Approximates what a bioelectrical impedance device would measure using regression models based on weight, height, age, and gender. For best accuracy, use an actual BIA scale."
          />
          <MethodExplainer
            name="Jackson-Pollock 3-Site"
            desc="Uses skinfold caliper measurements at 3 body sites. Male sites: chest, abdomen, thigh. Female sites: tricep, suprailiac, thigh. Widely used in fitness testing with accuracy of plus or minus 3%."
          />
          <MethodExplainer
            name="Jackson-Pollock 7-Site"
            desc="Uses skinfold caliper measurements at 7 body sites for the most comprehensive skin-fold based estimate. Considered the gold standard among field methods with accuracy of plus or minus 2 to 3%."
          />
        </CardContent>
      </Card>

      <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 text-xs text-muted-foreground">
        <strong className="text-foreground">For informational purposes only.</strong>{" "}
        Body fat estimates from prediction equations have a margin of error of 3
        to 5 percentage points compared to clinical methods like DEXA scans or
        hydrostatic weighing. These results should not be used for medical
        diagnosis. Consult a healthcare professional for clinical body
        composition analysis.
      </div>
    </div>
  )
}

// --- Subcomponents ---
function ResultCard({
  label,
  value,
  sub,
  tone = "neutral",
  accent,
}: {
  label: string
  value: string
  sub?: string
  tone?: "positive" | "negative" | "neutral" | "good" | "warn"
  accent?: boolean
}) {
  const toneClass =
    tone === "positive" || tone === "good"
      ? "text-emerald-600 dark:text-emerald-400"
      : tone === "negative"
        ? "text-destructive"
        : tone === "warn"
          ? "text-amber-600 dark:text-amber-400"
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

function MethodExplainer({ name, desc }: { name: string; desc: string }) {
  return (
    <div>
      <div className="font-medium text-foreground">{name}</div>
      <p className="mt-0.5">{desc}</p>
    </div>
  )
}
