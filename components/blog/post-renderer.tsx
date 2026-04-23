import dynamic from "next/dynamic"
import type { ComponentType } from "react"
import { isBlogPostPublished } from "@/data/blog-posts"

const registry: Record<string, ComponentType> = {
  "how-much-should-you-have-in-401k-by-age": dynamic(
    () =>
      import(
        "@/components/blog/posts/how-much-should-you-have-in-401k-by-age"
      ),
  ),
  "401k-vs-roth-ira-which-to-max-first": dynamic(
    () =>
      import(
        "@/components/blog/posts/401k-vs-roth-ira-which-to-max-first"
      ),
  ),
  "how-much-house-can-i-afford": dynamic(
    () => import("@/components/blog/posts/how-much-house-can-i-afford"),
  ),
  "is-refinancing-worth-it-in-2026": dynamic(
    () => import("@/components/blog/posts/is-refinancing-worth-it-in-2026"),
  ),
  "15-year-vs-30-year-mortgage-math": dynamic(
    () => import("@/components/blog/posts/15-year-vs-30-year-mortgage-math"),
  ),
}

interface PostRendererProps {
  slug: string
}

export function PostRenderer({ slug }: PostRendererProps) {
  const Component = registry[slug]
  if (!Component || !isBlogPostPublished(slug)) {
    return (
      <p className="text-sm text-muted-foreground">
        This post content has not been published yet.
      </p>
    )
  }
  return <Component />
}
