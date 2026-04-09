import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import type { Tool } from "@/data/tools"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"

interface RecentlyAddedProps {
  tools: Tool[]
}

export function RecentlyAdded({ tools }: RecentlyAddedProps) {
  if (tools.length === 0) return null

  return (
    <section className="mt-12">
      <h2 className="mb-6 text-2xl font-semibold">Recently Added Tools</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <Link key={tool.slug} href={`/tools/${tool.slug}`}>
            <Card
              size="sm"
              className="h-full transition-shadow hover:shadow-lg"
            >
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <HugeiconsIcon icon={tool.icon} size={20} />
                  </div>
                  <div className="min-w-0">
                    <CardTitle className="text-sm">{tool.name}</CardTitle>
                    <CardDescription className="line-clamp-2 text-xs">
                      {tool.metaDescription}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  )
}
