"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { CopyButton } from "@/components/ui/copy-button"

interface Assignment {
  id: string
  name: string
  score: string
  total: string
  weight: string
}

function getLetterGrade(pct: number): string {
  if (pct >= 93) return "A"
  if (pct >= 90) return "A-"
  if (pct >= 87) return "B+"
  if (pct >= 83) return "B"
  if (pct >= 80) return "B-"
  if (pct >= 77) return "C+"
  if (pct >= 73) return "C"
  if (pct >= 70) return "C-"
  if (pct >= 67) return "D+"
  if (pct >= 63) return "D"
  if (pct >= 60) return "D-"
  return "F"
}

function newAssignment(): Assignment {
  return { id: crypto.randomUUID(), name: "", score: "", total: "100", weight: "" }
}

export default function GradeCalculator() {
  const [mode, setMode] = useState<"simple" | "weighted">("simple")
  const [assignments, setAssignments] = useState<Assignment[]>([newAssignment(), newAssignment(), newAssignment()])

  function update(id: string, field: keyof Assignment, value: string) {
    setAssignments((prev) => prev.map((a) => (a.id === id ? { ...a, [field]: value } : a)))
  }

  function addRow() {
    setAssignments((prev) => [...prev, newAssignment()])
  }

  function removeRow(id: string) {
    if (assignments.length <= 1) return
    setAssignments((prev) => prev.filter((a) => a.id !== id))
  }

  const validAssignments = assignments.filter((a) => Number(a.score) >= 0 && Number(a.total) > 0)

  let finalPct = 0
  if (mode === "simple") {
    const totalScore = validAssignments.reduce((s, a) => s + Number(a.score), 0)
    const totalPossible = validAssignments.reduce((s, a) => s + Number(a.total), 0)
    finalPct = totalPossible > 0 ? (totalScore / totalPossible) * 100 : 0
  } else {
    const weighted = validAssignments.filter((a) => Number(a.weight) > 0)
    const totalWeight = weighted.reduce((s, a) => s + Number(a.weight), 0)
    if (totalWeight > 0) {
      finalPct = weighted.reduce((s, a) => s + (Number(a.score) / Number(a.total)) * 100 * (Number(a.weight) / totalWeight), 0)
    }
  }

  const letterGrade = getLetterGrade(finalPct)
  const summary = `Grade: ${finalPct.toFixed(2)}% (${letterGrade})`

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <Button variant={mode === "simple" ? "default" : "secondary"} size="sm" onClick={() => setMode("simple")}>Simple Average</Button>
        <Button variant={mode === "weighted" ? "default" : "secondary"} size="sm" onClick={() => setMode("weighted")}>Weighted Average</Button>
      </div>

      <div className="space-y-3">
        {assignments.map((a, i) => (
          <div key={a.id} className="flex flex-wrap items-end gap-2">
            <div className="space-y-1">
              <Label className="text-xs">Assignment</Label>
              <Input value={a.name} onChange={(e) => update(a.id, "name", e.target.value)} placeholder={`Assignment ${i + 1}`} className="w-32" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Score</Label>
              <Input type="number" value={a.score} onChange={(e) => update(a.id, "score", e.target.value)} placeholder="85" className="w-20" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Out of</Label>
              <Input type="number" value={a.total} onChange={(e) => update(a.id, "total", e.target.value)} placeholder="100" className="w-20" />
            </div>
            {mode === "weighted" && (
              <div className="space-y-1">
                <Label className="text-xs">Weight (%)</Label>
                <Input type="number" value={a.weight} onChange={(e) => update(a.id, "weight", e.target.value)} placeholder="20" className="w-20" />
              </div>
            )}
            <Button variant="ghost" size="sm" onClick={() => removeRow(a.id)} className="text-destructive">Remove</Button>
          </div>
        ))}
      </div>

      <Button variant="outline" size="sm" onClick={addRow}>+ Add Assignment</Button>

      {validAssignments.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-4 rounded-xl bg-primary/10 p-4">
            <div className="text-center">
              <div className="text-xs text-muted-foreground">Final Grade</div>
              <div className="text-2xl font-bold text-primary">{finalPct.toFixed(2)}%</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-muted-foreground">Letter Grade</div>
              <div className="text-2xl font-bold">{letterGrade}</div>
            </div>
            <CopyButton value={summary} />
          </div>
        </div>
      )}
    </div>
  )
}
