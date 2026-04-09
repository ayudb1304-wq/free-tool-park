import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getAllTools, getToolBySlug, getRelatedTools } from "@/lib/tools"
import { getCategoryBySlug } from "@/data/categories"
import { ToolRenderer } from "@/components/tool-renderer"
import { JsonLd } from "@/components/seo/json-ld"
import {
  toolSchema,
  faqSchema,
  breadcrumbSchema,
  SITE_URL,
} from "@/lib/schema"
import { Breadcrumb } from "@/components/layout/breadcrumb"
import { AdUnit } from "@/components/ads/ad-unit"
import Link from "next/link"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { HugeiconsIcon } from "@hugeicons/react"

export function generateStaticParams() {
  return getAllTools().map((tool) => ({ slug: tool.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const tool = getToolBySlug(slug)
  if (!tool) return {}

  return {
    title: tool.titleTag,
    description: tool.metaDescription,
    keywords: tool.keywords.join(", "),
    alternates: {
      canonical: `${SITE_URL}/tools/${slug}`,
      languages: {
        en: `${SITE_URL}/tools/${slug}`,
        "x-default": `${SITE_URL}/tools/${slug}`,
      },
    },
    openGraph: {
      title: `${tool.name} - Free Online Tool | FreeToolPark`,
      description: tool.metaDescription,
      url: `${SITE_URL}/tools/${slug}`,
      type: "website",
      siteName: "FreeToolPark",
      locale: "en_US",
      images: [
        {
          url: `${SITE_URL}/images/og-default.png`,
          width: 1200,
          height: 630,
          alt: tool.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: tool.name,
      description: tool.metaDescription,
      images: [`${SITE_URL}/images/og-default.png`],
    },
  }
}

export default async function ToolPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const tool = getToolBySlug(slug)
  if (!tool) notFound()

  const category = getCategoryBySlug(tool.category)
  const related = getRelatedTools(tool)

  return (
    <>
      <JsonLd data={toolSchema(tool)} />
      <JsonLd data={faqSchema(tool.faqs)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: SITE_URL },
          {
            name: category?.name ?? "Tools",
            url: `${SITE_URL}/categories/${tool.category}`,
          },
          { name: tool.name, url: `${SITE_URL}/tools/${tool.slug}` },
        ])}
      />

      <div className="mx-auto max-w-7xl px-4 py-8">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            {
              label: category?.name ?? "Tools",
              href: `/categories/${tool.category}`,
            },
            { label: tool.name },
          ]}
        />

        <h1 className="font-heading mb-4 text-3xl font-bold tracking-tight">
          {tool.h1}
        </h1>

        <p className="mb-8 max-w-3xl text-lg leading-relaxed text-muted-foreground">
          {tool.introduction}
        </p>

        {/* Tool UI */}
        <div className="mb-8 rounded-2xl border bg-card p-6">
          <ToolRenderer componentName={tool.componentName} />
        </div>

        <AdUnit slot="after-tool" format="horizontal" className="mb-8" />

        {/* How to Use */}
        <section className="mb-8">
          <h2 className="font-heading mb-4 text-2xl font-bold">
            How to Use the {tool.name}
          </h2>
          <ol className="space-y-4">
            {tool.steps.map((step, i) => (
              <li key={i}>
                <h3 className="text-lg font-semibold">
                  Step {i + 1}: {step.title}
                </h3>
                <p className="mt-1 text-muted-foreground">
                  {step.description}
                </p>
              </li>
            ))}
          </ol>
        </section>

        {/* Why Use */}
        <section className="mb-8 rounded-2xl bg-muted/50 p-6">
          <h2 className="font-heading mb-3 text-2xl font-bold">
            Why Use This {tool.name}?
          </h2>
          <ul className="list-inside list-disc space-y-2 text-muted-foreground">
            {tool.whyUse.map((reason, i) => (
              <li key={i}>{reason}</li>
            ))}
          </ul>
        </section>

        <AdUnit slot="before-faq" format="rectangle" className="mx-auto mb-8" />

        {/* FAQ */}
        <section className="mb-8">
          <h2 className="font-heading mb-6 text-2xl font-bold">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {tool.faqs.map((faq, i) => (
              <div key={i} className="border-b pb-6 last:border-0">
                <h3 className="mb-2 text-lg font-semibold">{faq.question}</h3>
                <p className="text-muted-foreground">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Related Tools */}
        {related.length > 0 && (
          <section>
            <h2 className="font-heading mb-4 text-2xl font-bold">
              Related Tools
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((rel) => (
                <Link key={rel.slug} href={`/tools/${rel.slug}`}>
                  <Card
                    size="sm"
                    className="h-full transition-shadow hover:shadow-lg"
                  >
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <HugeiconsIcon icon={rel.icon} size={16} />
                        </div>
                        <CardTitle className="text-sm">{rel.name}</CardTitle>
                      </div>
                    </CardHeader>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  )
}
