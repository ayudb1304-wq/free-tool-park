import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  BookOpen01Icon,
  CalculatorIcon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons"
import {
  BLOG_CATEGORY_LABELS,
  getPopulatedBlogCategories,
  type BlogCategory,
} from "@/data/blog-posts"

interface BlogNavProps {
  /**
   * Which category chip should appear active.
   * Pass a BlogCategory to activate that chip, or "all" on the index page.
   * Undefined hides the active state entirely (useful on post pages where
   * no single filter is applicable).
   */
  activeCategory?: BlogCategory | "all"
}

export function BlogNav({ activeCategory }: BlogNavProps) {
  const categories = getPopulatedBlogCategories()

  return (
    <div className="border-b bg-muted/30">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Left: brand */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm font-semibold hover:text-primary"
        >
          <HugeiconsIcon icon={BookOpen01Icon} size={16} />
          The FreeToolPark Blog
        </Link>

        {/* Middle: category chips */}
        <nav
          aria-label="Blog categories"
          className="flex flex-wrap items-center gap-1.5 text-sm"
        >
          <CategoryChip
            href="/blog"
            label="All posts"
            active={activeCategory === "all"}
          />
          {categories.map((cat) => (
            <CategoryChip
              key={cat}
              href={`/blog#${cat}`}
              label={BLOG_CATEGORY_LABELS[cat]}
              active={activeCategory === cat}
            />
          ))}
        </nav>

        {/* Right: CTA back to tools */}
        <Link
          href="/tools"
          className="inline-flex items-center gap-1.5 rounded-full border bg-card px-3 py-1.5 text-sm font-medium transition-colors hover:border-primary hover:text-primary"
        >
          <HugeiconsIcon icon={CalculatorIcon} size={14} />
          Browse calculators
          <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
        </Link>
      </div>
    </div>
  )
}

function CategoryChip({
  href,
  label,
  active,
}: {
  href: string
  label: string
  active: boolean
}) {
  return (
    <Link
      href={href}
      className={[
        "rounded-full px-3 py-1 transition-colors",
        active
          ? "bg-primary text-primary-foreground"
          : "text-muted-foreground hover:bg-muted hover:text-foreground",
      ].join(" ")}
    >
      {label}
    </Link>
  )
}
