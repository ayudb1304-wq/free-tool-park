"use client"

import { useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { CopyButton } from "@/components/ui/copy-button"

type CaseType =
  | "upper"
  | "lower"
  | "title"
  | "sentence"
  | "camel"
  | "pascal"
  | "snake"
  | "kebab"
  | "constant"
  | "toggle"

function convert(text: string, type: CaseType): string {
  const words = text.split(/[\s_-]+/).filter(Boolean)

  switch (type) {
    case "upper":
      return text.toUpperCase()
    case "lower":
      return text.toLowerCase()
    case "title":
      return text.replace(
        /\b\w/g,
        (c) => c.toUpperCase()
      )
    case "sentence":
      return text
        .toLowerCase()
        .replace(/(^\s*\w|[.!?]\s+\w)/g, (c) => c.toUpperCase())
    case "camel":
      return words
        .map((w, i) =>
          i === 0
            ? w.toLowerCase()
            : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
        )
        .join("")
    case "pascal":
      return words
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join("")
    case "snake":
      return words.map((w) => w.toLowerCase()).join("_")
    case "kebab":
      return words.map((w) => w.toLowerCase()).join("-")
    case "constant":
      return words.map((w) => w.toUpperCase()).join("_")
    case "toggle":
      return text
        .split("")
        .map((c) =>
          c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()
        )
        .join("")
  }
}

const CASES: { type: CaseType; label: string; example: string }[] = [
  { type: "upper", label: "UPPERCASE", example: "HELLO WORLD" },
  { type: "lower", label: "lowercase", example: "hello world" },
  { type: "title", label: "Title Case", example: "Hello World" },
  { type: "sentence", label: "Sentence case", example: "Hello world" },
  { type: "camel", label: "camelCase", example: "helloWorld" },
  { type: "pascal", label: "PascalCase", example: "HelloWorld" },
  { type: "snake", label: "snake_case", example: "hello_world" },
  { type: "kebab", label: "kebab-case", example: "hello-world" },
  { type: "constant", label: "CONSTANT_CASE", example: "HELLO_WORLD" },
  { type: "toggle", label: "tOGGLE cASE", example: "hELLO wORLD" },
]

export default function CaseConverter() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [activeCase, setActiveCase] = useState<CaseType | null>(null)

  function handleConvert(type: CaseType) {
    if (!input.trim()) return
    setOutput(convert(input, type))
    setActiveCase(type)
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Input Text</label>
        <Textarea
          placeholder="Type or paste text to convert..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="min-h-[120px] text-sm"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {CASES.map((c) => (
          <Button
            key={c.type}
            variant={activeCase === c.type ? "default" : "secondary"}
            size="sm"
            onClick={() => handleConvert(c.type)}
            title={c.example}
          >
            {c.label}
          </Button>
        ))}
      </div>

      {output && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Output</label>
            <CopyButton value={output} label="Copy Output" />
          </div>
          <Textarea
            value={output}
            readOnly
            className="min-h-[120px] text-sm"
          />
        </div>
      )}
    </div>
  )
}
