"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { CopyButton } from "@/components/ui/copy-button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Course {
  id: string
  name: string
  credits: string
  grade: string
}

const GRADES: { label: string; value: number }[] = [
  { label: "A+", value: 4.0 },
  { label: "A", value: 4.0 },
  { label: "A-", value: 3.7 },
  { label: "B+", value: 3.3 },
  { label: "B", value: 3.0 },
  { label: "B-", value: 2.7 },
  { label: "C+", value: 2.3 },
  { label: "C", value: 2.0 },
  { label: "C-", value: 1.7 },
  { label: "D+", value: 1.3 },
  { label: "D", value: 1.0 },
  { label: "D-", value: 0.7 },
  { label: "F", value: 0.0 },
]

function newCourse(): Course {
  return { id: crypto.randomUUID(), name: "", credits: "3", grade: "A" }
}

function getGradeValue(grade: string): number {
  return GRADES.find((g) => g.label === grade)?.value ?? 0
}

export default function GpaCalculator() {
  const [courses, setCourses] = useState<Course[]>([newCourse(), newCourse(), newCourse(), newCourse()])

  function updateCourse(id: string, field: keyof Course, value: string) {
    setCourses((prev) => prev.map((c) => (c.id === id ? { ...c, [field]: value } : c)))
  }

  function addCourse() {
    setCourses((prev) => [...prev, newCourse()])
  }

  function removeCourse(id: string) {
    if (courses.length <= 1) return
    setCourses((prev) => prev.filter((c) => c.id !== id))
  }

  const validCourses = courses.filter((c) => Number(c.credits) > 0)
  const totalCredits = validCourses.reduce((s, c) => s + Number(c.credits), 0)
  const totalPoints = validCourses.reduce((s, c) => s + getGradeValue(c.grade) * Number(c.credits), 0)
  const gpa = totalCredits > 0 ? totalPoints / totalCredits : 0

  const summary = `GPA: ${gpa.toFixed(2)} | Total Credits: ${totalCredits} | Quality Points: ${totalPoints.toFixed(1)}`

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        {courses.map((c, i) => (
          <div key={c.id} className="flex flex-wrap items-end gap-2">
            <div className="space-y-1">
              <Label className="text-xs">Course</Label>
              <Input value={c.name} onChange={(e) => updateCourse(c.id, "name", e.target.value)} placeholder={`Course ${i + 1}`} className="w-36" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Credits</Label>
              <Input type="number" min={0} max={12} value={c.credits} onChange={(e) => updateCourse(c.id, "credits", e.target.value)} className="w-20" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Grade</Label>
              <Select value={c.grade} onValueChange={(v) => updateCourse(c.id, "grade", v)}>
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {GRADES.map((g) => (
                    <SelectItem key={g.label} value={g.label}>{g.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button variant="ghost" size="sm" onClick={() => removeCourse(c.id)} className="text-destructive">Remove</Button>
          </div>
        ))}
      </div>

      <Button variant="outline" size="sm" onClick={addCourse}>+ Add Course</Button>

      {validCourses.length > 0 && (
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl bg-primary/10 p-4 text-center">
              <div className="text-xs text-muted-foreground">GPA</div>
              <div className="text-3xl font-bold text-primary">{gpa.toFixed(2)}</div>
            </div>
            <div className="rounded-xl border p-4 text-center">
              <div className="text-xs text-muted-foreground">Total Credits</div>
              <div className="text-xl font-semibold">{totalCredits}</div>
            </div>
            <div className="rounded-xl border p-4 text-center">
              <div className="text-xs text-muted-foreground">Quality Points</div>
              <div className="text-xl font-semibold">{totalPoints.toFixed(1)}</div>
            </div>
          </div>
          <CopyButton value={summary} label="Copy Results" />
        </div>
      )}
    </div>
  )
}
