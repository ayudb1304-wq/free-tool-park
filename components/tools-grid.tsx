"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import { Search01Icon } from "@hugeicons/core-free-icons"
import { CATEGORIES } from "@/data/categories"
import type { Tool } from "@/data/tools"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"

interface ToolsGridProps {
  tools: Tool[]
  showSearch?: boolean
  showCategoryFilter?: boolean
}

export function ToolsGrid({
  tools,
  showSearch = true,
  showCategoryFilter = true,
}: ToolsGridProps) {
  const [query, setQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const filtered = useMemo(() => {
    let result = tools

    if (activeCategory) {
      result = result.filter((t) => t.category === activeCategory)
    }

    if (query.trim()) {
      const q = query.toLowerCase()
      result = result.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.metaDescription.toLowerCase().includes(q) ||
          t.keywords.some((k) => k.toLowerCase().includes(q))
      )
    }

    return result
  }, [tools, query, activeCategory])

  return (
    <div className="space-y-6">
      {showSearch && (
        <div className="relative max-w-md">
          <HugeiconsIcon
            icon={Search01Icon}
            size={16}
            className="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            placeholder="Search tools..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      )}

      {showCategoryFilter && (
        <div className="flex flex-wrap gap-2">
          <Badge
            variant={activeCategory === null ? "default" : "secondary"}
            className="cursor-pointer"
            onClick={() => setActiveCategory(null)}
          >
            All
          </Badge>
          {CATEGORIES.map((cat) => (
            <Badge
              key={cat.slug}
              variant={activeCategory === cat.slug ? "default" : "secondary"}
              className="cursor-pointer"
              onClick={() =>
                setActiveCategory(
                  activeCategory === cat.slug ? null : cat.slug
                )
              }
            >
              {cat.name}
            </Badge>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <p className="py-12 text-center text-muted-foreground">
          No tools found. Try a different search term.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((tool) => (
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
      )}
    </div>
  )
}
