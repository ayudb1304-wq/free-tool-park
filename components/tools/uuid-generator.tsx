"use client"

import { useState, useCallback } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { CopyButton } from "@/components/ui/copy-button"

export default function UuidGenerator() {
  const [count, setCount] = useState(1)
  const [uppercase, setUppercase] = useState(false)
  const [hyphens, setHyphens] = useState(true)
  const [uuids, setUuids] = useState<string[]>([])

  const generate = useCallback(() => {
    const results: string[] = []
    for (let i = 0; i < count; i++) {
      let uuid = crypto.randomUUID()
      if (!hyphens) uuid = uuid.replace(/-/g, "")
      if (uppercase) uuid = uuid.toUpperCase()
      results.push(uuid)
    }
    setUuids(results)
  }, [count, uppercase, hyphens])

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end gap-4">
        <div className="space-y-1.5">
          <Label>Count</Label>
          <Input
            type="number"
            min={1}
            max={100}
            value={count}
            onChange={(e) =>
              setCount(Math.min(100, Math.max(1, Number(e.target.value))))
            }
            className="w-24"
          />
        </div>
        <div className="flex gap-3">
          {[
            { label: "Hyphens", checked: hyphens, set: setHyphens },
            { label: "Uppercase", checked: uppercase, set: setUppercase },
          ].map((opt) => (
            <label
              key={opt.label}
              className="flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 text-sm has-[:checked]:border-primary has-[:checked]:bg-primary/5"
            >
              <input
                type="checkbox"
                checked={opt.checked}
                onChange={(e) => opt.set(e.target.checked)}
                className="accent-primary"
              />
              {opt.label}
            </label>
          ))}
        </div>
      </div>

      <Button onClick={generate}>
        Generate UUID{count > 1 ? "s" : ""}
      </Button>

      {uuids.length > 0 && (
        <div className="space-y-2">
          {uuids.map((uuid, i) => (
            <div
              key={i}
              className="flex items-center gap-2 rounded-xl border bg-muted/30 px-3 py-2"
            >
              <code className="min-w-0 flex-1 font-mono text-sm">{uuid}</code>
              <CopyButton value={uuid} />
            </div>
          ))}
          {uuids.length > 1 && (
            <CopyButton value={uuids.join("\n")} label="Copy All" />
          )}
        </div>
      )}
    </div>
  )
}
