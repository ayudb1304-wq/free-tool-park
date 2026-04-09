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

const TIP_PRESETS = [10, 15, 18, 20, 25]

export default function TipCalculator() {
  const [bill, setBill] = useState("")
  const [tipPercent, setTipPercent] = useState("15")
  const [people, setPeople] = useState("1")
  const [calculated, setCalculated] = useState(false)
  const [, setHistory] = useLocalStorage<HistoryItem[]>(
    "tip-calculator-history",
    []
  )

  function handleCalculate() {
    setCalculated(true)

    const billNum = Number(bill)
    const tipNum = Number(tipPercent)
    const tipAmount = billNum * (tipNum / 100)
    const total = billNum + tipAmount

    if (billNum > 0) {
      const params = new URLSearchParams({ b: bill, tp: tipPercent, p: people })
      const url = `${window.location.origin}/tools/tip-calculator?${params}`
      setHistory((prev) => [
        {
          id: crypto.randomUUID(),
          timestamp: Date.now(),
          inputs: { bill, tipPercent, people },
          result: { tipAmount, total },
          shareableUrl: url,
        },
        ...prev.slice(0, 9),
      ])
    }
  }

  function getShareUrl() {
    const params = new URLSearchParams({ b: bill, tp: tipPercent, p: people })
    return `${typeof window !== "undefined" ? window.location.origin : ""}/tools/tip-calculator?${params}`
  }

  const billNum = Number(bill)
  const tipNum = Number(tipPercent)
  const peopleNum = Math.max(1, Number(people))

  const tipAmount = billNum * (tipNum / 100)
  const total = billNum + tipAmount
  const perPerson = total / peopleNum
  const tipPerPerson = tipAmount / peopleNum

  function fmt(n: number) {
    return n.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    })
  }

  const summary = `Bill: ${fmt(billNum)} | Tip (${tipNum}%): ${fmt(tipAmount)} | Total: ${fmt(total)}${peopleNum > 1 ? ` | Per person: ${fmt(perPerson)}` : ""}`

  return (
    <div className="space-y-6">
      <div className="grid max-w-lg gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label>Bill Amount ($)</Label>
          <Input
            type="number"
            step="0.01"
            value={bill}
            onChange={(e) => setBill(e.target.value)}
            placeholder="e.g. 85.50"
          />
        </div>
        <div className="space-y-1.5">
          <Label>Number of People</Label>
          <Input
            type="number"
            min={1}
            value={people}
            onChange={(e) => setPeople(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Tip Percentage</Label>
        <div className="flex flex-wrap gap-2">
          {TIP_PRESETS.map((p) => (
            <Button
              key={p}
              variant={tipPercent === String(p) ? "default" : "secondary"}
              size="sm"
              onClick={() => setTipPercent(String(p))}
            >
              {p}%
            </Button>
          ))}
          <Input
            type="number"
            min={0}
            value={tipPercent}
            onChange={(e) => setTipPercent(e.target.value)}
            className="w-20"
            placeholder="%"
          />
        </div>
      </div>

      <Button onClick={handleCalculate}>Calculate Tip</Button>

      {calculated && billNum > 0 && (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl bg-muted p-4 text-center">
              <div className="text-xs text-muted-foreground">Tip Amount</div>
              <div className="text-xl font-bold">{fmt(tipAmount)}</div>
            </div>
            <div className="rounded-xl bg-primary/10 p-4 text-center">
              <div className="text-xs text-muted-foreground">Total</div>
              <div className="text-xl font-bold text-primary">{fmt(total)}</div>
            </div>
            {peopleNum > 1 && (
              <>
                <div className="rounded-xl bg-muted p-4 text-center">
                  <div className="text-xs text-muted-foreground">
                    Tip per Person
                  </div>
                  <div className="text-xl font-bold">{fmt(tipPerPerson)}</div>
                </div>
                <div className="rounded-xl bg-muted p-4 text-center">
                  <div className="text-xs text-muted-foreground">
                    Total per Person
                  </div>
                  <div className="text-xl font-bold">{fmt(perPerson)}</div>
                </div>
              </>
            )}
          </div>

          <CopyButton value={summary} label="Copy Results" />

          <ShareResult
            url={getShareUrl()}
            resultText={`Tip: ${fmt(tipAmount)}, Total: ${fmt(total)}`}
            toolName="Tip Calculator"
            hashtags={["Tip", "Finance"]}
          />
        </div>
      )}

      <CalculationHistory
        toolSlug="tip-calculator"
        formatResult={(r) => {
          const res = r as { total: number }
          return fmt(res.total)
        }}
        formatInputs={(inputs) =>
          `${fmt(Number(inputs.bill))}, ${inputs.tipPercent}%`
        }
      />
    </div>
  )
}
