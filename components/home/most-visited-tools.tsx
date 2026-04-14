import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import { MOST_VISITED_TOOLS } from "@/data/most-visited"
import { BUILT_TOOL_SLUGS } from "@/lib/built-tools"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"

const PRIORITY_LABEL: Record<string, string> = {
  P0: "Popular",
  P1: "Trending",
  P2: "Useful",
}

export function MostVisitedTools() {
  const builtTools = MOST_VISITED_TOOLS.filter((t) =>
    BUILT_TOOL_SLUGS.has(t.slug)
  )
  const comingSoonTools = MOST_VISITED_TOOLS.filter(
    (t) => !BUILT_TOOL_SLUGS.has(t.slug)
  )

  return (
    <section className="mt-12">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Most Visited Tools</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Our most popular free tools, used by millions every month
          </p>
        </div>
      </div>

      {/* Built tools: featured grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {builtTools.map((tool) => (
          <Link key={tool.slug} href={`/tools/${tool.slug}`}>
            <Card
              size="sm"
              className="group h-full border-primary/10 transition-all hover:border-primary/30 hover:shadow-lg"
            >
              <CardHeader>
                <div className="flex items-start gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
                    <HugeiconsIcon icon={tool.icon} size={22} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-sm">{tool.name}</CardTitle>
                      {tool.priority === "P0" && (
                        <Badge
                          variant="secondary"
                          className="shrink-0 text-[10px] px-1.5 py-0"
                        >
                          {PRIORITY_LABEL[tool.priority]}
                        </Badge>
                      )}
                    </div>
                    <CardDescription className="mt-0.5 line-clamp-2 text-xs">
                      {tool.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>

      {/* Coming soon tools */}
      {comingSoonTools.length > 0 && (
        <div className="mt-6">
          <h3 className="mb-3 text-sm font-medium text-muted-foreground">
            Coming Soon
          </h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {comingSoonTools.map((tool) => (
              <div
                key={tool.slug}
                className="flex items-center gap-3 rounded-xl border border-dashed border-muted-foreground/20 px-4 py-3 opacity-60"
              >
                <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                  <HugeiconsIcon icon={tool.icon} size={16} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium">{tool.name}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {tool.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
