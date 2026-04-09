"use client"

import { useLocalStorage } from "@/hooks/use-local-storage"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Clock01Icon,
  Delete02Icon,
  ArrowUpRight01Icon,
} from "@hugeicons/core-free-icons"
import Link from "next/link"

export interface HistoryItem {
  id: string
  timestamp: number
  inputs: Record<string, unknown>
  result: unknown
  shareableUrl: string
}

interface CalculationHistoryProps {
  toolSlug: string
  formatResult: (result: unknown) => string
  formatInputs: (inputs: Record<string, unknown>) => string
}

export function CalculationHistory({
  toolSlug,
  formatResult,
  formatInputs,
}: CalculationHistoryProps) {
  const [history, setHistory, clearHistory] = useLocalStorage<HistoryItem[]>(
    `${toolSlug}-history`,
    []
  )

  if (history.length === 0) {
    return null
  }

  const removeItem = (id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id))
  }

  return (
    <div className="mt-8 overflow-hidden rounded-lg border">
      <div className="flex items-center justify-between border-b p-4">
        <h3 className="flex items-center gap-2 font-semibold">
          <HugeiconsIcon icon={Clock01Icon} size={16} />
          Your Recent Calculations
        </h3>
        <button
          onClick={clearHistory}
          className="text-sm text-muted-foreground transition hover:text-red-500"
        >
          Clear All
        </button>
      </div>

      <ul className="divide-y">
        {history.slice(0, 5).map((item) => (
          <li
            key={item.id}
            className="flex items-center justify-between p-4 hover:bg-muted/30"
          >
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">
                {formatResult(item.result)}
              </p>
              <p className="truncate text-sm text-muted-foreground">
                {formatInputs(item.inputs)}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {new Date(item.timestamp).toLocaleDateString()}
              </p>
            </div>
            <div className="ml-4 flex items-center gap-2">
              <Link
                href={item.shareableUrl}
                className="rounded-md p-2 hover:bg-muted"
                title="Open this calculation"
              >
                <HugeiconsIcon icon={ArrowUpRight01Icon} size={16} />
              </Link>
              <button
                onClick={() => removeItem(item.id)}
                className="rounded-md p-2 transition hover:bg-red-100 hover:text-red-500"
                title="Remove from history"
              >
                <HugeiconsIcon icon={Delete02Icon} size={16} />
              </button>
            </div>
          </li>
        ))}
      </ul>

      <p className="bg-muted/30 p-3 text-center text-xs text-muted-foreground">
        History is saved locally in your browser. No account needed.
      </p>
    </div>
  )
}
