import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import type { Tool } from "@/data/tools"

interface PeopleAlsoUsedProps {
  tools: Tool[]
}

export function PeopleAlsoUsed({ tools }: PeopleAlsoUsedProps) {
  if (tools.length === 0) return null

  return (
    <section className="mb-8">
      <h2 className="font-heading mb-4 text-xl font-bold">
        People Also Used
      </h2>
      <div className="grid gap-3 sm:grid-cols-3">
        {tools.slice(0, 3).map((tool) => (
          <Link
            key={tool.slug}
            href={`/tools/${tool.slug}`}
            className="group flex items-center gap-3 rounded-xl border bg-card p-4 transition-all hover:border-primary/30 hover:shadow-md"
          >
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
              <HugeiconsIcon icon={tool.icon} size={20} />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{tool.name}</p>
              <p className="truncate text-xs text-muted-foreground">
                Free, no signup
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
