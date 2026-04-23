import type { Metadata } from "next"
import Link from "next/link"
import {
  blogIndexSchema,
  breadcrumbSchema,
  SITE_URL,
} from "@/lib/schema"
import { JsonLd } from "@/components/seo/json-ld"
import { Breadcrumb } from "@/components/layout/breadcrumb"
import { getAllBlogPosts, isBlogPostPublished } from "@/data/blog-posts"

export const metadata: Metadata = {
  title: "FreeToolPark Blog - Guides, Benchmarks, and Worked Examples",
  description:
    "In-depth guides on retirement planning, 401(k) benchmarks, mortgage math, unit conversions, and developer reference content. Every post pairs with a free tool.",
  keywords: [
    "freetoolpark blog",
    "retirement planning guide",
    "401k benchmarks",
    "mortgage math",
    "developer reference",
  ],
  alternates: {
    canonical: `${SITE_URL}/blog`,
  },
  openGraph: {
    title: "FreeToolPark Blog",
    description:
      "In-depth guides on retirement planning, mortgage math, unit conversions, and developer reference content.",
    url: `${SITE_URL}/blog`,
    type: "website",
    siteName: "FreeToolPark",
    locale: "en_US",
  },
}

const CATEGORY_LABELS: Record<string, string> = {
  finance: "Finance",
  developer: "Developer",
  conversions: "Conversions",
  health: "Health",
  general: "General",
}

function formatDate(iso: string): string {
  const d = new Date(iso + "T00:00:00")
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export default function BlogIndexPage() {
  const posts = getAllBlogPosts().filter((p) => isBlogPostPublished(p.slug))

  return (
    <>
      <JsonLd data={blogIndexSchema(posts)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: SITE_URL },
          { name: "Blog", url: `${SITE_URL}/blog` },
        ])}
      />
      <div className="mx-auto max-w-4xl px-4 py-8">
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Blog" }]} />

        <header className="mb-10">
          <h1 className="font-heading mb-3 text-4xl font-bold tracking-tight">
            FreeToolPark Blog
          </h1>
          <p className="max-w-2xl text-lg text-muted-foreground">
            Plain-English guides, benchmarks, and worked examples for the
            calculators and converters on this site. Every post pairs with a
            free, privacy-first tool you can use in your browser.
          </p>
        </header>

        {posts.length === 0 ? (
          <p className="text-muted-foreground">
            First posts are on the way. Check back soon.
          </p>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <article
                key={post.slug}
                className="group rounded-2xl border bg-card p-6 transition-shadow hover:shadow-md"
              >
                <Link
                  href={`/blog/${post.slug}`}
                  className="block"
                  aria-label={post.title}
                >
                  <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 font-medium text-primary">
                      {CATEGORY_LABELS[post.category] ?? post.category}
                    </span>
                    <span>
                      <time dateTime={post.publishedDate}>
                        {formatDate(post.publishedDate)}
                      </time>
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{post.readingTimeMinutes} min read</span>
                  </div>
                  <h2 className="font-heading text-xl font-semibold group-hover:text-primary">
                    {post.title}
                  </h2>
                  <p className="mt-2 text-muted-foreground">{post.excerpt}</p>
                  <p className="mt-4 text-sm font-medium text-primary">
                    Read the post &rarr;
                  </p>
                </Link>
              </article>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
