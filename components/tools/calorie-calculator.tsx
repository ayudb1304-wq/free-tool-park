"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { CopyButton } from "@/components/ui/copy-button"

type Gender = "male" | "female"
type Activity = "sedentary" | "light" | "moderate" | "active" | "very-active"

const ACTIVITY_LEVELS: { key: Activity; label: string; factor: number }[] = [
  { key: "sedentary", label: "Sedentary (little or no exercise)", factor: 1.2 },
  { key: "light", label: "Lightly active (1-3 days/week)", factor: 1.375 },
  { key: "moderate", label: "Moderately active (3-5 days/week)", factor: 1.55 },
  { key: "active", label: "Very active (6-7 days/week)", factor: 1.725 },
  { key: "very-active", label: "Extra active (athlete/physical job)", factor: 1.9 },
]

function calcBMR(gender: Gender, weightKg: number, heightCm: number, age: number): number {
  if (gender === "male") return 10 * weightKg + 6.25 * heightCm - 5 * age + 5
  return 10 * weightKg + 6.25 * heightCm - 5 * age - 161
}

export default function CalorieCalculator() {
  const [gender, setGender] = useState<Gender>("male")
  const [age, setAge] = useState("")
  const [weight, setWeight] = useState("")
  const [height, setHeight] = useState("")
  const [activity, setActivity] = useState<Activity>("moderate")
  const [unit, setUnit] = useState<"metric" | "imperial">("metric")
  const [calculated, setCalculated] = useState(false)

  const weightKg = unit === "imperial" ? Number(weight) * 0.453592 : Number(weight)
  const heightCm = unit === "imperial" ? Number(height) * 2.54 : Number(height)

  const bmr = calcBMR(gender, weightKg, heightCm, Number(age))
  const activityFactor = ACTIVITY_LEVELS.find((a) => a.key === activity)?.factor || 1.55
  const maintenance = Math.round(bmr * activityFactor)
  const mildLoss = Math.round(maintenance - 250)
  const loss = Math.round(maintenance - 500)
  const mildGain = Math.round(maintenance + 250)
  const gain = Math.round(maintenance + 500)

  function handleCalc() {
    if (Number(age) > 0 && Number(weight) > 0 && Number(height) > 0) {
      setCalculated(true)
    }
  }

  const summary = `BMR: ${Math.round(bmr)} cal | Maintenance: ${maintenance} cal | Weight Loss: ${loss} cal | Weight Gain: ${gain} cal`

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <Button variant={unit === "metric" ? "default" : "secondary"} size="sm" onClick={() => setUnit("metric")}>Metric (kg/cm)</Button>
        <Button variant={unit === "imperial" ? "default" : "secondary"} size="sm" onClick={() => setUnit("imperial")}>Imperial (lb/in)</Button>
      </div>

      <div className="grid max-w-lg gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label>Gender</Label>
          <div className="flex gap-2">
            <Button variant={gender === "male" ? "default" : "secondary"} size="sm" onClick={() => setGender("male")}>Male</Button>
            <Button variant={gender === "female" ? "default" : "secondary"} size="sm" onClick={() => setGender("female")}>Female</Button>
          </div>
        </div>
        <div className="space-y-1.5">
          <Label>Age</Label>
          <Input type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="e.g. 25" />
        </div>
        <div className="space-y-1.5">
          <Label>Weight ({unit === "metric" ? "kg" : "lbs"})</Label>
          <Input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder={unit === "metric" ? "e.g. 70" : "e.g. 154"} />
        </div>
        <div className="space-y-1.5">
          <Label>Height ({unit === "metric" ? "cm" : "inches"})</Label>
          <Input type="number" value={height} onChange={(e) => setHeight(e.target.value)} placeholder={unit === "metric" ? "e.g. 175" : "e.g. 69"} />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label>Activity Level</Label>
        <div className="flex flex-wrap gap-2">
          {ACTIVITY_LEVELS.map((a) => (
            <Button key={a.key} variant={activity === a.key ? "default" : "secondary"} size="sm" onClick={() => setActivity(a.key)}>
              {a.label}
            </Button>
          ))}
        </div>
      </div>

      <Button onClick={handleCalc}>Calculate Calories</Button>

      {calculated && maintenance > 0 && (
        <div className="space-y-4">
          <div className="rounded-xl bg-primary/10 p-4 text-center">
            <div className="text-xs text-muted-foreground">Your BMR (Basal Metabolic Rate)</div>
            <div className="text-2xl font-bold text-primary">{Math.round(bmr)} calories/day</div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { label: "Weight Loss", value: loss, desc: "~0.5 kg/week deficit" },
              { label: "Mild Weight Loss", value: mildLoss, desc: "~0.25 kg/week deficit" },
              { label: "Maintain Weight", value: maintenance, desc: "Stay at current weight" },
              { label: "Mild Weight Gain", value: mildGain, desc: "~0.25 kg/week surplus" },
              { label: "Weight Gain", value: gain, desc: "~0.5 kg/week surplus" },
            ].map((item) => (
              <div key={item.label} className="rounded-xl border p-3 text-center">
                <div className="text-xs text-muted-foreground">{item.label}</div>
                <div className="text-lg font-bold">{item.value} cal/day</div>
                <div className="text-xs text-muted-foreground">{item.desc}</div>
              </div>
            ))}
          </div>

          <CopyButton value={summary} label="Copy Results" />
        </div>
      )}
    </div>
  )
}
