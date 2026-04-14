import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import type { Tool } from "@/data/tools"

interface NextStepCtaProps {
  currentTool: Tool
  nextTool: Tool
}

export function NextStepCta({ currentTool, nextTool }: NextStepCtaProps) {
  return (
    <div className="mb-8 flex items-center gap-4 rounded-xl border border-primary/20 bg-primary/5 p-4">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <HugeiconsIcon icon={nextTool.icon} size={20} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm text-muted-foreground">
          Done with the {currentTool.name}? Try this next:
        </p>
        <Link
          href={`/tools/${nextTool.slug}`}
          className="font-semibold text-primary hover:underline"
        >
          {nextTool.name} &rarr;
        </Link>
      </div>
    </div>
  )
}
