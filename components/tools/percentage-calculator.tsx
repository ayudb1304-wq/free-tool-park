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

type Mode = "of" | "change" | "is-what-percent"

export default function PercentageCalculator() {
  const [mode, setMode] = useState<Mode>("of")
  const [a, setA] = useState("")
  const [b, setB] = useState("")
  const [result, setResult] = useState<string | null>(null)
  const [, setHistory] = useLocalStorage<HistoryItem[]>(
    "percentage-calculator-history",
    []
  )

  function calc() {
    const numA = Number(a)
    const numB = Number(b)
    if (isNaN(numA) || isNaN(numB)) {
      setResult("Please enter valid numbers.")
      return
    }

    let r: number
    let label: string
    switch (mode) {
      case "of":
        r = (numA / 100) * numB
        label = `${a}% of ${b} = ${r.toLocaleString("en-US", { maximumFractionDigits: 6 })}`
        break
      case "change":
        if (numA === 0) {
          setResult("Original value cannot be zero.")
          return
        }
        r = ((numB - numA) / numA) * 100
        label = `Change from ${a} to ${b} = ${r.toLocaleString("en-US", { maximumFractionDigits: 4 })}%`
        break
      case "is-what-percent":
        if (numB === 0) {
          setResult("Total cannot be zero.")
          return
        }
        r = (numA / numB) * 100
        label = `${a} is ${r.toLocaleString("en-US", { maximumFractionDigits: 4 })}% of ${b}`
        break
    }

    setResult(label)

    const params = new URLSearchParams({ m: mode, a, b })
    const url = `${window.location.origin}/tools/percentage-calculator?${params}`
    setHistory((prev) => [
      {
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        inputs: { a, b, mode },
        result: { label },
        shareableUrl: url,
      },
      ...prev.slice(0, 9),
    ])
  }

  function getShareUrl() {
    const params = new URLSearchParams({ m: mode, a, b })
    return `${typeof window !== "undefined" ? window.location.origin : ""}/tools/percentage-calculator?${params}`
  }

  const modes: { key: Mode; label: string }[] = [
    { key: "of", label: "X% of Y" },
    { key: "change", label: "% Change" },
    { key: "is-what-percent", label: "X is what % of Y" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {modes.map((m) => (
          <Button
            key={m.key}
            variant={mode === m.key ? "default" : "secondary"}
            size="sm"
            onClick={() => {
              setMode(m.key)
              setResult(null)
            }}
          >
            {m.label}
          </Button>
        ))}
      </div>

      <div className="grid max-w-md gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label>
            {mode === "of"
              ? "Percentage (%)"
              : mode === "change"
                ? "Original Value"
                : "Value"}
          </Label>
          <Input
            type="number"
            value={a}
            onChange={(e) => setA(e.target.value)}
            placeholder={mode === "of" ? "e.g. 25" : "e.g. 100"}
          />
        </div>
        <div className="space-y-1.5">
          <Label>
            {mode === "of"
              ? "Number"
              : mode === "change"
                ? "New Value"
                : "Total"}
          </Label>
          <Input
            type="number"
            value={b}
            onChange={(e) => setB(e.target.value)}
            placeholder={mode === "of" ? "e.g. 200" : "e.g. 150"}
          />
        </div>
      </div>

      <Button onClick={calc}>Calculate</Button>

      {result && (
        <div className="space-y-4">
          <div className="flex items-center gap-3 rounded-xl bg-primary/10 p-4">
            <span className="text-lg font-semibold">{result}</span>
            <CopyButton value={result} />
          </div>

          <ShareResult
            url={getShareUrl()}
            resultText={result}
            toolName="Percentage Calculator"
            hashtags={["Percentage", "Math"]}
          />
        </div>
      )}

      <CalculationHistory
        toolSlug="percentage-calculator"
        formatResult={(r) => {
          const res = r as { label: string }
          return res.label
        }}
        formatInputs={(inputs) =>
          `${inputs.a}, ${inputs.b} (${inputs.mode})`
        }
      />
    </div>
  )
}
