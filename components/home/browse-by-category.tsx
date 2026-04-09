import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import { CATEGORIES } from "@/data/categories"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export function BrowseByCategory() {
  return (
    <section className="mt-12">
      <h2 className="mb-6 text-2xl font-semibold">Browse by Category</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CATEGORIES.map((cat) => (
          <Link key={cat.slug} href={`/categories/${cat.slug}`}>
            <Card
              size="sm"
              className="h-full transition-shadow hover:shadow-lg"
            >
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <HugeiconsIcon icon={cat.icon} size={20} />
                  </div>
                  <div className="min-w-0">
                    <CardTitle className="text-sm">{cat.name}</CardTitle>
                    <CardDescription className="line-clamp-2 text-xs">
                      {cat.description}
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
