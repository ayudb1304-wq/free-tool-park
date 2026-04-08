"use client"

import { useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { CopyButton } from "@/components/ui/copy-button"

async function sha256(message: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(message)
  const hashBuffer = await crypto.subtle.digest("SHA-256", data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
}

export default function Sha256Generator() {
  const [input, setInput] = useState("")
  const [hash, setHash] = useState("")

  async function generate() {
    if (!input) return
    setHash(await sha256(input))
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Input Text</label>
        <Textarea
          placeholder="Enter text to generate SHA-256 hash..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="min-h-[120px] font-mono text-sm"
          spellCheck={false}
        />
      </div>

      <Button onClick={generate} size="sm">
        Generate SHA-256 Hash
      </Button>

      {hash && (
        <div className="flex items-center gap-2 rounded-xl border bg-muted/30 px-4 py-3">
          <code className="min-w-0 flex-1 break-all font-mono text-sm">
            {hash}
          </code>
          <CopyButton value={hash} />
        </div>
      )}
    </div>
  )
}
