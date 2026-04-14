import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { CATEGORIES, getCategoryBySlug } from "@/data/categories"
import { getToolsByCategory } from "@/lib/tools"
import { CONVERSION_CATEGORIES } from "@/data/conversions"
import { JsonLd } from "@/components/seo/json-ld"
import { categorySchema, faqSchema, breadcrumbSchema, SITE_URL } from "@/lib/schema"
import { Breadcrumb } from "@/components/layout/breadcrumb"
import { ToolsGrid } from "@/components/tools-grid"

export function generateStaticParams() {
  return CATEGORIES.map((cat) => ({ category: cat.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>
}): Promise<Metadata> {
  const { category: slug } = await params
  const category = getCategoryBySlug(slug)
  if (!category) return {}

  return {
    title: `Free ${category.name} Online`,
    description: category.description,
    alternates: {
      canonical: `${SITE_URL}/categories/${slug}`,
      languages: {
        en: `${SITE_URL}/categories/${slug}`,
        "x-default": `${SITE_URL}/categories/${slug}`,
      },
    },
    openGraph: {
      title: `Free ${category.name} Online | FreeToolPark`,
      description: category.description,
      url: `${SITE_URL}/categories/${slug}`,
      type: "website",
      siteName: "FreeToolPark",
      locale: "en_US",
      images: [
        {
          url: `${SITE_URL}/images/og-default.png`,
          width: 1200,
          height: 630,
          alt: `${category.name} - FreeToolPark`,
        },
      ],
    },
  }
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>
}) {
  const { category: slug } = await params
  const category = getCategoryBySlug(slug)
  if (!category) notFound()

  const tools = getToolsByCategory(slug)

  return (
    <>
      <JsonLd data={categorySchema(category, tools)} />
      <JsonLd data={faqSchema(category.faqs)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: SITE_URL },
          { name: "Categories", url: `${SITE_URL}/tools` },
          {
            name: category.name,
            url: `${SITE_URL}/categories/${category.slug}`,
          },
        ])}
      />

      <div className="mx-auto max-w-7xl px-4 py-8">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Categories", href: "/tools" },
            { label: category.name },
          ]}
        />

        <h1 className="font-heading mb-2 text-3xl font-bold">
          Free {category.name} Online
        </h1>
        <p className="mb-1 text-sm text-muted-foreground">
          Last updated: April 2026
        </p>
        <p className="mb-4 text-lg text-muted-foreground">
          {category.description}
        </p>
        <p className="mb-8 text-muted-foreground">{category.longDescription}</p>

        <ToolsGrid tools={tools} showSearch showCategoryFilter={false} />

        {/* Unit Converter Quick Links (only on converters category) */}
        {slug === "converters" && (
          <section className="mt-12">
            <h2 className="font-heading mb-6 text-2xl font-bold">
              Unit Converters
            </h2>
            <p className="mb-6 text-muted-foreground">
              Instantly convert between hundreds of units across {CONVERSION_CATEGORIES.length} categories. Every converter runs in your browser with no signup required.
            </p>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {CONVERSION_CATEGORIES.map((cat) => (
                <div key={cat.slug} className="rounded-xl border bg-card p-4">
                  <h3 className="mb-3 font-semibold">{cat.name}</h3>
                  <ul className="space-y-1.5 text-sm">
                    {cat.units.slice(0, 4).flatMap((from) =>
                      cat.units
                        .filter((to) => to.key !== from.key)
                        .slice(0, 1)
                        .map((to) => (
                          <li key={`${from.key}-${to.key}`}>
                            <Link
                              href={`/tools/convert/${from.key}-to-${to.key}`}
                              className="text-muted-foreground hover:text-primary hover:underline"
                            >
                              {from.abbr} to {to.abbr}
                            </Link>
                          </li>
                        ))
                    )}
                    <li>
                      <span className="text-xs text-muted-foreground">
                        +{cat.units.length * (cat.units.length - 1) - 4} more
                      </span>
                    </li>
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Category FAQ */}
        <section className="mt-12">
          <h2 className="font-heading mb-6 text-2xl font-bold">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {category.faqs.map((faq, i) => (
              <div key={i} className="border-b pb-6 last:border-0">
                <h3 className="mb-2 text-lg font-semibold">{faq.question}</h3>
                <p className="text-muted-foreground">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  )
}
