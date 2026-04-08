"use client"

import { useState, useCallback } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { CopyButton } from "@/components/ui/copy-button"

const CHARS = {
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  numbers: "0123456789",
  symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?",
}

function getStrength(password: string): { label: string; color: string; percent: number } {
  let score = 0
  if (password.length >= 8) score++
  if (password.length >= 12) score++
  if (password.length >= 16) score++
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++
  if (/\d/.test(password)) score++
  if (/[^a-zA-Z0-9]/.test(password)) score++

  if (score <= 2) return { label: "Weak", color: "bg-red-500", percent: 33 }
  if (score <= 4) return { label: "Medium", color: "bg-yellow-500", percent: 66 }
  return { label: "Strong", color: "bg-green-500", percent: 100 }
}

export default function PasswordGenerator() {
  const [length, setLength] = useState(16)
  const [uppercase, setUppercase] = useState(true)
  const [lowercase, setLowercase] = useState(true)
  const [numbers, setNumbers] = useState(true)
  const [symbols, setSymbols] = useState(true)
  const [count, setCount] = useState(1)
  const [passwords, setPasswords] = useState<string[]>([])

  const generate = useCallback(() => {
    let charset = ""
    if (uppercase) charset += CHARS.uppercase
    if (lowercase) charset += CHARS.lowercase
    if (numbers) charset += CHARS.numbers
    if (symbols) charset += CHARS.symbols
    if (!charset) charset = CHARS.lowercase

    const results: string[] = []
    const array = new Uint32Array(length * count)
    crypto.getRandomValues(array)

    for (let i = 0; i < count; i++) {
      let pw = ""
      for (let j = 0; j < length; j++) {
        pw += charset[array[i * length + j] % charset.length]
      }
      results.push(pw)
    }

    setPasswords(results)
  }, [length, uppercase, lowercase, numbers, symbols, count])

  const strength = passwords[0] ? getStrength(passwords[0]) : null

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-1.5">
          <Label>Length: {length}</Label>
          <Input
            type="range"
            min={4}
            max={128}
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            className="h-9 cursor-pointer"
          />
        </div>
        <div className="space-y-1.5">
          <Label>Count</Label>
          <Input
            type="number"
            min={1}
            max={20}
            value={count}
            onChange={(e) => setCount(Math.min(20, Math.max(1, Number(e.target.value))))}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        {[
          { label: "Uppercase (A-Z)", checked: uppercase, set: setUppercase },
          { label: "Lowercase (a-z)", checked: lowercase, set: setLowercase },
          { label: "Numbers (0-9)", checked: numbers, set: setNumbers },
          { label: "Symbols (!@#$)", checked: symbols, set: setSymbols },
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

      <Button onClick={generate}>Generate Password{count > 1 ? "s" : ""}</Button>

      {passwords.length > 0 && (
        <div className="space-y-3">
          {strength && (
            <div className="flex items-center gap-3">
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                <div
                  className={`h-full rounded-full transition-all ${strength.color}`}
                  style={{ width: `${strength.percent}%` }}
                />
              </div>
              <span className="text-sm font-medium">{strength.label}</span>
            </div>
          )}

          {passwords.map((pw, i) => (
            <div
              key={i}
              className="flex items-center gap-2 rounded-xl border bg-muted/30 p-3"
            >
              <code className="min-w-0 flex-1 break-all font-mono text-sm">
                {pw}
              </code>
              <CopyButton value={pw} />
            </div>
          ))}

          {passwords.length > 1 && (
            <CopyButton
              value={passwords.join("\n")}
              label="Copy All"
            />
          )}
        </div>
      )}
    </div>
  )
}
