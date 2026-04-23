import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import {
  blogPostingSchema,
  breadcrumbSchema,
  faqSchema,
  SITE_URL,
} from "@/lib/schema"
import { JsonLd } from "@/components/seo/json-ld"
import { Breadcrumb } from "@/components/layout/breadcrumb"
import { AuthorByline } from "@/components/seo/author-byline"
import {
  getAllBlogPosts,
  getBlogPostBySlug,
  getRelatedBlogPosts,
  isBlogPostPublished,
} from "@/data/blog-posts"
import { PostRenderer } from "@/components/blog/post-renderer"
import { CalculatorCta } from "@/components/blog/calculator-cta"
import { TableOfContents } from "@/components/blog/table-of-contents"

export function generateStaticParams() {
  return getAllBlogPosts()
    .filter((p) => isBlogPostPublished(p.slug))
    .map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = getBlogPostBySlug(slug)
  if (!post || !isBlogPostPublished(slug)) return {}

  return {
    title: post.title,
    description: post.metaDescription,
    keywords: post.keywords.join(", "),
    authors: [{ name: post.author }],
    alternates: {
      canonical: `${SITE_URL}/blog/${slug}`,
      languages: {
        en: `${SITE_URL}/blog/${slug}`,
        "x-default": `${SITE_URL}/blog/${slug}`,
      },
    },
    openGraph: {
      title: post.title,
      description: post.metaDescription,
      url: `${SITE_URL}/blog/${slug}`,
      type: "article",
      siteName: "FreeToolPark",
      locale: "en_US",
      publishedTime: post.publishedDate,
      modifiedTime: post.lastUpdated,
      authors: [post.author],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.metaDescription,
    },
  }
}

function formatDate(iso: string): string {
  const d = new Date(iso + "T00:00:00")
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = getBlogPostBySlug(slug)
  if (!post || !isBlogPostPublished(slug)) notFound()

  const related = getRelatedBlogPosts(post)
  const lastUpdatedDisplay = formatDate(post.lastUpdated)

  return (
    <>
      <JsonLd data={blogPostingSchema(post)} />
      <JsonLd data={faqSchema(post.faqs)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: SITE_URL },
          { name: "Blog", url: `${SITE_URL}/blog` },
          { name: post.title, url: `${SITE_URL}/blog/${slug}` },
        ])}
      />

      <div className="mx-auto max-w-6xl px-4 py-8">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Blog", href: "/blog" },
            { label: post.title },
          ]}
        />

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_16rem]">
          <article className="prose prose-neutral dark:prose-invert max-w-none lg:max-w-[42rem]">
            <header className="not-prose mb-8">
              <h1 className="font-heading mb-3 text-3xl font-bold tracking-tight sm:text-4xl">
                {post.h1}
              </h1>
              <AuthorByline
                lastUpdatedIso={post.lastUpdated}
                lastUpdatedDisplay={lastUpdatedDisplay}
                authorName={post.author}
                className="mb-1"
              />
              <p className="mt-1 text-sm text-muted-foreground">
                {post.readingTimeMinutes} min read
              </p>
            </header>

            {/* Mobile ToC: inline collapsible, before content on small screens */}
            {post.tableOfContents.length > 0 && (
              <details className="not-prose mb-8 rounded-lg border bg-card p-4 lg:hidden">
                <summary className="cursor-pointer text-sm font-semibold">
                  On this page
                </summary>
                <ul className="mt-3 space-y-2 text-sm">
                  {post.tableOfContents.map((item) => (
                    <li key={item.id}>
                      <a
                        href={`#${item.id}`}
                        className="text-muted-foreground hover:text-foreground hover:underline"
                      >
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </details>
            )}

            <PostRenderer slug={post.slug} />

            {post.primaryToolSlug && (
              <CalculatorCta
                toolSlug={post.primaryToolSlug}
                headline="Ready to run your own numbers?"
              />
            )}

            <section className="not-prose mt-12 border-t pt-10">
              <h2 className="font-heading mb-5 text-2xl font-bold">
                Frequently asked questions
              </h2>
              <div className="space-y-4">
                {post.faqs.map((faq, i) => (
                  <details
                    key={i}
                    className="group rounded-lg border bg-card p-4"
                  >
                    <summary className="cursor-pointer text-base font-semibold">
                      {faq.question}
                    </summary>
                    <p className="mt-3 text-sm text-muted-foreground">
                      {faq.answer}
                    </p>
                  </details>
                ))}
              </div>
            </section>

            {related.length > 0 && (
              <section className="not-prose mt-12 border-t pt-10">
                <h2 className="font-heading mb-5 text-2xl font-bold">
                  More from the blog
                </h2>
                <ul className="space-y-3">
                  {related.map((r) => (
                    <li key={r.slug}>
                      <Link
                        href={`/blog/${r.slug}`}
                        className="group block rounded-lg border bg-card p-4 transition-shadow hover:shadow-sm"
                      >
                        <p className="font-semibold group-hover:text-primary">
                          {r.title}
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {r.excerpt}
                        </p>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <p className="not-prose mt-12 text-center text-sm">
              <Link
                href="/blog"
                className="font-medium text-primary hover:underline"
              >
                &larr; Back to all posts
              </Link>
            </p>
          </article>

          <aside className="hidden lg:block">
            <TableOfContents items={post.tableOfContents} />
          </aside>
        </div>
      </div>
    </>
  )
}
