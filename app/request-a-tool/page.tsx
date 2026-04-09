import type { Metadata } from "next"
import Link from "next/link"
import { SITE_URL } from "@/lib/schema"
import { Breadcrumb } from "@/components/layout/breadcrumb"
import { ToolRequestForm } from "@/components/community/tool-request-form"

export const metadata: Metadata = {
  title: "Request a Tool — Help Us Build What You Need",
  description:
    "Can't find the tool you need? Request it! We build the most-requested tools first. Vote on ideas from the community.",
  keywords: [
    "request online tool",
    "suggest calculator",
    "free tool request",
    "community tool voting",
  ],
  alternates: {
    canonical: `${SITE_URL}/request-a-tool`,
  },
}

const RECENTLY_BUILT = [
  {
    name: "CSS Gradient Generator",
    slug: "css-gradient-generator",
  },
  {
    name: "SHA-256 Generator",
    slug: "sha256-generator",
  },
  {
    name: "Timestamp Converter",
    slug: "timestamp-converter",
  },
]

export default function RequestToolPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Request a Tool" },
        ]}
      />

      {/* Hero */}
      <section className="mb-12 text-center">
        <h1 className="text-3xl font-bold md:text-4xl">Request a Tool</h1>
        <p className="mx-auto mt-4 max-w-xl text-xl text-muted-foreground">
          Can&apos;t find what you&apos;re looking for? Tell us what to build
          next. We prioritize the most-requested tools.
        </p>
      </section>

      {/* Request Form */}
      <section className="mb-16">
        <ToolRequestForm />
      </section>

      {/* Recently Built */}
      <section>
        <h2 className="mb-6 text-2xl font-semibold">
          Recently Built from Requests
        </h2>
        <p className="mb-4 text-muted-foreground">
          These tools were built because users like you requested them!
        </p>
        <div className="grid gap-4 sm:grid-cols-3">
          {RECENTLY_BUILT.map((tool) => (
            <Link
              key={tool.slug}
              href={`/tools/${tool.slug}`}
              className="rounded-lg border p-4 text-center transition hover:border-primary hover:shadow-sm"
            >
              <p className="font-medium">{tool.name}</p>
              <p className="mt-1 text-sm text-primary">Try it &rarr;</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
