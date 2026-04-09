"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { CopyButton } from "@/components/ui/copy-button"

const WORDS = [
  "lorem","ipsum","dolor","sit","amet","consectetur","adipiscing","elit","sed","do",
  "eiusmod","tempor","incididunt","ut","labore","et","dolore","magna","aliqua","enim",
  "ad","minim","veniam","quis","nostrud","exercitation","ullamco","laboris","nisi",
  "aliquip","ex","ea","commodo","consequat","duis","aute","irure","in","reprehenderit",
  "voluptate","velit","esse","cillum","fugiat","nulla","pariatur","excepteur","sint",
  "occaecat","cupidatat","non","proident","sunt","culpa","qui","officia","deserunt",
  "mollit","anim","id","est","laborum","blandit","volutpat","maecenas","accumsan",
  "lacus","vel","facilisis","volutpat","cras","semper","auctor","neque","vitae",
  "tempus","quam","pellentesque","nec","nam","aliquam","faucibus","purus","orci",
  "dapibus","ultrices","posuere","cubilia","curae","donec","velit","integer","felis",
]

function randomWord() {
  return WORDS[Math.floor(Math.random() * WORDS.length)]
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

function generateSentence(minWords: number, maxWords: number): string {
  const count = minWords + Math.floor(Math.random() * (maxWords - minWords + 1))
  const words = Array.from({ length: count }, () => randomWord())
  words[0] = capitalize(words[0])
  return words.join(" ") + "."
}

function generateParagraph(): string {
  const sentenceCount = 4 + Math.floor(Math.random() * 4)
  return Array.from({ length: sentenceCount }, () => generateSentence(6, 14)).join(" ")
}

type OutputType = "paragraphs" | "sentences" | "words"

export default function LoremIpsumGenerator() {
  const [count, setCount] = useState("3")
  const [outputType, setOutputType] = useState<OutputType>("paragraphs")
  const [startWithLorem, setStartWithLorem] = useState(true)
  const [output, setOutput] = useState("")

  function generate() {
    const n = Math.max(1, Math.min(100, Number(count)))
    let result = ""

    if (outputType === "paragraphs") {
      const paragraphs = Array.from({ length: n }, () => generateParagraph())
      if (startWithLorem) {
        paragraphs[0] = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. " + paragraphs[0]
      }
      result = paragraphs.join("\n\n")
    } else if (outputType === "sentences") {
      const sentences = Array.from({ length: n }, () => generateSentence(6, 14))
      if (startWithLorem) {
        sentences[0] = "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
      }
      result = sentences.join(" ")
    } else {
      const words = Array.from({ length: n }, () => randomWord())
      if (startWithLorem && n >= 2) {
        words[0] = "lorem"
        words[1] = "ipsum"
      }
      result = capitalize(words.join(" ")) + "."
    }

    setOutput(result)
  }

  const types: { key: OutputType; label: string }[] = [
    { key: "paragraphs", label: "Paragraphs" },
    { key: "sentences", label: "Sentences" },
    { key: "words", label: "Words" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end gap-4">
        <div className="space-y-1.5">
          <Label>Count</Label>
          <Input type="number" min={1} max={100} value={count} onChange={(e) => setCount(e.target.value)} className="w-24" />
        </div>
        <div className="flex flex-wrap gap-2">
          {types.map((t) => (
            <Button key={t.key} variant={outputType === t.key ? "default" : "secondary"} size="sm" onClick={() => setOutputType(t.key)}>
              {t.label}
            </Button>
          ))}
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={startWithLorem} onChange={(e) => setStartWithLorem(e.target.checked)} className="rounded" />
          Start with &quot;Lorem ipsum...&quot;
        </label>
      </div>

      <Button onClick={generate}>Generate Lorem Ipsum</Button>

      {output && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {output.split(/\s+/).length} words
            </span>
            <CopyButton value={output} label="Copy Text" />
          </div>
          <div className="max-h-96 overflow-auto rounded-xl border bg-muted p-4 text-sm whitespace-pre-wrap">
            {output}
          </div>
        </div>
      )}
    </div>
  )
}
