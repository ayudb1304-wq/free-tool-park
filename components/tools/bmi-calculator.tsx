"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { CopyButton } from "@/components/ui/copy-button"
import { ShareResult } from "@/components/tools/share-result"
import { CalculationHistory } from "@/components/tools/calculation-history"
import type { HistoryItem } from "@/components/tools/calculation-history"
import { useLocalStorage } from "@/hooks/use-local-storage"

type Unit = "metric" | "imperial"

interface BMIResult {
  bmi: number
  category: string
  color: string
}

function calcBMI(weight: number, height: number, unit: Unit): BMIResult | null {
  if (weight <= 0 || height <= 0) return null

  let bmi: number
  if (unit === "metric") {
    const heightM = height / 100
    bmi = weight / (heightM * heightM)
  } else {
    bmi = (weight / (height * height)) * 703
  }

  let category: string
  let color: string
  if (bmi < 18.5) {
    category = "Underweight"
    color = "text-blue-500"
  } else if (bmi < 25) {
    category = "Normal weight"
    color = "text-green-500"
  } else if (bmi < 30) {
    category = "Overweight"
    color = "text-yellow-500"
  } else {
    category = "Obese"
    color = "text-red-500"
  }

  return { bmi: Math.round(bmi * 10) / 10, category, color }
}

export default function BmiCalculator() {
  const [unit, setUnit] = useState<Unit>("metric")
  const [weight, setWeight] = useState("")
  const [height, setHeight] = useState("")
  const [result, setResult] = useState<BMIResult | null>(null)
  const [, setHistory] = useLocalStorage<HistoryItem[]>(
    "bmi-calculator-history",
    []
  )

  function handleCalculate() {
    const r = calcBMI(Number(weight), Number(height), unit)
    setResult(r)

    if (r) {
      const params = new URLSearchParams({ w: weight, h: height, u: unit })
      const url = `${window.location.origin}/tools/bmi-calculator?${params}`
      setHistory((prev) => [
        {
          id: crypto.randomUUID(),
          timestamp: Date.now(),
          inputs: { weight, height, unit },
          result: { bmi: r.bmi, category: r.category },
          shareableUrl: url,
        },
        ...prev.slice(0, 9),
      ])
    }
  }

  function getShareUrl() {
    const params = new URLSearchParams({ w: weight, h: height, u: unit })
    return `${typeof window !== "undefined" ? window.location.origin : ""}/tools/bmi-calculator?${params}`
  }

  const summary = result
    ? `BMI: ${result.bmi} - ${result.category}`
    : ""

  const ranges = [
    { label: "Underweight", range: "< 18.5", color: "bg-blue-500" },
    { label: "Normal", range: "18.5 – 24.9", color: "bg-green-500" },
    { label: "Overweight", range: "25 – 29.9", color: "bg-yellow-500" },
    { label: "Obese", range: "≥ 30", color: "bg-red-500" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <Button
          variant={unit === "metric" ? "default" : "secondary"}
          size="sm"
          onClick={() => { setUnit("metric"); setResult(null) }}
        >
          Metric (kg/cm)
        </Button>
        <Button
          variant={unit === "imperial" ? "default" : "secondary"}
          size="sm"
          onClick={() => { setUnit("imperial"); setResult(null) }}
        >
          Imperial (lbs/in)
        </Button>
      </div>

      <div className="grid max-w-md gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label>Weight ({unit === "metric" ? "kg" : "lbs"})</Label>
          <Input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder={unit === "metric" ? "e.g. 70" : "e.g. 154"}
          />
        </div>
        <div className="space-y-1.5">
          <Label>Height ({unit === "metric" ? "cm" : "inches"})</Label>
          <Input
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            placeholder={unit === "metric" ? "e.g. 175" : "e.g. 69"}
          />
        </div>
      </div>

      <Button onClick={handleCalculate}>Calculate BMI</Button>

      {result && (
        <div className="space-y-4">
          <div className="flex items-center gap-3 rounded-xl bg-primary/10 p-4">
            <div>
              <div className="text-sm text-muted-foreground">Your BMI</div>
              <div className="text-3xl font-bold">{result.bmi}</div>
              <div className={`font-semibold ${result.color}`}>
                {result.category}
              </div>
            </div>
            <CopyButton value={summary} className="ml-auto" />
          </div>

          <div className="space-y-2">
            <div className="text-sm font-medium">BMI Categories</div>
            {ranges.map((r) => (
              <div key={r.label} className="flex items-center gap-2 text-sm">
                <div className={`size-3 rounded-full ${r.color}`} />
                <span className="w-24">{r.label}</span>
                <span className="text-muted-foreground">{r.range}</span>
              </div>
            ))}
          </div>

          <ShareResult
            url={getShareUrl()}
            resultText={`My BMI is ${result.bmi} (${result.category}).`}
            toolName="BMI Calculator"
            hashtags={["BMI", "Health"]}
          />
        </div>
      )}

      <CalculationHistory
        toolSlug="bmi-calculator"
        formatResult={(r) => {
          const res = r as { bmi: number; category: string }
          return `BMI: ${res.bmi} - ${res.category}`
        }}
        formatInputs={(inputs) =>
          `${inputs.weight}${inputs.unit === "metric" ? "kg" : "lbs"}, ${inputs.height}${inputs.unit === "metric" ? "cm" : "in"}`
        }
      />
    </div>
  )
}
