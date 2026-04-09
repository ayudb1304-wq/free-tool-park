import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import { getToolsByCategory } from "@/lib/tools"
import { PERSONAS, getAllPersonaSlugs } from "@/data/personas"
import { PrivacyBadge } from "@/components/tools/privacy-badge"
import { SITE_URL } from "@/lib/schema"
import { Breadcrumb } from "@/components/layout/breadcrumb"
import type { Tool } from "@/data/tools"

type Props = {
  params: Promise<{ persona: string }>
}

export function generateStaticParams() {
  return getAllPersonaSlugs().map((persona) => ({ persona }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { persona } = await params
  const config = PERSONAS[persona]
  if (!config) return {}

  return {
    title: config.metaTitle,
    description: config.metaDescription,
    keywords: config.keywords,
    alternates: {
      canonical: `${SITE_URL}/for/${persona}`,
    },
    openGraph: {
      title: config.metaTitle,
      description: config.metaDescription,
      url: `${SITE_URL}/for/${persona}`,
    },
  }
}

export default async function PersonaPage({ params }: Props) {
  const { persona } = await params
  const config = PERSONAS[persona]

  if (!config) {
    notFound()
  }

  const tools: Tool[] = []
  const seen = new Set<string>()
  config.categories.forEach((cat) => {
    getToolsByCategory(cat).forEach((tool) => {
      if (!seen.has(tool.slug)) {
        seen.add(tool.slug)
        tools.push(tool)
      }
    })
  })

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: config.title },
        ]}
      />

      {/* Hero Section */}
      <section className="mb-16 text-center">
        <h1 className="text-3xl font-bold tracking-tight md:text-5xl">
          {config.headline}
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-xl text-muted-foreground">
          {config.subheadline}
        </p>
        <div className="mt-6 flex justify-center">
          <PrivacyBadge variant="compact" />
        </div>
      </section>

      {/* Tool Grid */}
      <section>
        <h2 className="mb-6 text-2xl font-semibold">
          All {config.title} ({tools.length})
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <Link
              key={tool.slug}
              href={`/tools/${tool.slug}`}
              className="group rounded-lg border p-6 transition hover:border-primary hover:shadow-md"
            >
              <div className="mb-3 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <HugeiconsIcon icon={tool.icon} size={20} />
              </div>
              <h3 className="text-lg font-semibold group-hover:text-primary">
                {tool.name}
              </h3>
              <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                {tool.metaDescription}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Why Use Our Tools Section */}
      <section className="mt-16 rounded-2xl bg-muted/30 p-8">
        <h2 className="mb-6 text-2xl font-semibold">
          Why {config.title.split(" ")[0]}s Choose Us
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          <div>
            <h3 className="font-semibold">100% Private</h3>
            <p className="mt-2 text-muted-foreground">
              All tools run in your browser. Your code, data, and content never
              touch our servers.
            </p>
          </div>
          <div>
            <h3 className="font-semibold">Lightning Fast</h3>
            <p className="mt-2 text-muted-foreground">
              No waiting for server responses. Calculations happen instantly in
              your browser.
            </p>
          </div>
          <div>
            <h3 className="font-semibold">Works Offline</h3>
            <p className="mt-2 text-muted-foreground">
              Once loaded, most tools work without internet. Perfect for working
              on the go.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="mt-16">
        <h2 className="mb-6 text-2xl font-semibold">
          Frequently Asked Questions
        </h2>
        <div className="max-w-2xl space-y-6">
          <div>
            <h3 className="font-medium">
              Are these {config.title.toLowerCase()} really free?
            </h3>
            <p className="mt-2 text-muted-foreground">
              Yes, completely free with no hidden limits. We&apos;re
              ad-supported, which keeps everything free for you.
            </p>
          </div>
          <div>
            <h3 className="font-medium">Do I need to create an account?</h3>
            <p className="mt-2 text-muted-foreground">
              No signup required for any tool. Just open and use immediately.
            </p>
          </div>
          <div>
            <h3 className="font-medium">Can I use these tools on mobile?</h3>
            <p className="mt-2 text-muted-foreground">
              Yes, all tools are fully responsive and work on phones, tablets,
              and desktops.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
