"use client"

import { useState } from "react"

export function ToolRequestForm() {
  const [toolName, setToolName] = useState("")
  const [description, setDescription] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Client-side only — stores in localStorage for now
    try {
      const existing = JSON.parse(
        localStorage.getItem("tool-requests") || "[]"
      )
      existing.push({
        toolName,
        description,
        timestamp: Date.now(),
      })
      localStorage.setItem("tool-requests", JSON.stringify(existing))
    } catch {
      // Silently fail for private browsing
    }
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="rounded-lg bg-green-50 p-8 text-center dark:bg-green-950">
        <h3 className="text-xl font-semibold text-green-800 dark:text-green-200">
          Thanks for your suggestion!
        </h3>
        <p className="mt-2 text-green-700 dark:text-green-300">
          We&apos;ve noted your request. Check back to see if it gets built!
        </p>
        <button
          onClick={() => {
            setSubmitted(false)
            setToolName("")
            setDescription("")
          }}
          className="mt-4 text-sm font-medium text-green-600 hover:underline dark:text-green-400"
        >
          Submit another request
        </button>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-lg border bg-muted/20 p-6"
    >
      <div className="space-y-4">
        <div>
          <label
            htmlFor="toolName"
            className="mb-1 block text-sm font-medium"
          >
            What tool do you wish existed?{" "}
            <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="toolName"
            value={toolName}
            onChange={(e) => setToolName(e.target.value)}
            placeholder="e.g., IBAN Validator, Cron Expression Builder"
            required
            className="w-full rounded-md border bg-background px-4 py-2 focus:border-primary focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="mb-1 block text-sm font-medium"
          >
            Why do you need this tool? (optional)
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="Help us understand your use case..."
            className="w-full rounded-md border bg-background px-4 py-2 focus:border-primary focus:ring-2 focus:ring-primary"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-md bg-primary py-3 font-medium text-primary-foreground transition hover:bg-primary/90"
        >
          Submit Request
        </button>
      </div>
    </form>
  )
}
