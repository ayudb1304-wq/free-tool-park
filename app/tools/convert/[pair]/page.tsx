import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import {
  ALL_CONVERSION_PAIRS,
  getConversionPair,
  getCommonValues,
  getFormulaText,
  getPairTitle,
  getPairH1,
  getPairDescription,
  getPairKeywords,
  getReversePairSlug,
  getRelatedPairs,
} from "@/data/conversions"
import { UnitConverter } from "@/components/tools/unit-converter"
import { AiCitationBlock } from "@/components/seo/ai-citation-block"
import { PrivacyBadge } from "@/components/tools/privacy-badge"
import { Breadcrumb } from "@/components/layout/breadcrumb"
import { AdUnit } from "@/components/ads/ad-unit"
import { JsonLd } from "@/components/seo/json-ld"
import {
  breadcrumbSchema,
  faqSchema,
  SITE_URL,
  SITE_NAME,
} from "@/lib/schema"

export function generateStaticParams() {
  return ALL_CONVERSION_PAIRS.map((p) => ({ pair: p.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ pair: string }>
}): Promise<Metadata> {
  const { pair: pairSlug } = await params
  const pair = getConversionPair(pairSlug)
  if (!pair) return {}

  const title = `${getPairTitle(pair)} | FreeToolPark`
  const description = getPairDescription(pair)

  return {
    title,
    description,
    keywords: getPairKeywords(pair).join(", "),
    robots: { index: true, follow: true },
    alternates: {
      canonical: `${SITE_URL}/tools/convert/${pairSlug}`,
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/tools/convert/${pairSlug}`,
      type: "website",
      siteName: "FreeToolPark",
      locale: "en_US",
    },
  }
}

export default async function ConvertPage({
  params,
}: {
  params: Promise<{ pair: string }>
}) {
  const { pair: pairSlug } = await params
  const pair = getConversionPair(pairSlug)
  if (!pair) notFound()

  const commonValues = getCommonValues(pair)
  const formula = getFormulaText(pair)
  const reversePairSlug = getReversePairSlug(pair)
  const relatedPairs = getRelatedPairs(pair, 6)

  const faqs = [
    {
      question: `How many ${pair.to.name.toLowerCase()} are in one ${pair.from.name.toLowerCase().replace(/s$/, "")}?`,
      answer: (() => {
        const cv = commonValues.find((v) => v.from.startsWith("1 "))
        return cv
          ? `One ${pair.from.name.toLowerCase().replace(/s$/, "")} equals ${cv.to}. Use the converter above for any value.`
          : `Use the converter above to find the exact value for any ${pair.from.name.toLowerCase()} amount.`
      })(),
    },
    {
      question: `What is the formula to convert ${pair.from.abbr} to ${pair.to.abbr}?`,
      answer: `The formula is: ${formula.expression}. ${formula.explanation}`,
    },
    {
      question: `How do I convert ${pair.to.name.toLowerCase()} back to ${pair.from.name.toLowerCase()}?`,
      answer: `Use our reverse converter: ${pair.to.name} to ${pair.from.name}. You can also click the "Swap" button above the converter.`,
    },
    {
      question: "Is this converter accurate?",
      answer: `Yes. This converter uses the standard conversion factor and handles up to 8 decimal places of precision. All calculations run instantly in your browser with no rounding shortcuts.`,
    },
    {
      question: "Do I need to sign up to use this converter?",
      answer: "No. This converter is completely free with no signup, no account, and no usage limits. Your data never leaves your browser.",
    },
  ]

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: getPairTitle(pair),
          url: `${SITE_URL}/tools/convert/${pairSlug}`,
          description: getPairDescription(pair),
          applicationCategory: "UtilityApplication",
          operatingSystem: "All",
          isAccessibleForFree: true,
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          author: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
        }}
      />
      <JsonLd data={faqSchema(faqs)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: SITE_URL },
          { name: "Converters", url: `${SITE_URL}/categories/converters` },
          {
            name: pair.category.name,
            url: `${SITE_URL}/categories/converters`,
          },
          {
            name: getPairTitle(pair),
            url: `${SITE_URL}/tools/convert/${pairSlug}`,
          },
        ])}
      />

      <div className="mx-auto max-w-7xl px-4 py-8">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Converters", href: "/categories/converters" },
            { label: getPairTitle(pair) },
          ]}
        />

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          <div className="lg:col-span-3">
            <h1 className="font-heading mb-4 text-3xl font-bold tracking-tight">
              {getPairH1(pair)}
            </h1>

            <p className="mb-8 max-w-3xl text-lg leading-relaxed text-muted-foreground">
              Instantly convert {pair.from.name.toLowerCase()} to{" "}
              {pair.to.name.toLowerCase()} with this free online converter.
              Type a value below and the result updates in real time. All
              calculations run in your browser, nothing is sent to a server.
            </p>

            {/* Converter Tool */}
            <div className="mb-8 rounded-2xl border bg-card p-6">
              <UnitConverter
                from={pair.from}
                to={pair.to}
                categorySlug={pair.category.slug}
                isTemperature={pair.category.isTemperature}
              />
            </div>

            <AdUnit slot="after-tool" format="horizontal" className="mb-8" />

            {/* Formula */}
            <section className="mb-8">
              <h2 className="font-heading mb-4 text-2xl font-bold">
                {pair.from.name} to {pair.to.name} Formula
              </h2>
              <div className="mb-4 rounded-xl border bg-muted/30 p-5">
                <p className="text-center font-mono text-lg font-semibold tracking-wide">
                  {formula.expression}
                </p>
              </div>
              <p className="text-muted-foreground">{formula.explanation}</p>
            </section>

            {/* Common Values Table */}
            <section className="mb-8">
              <h2 className="font-heading mb-4 text-2xl font-bold">
                Common {pair.from.name} to {pair.to.name} Conversions
              </h2>
              <div className="overflow-x-auto rounded-xl border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="px-4 py-3 text-left font-semibold">
                        {pair.from.name} ({pair.from.abbr})
                      </th>
                      <th className="px-4 py-3 text-left font-semibold">
                        {pair.to.name} ({pair.to.abbr})
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {commonValues.map((row, i) => (
                      <tr
                        key={i}
                        className="border-b last:border-0 even:bg-muted/20"
                      >
                        <td className="px-4 py-2.5 text-muted-foreground">
                          {row.from}
                        </td>
                        <td className="px-4 py-2.5 font-medium">
                          {row.to}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* How to Convert */}
            <section className="mb-8">
              <h2 className="font-heading mb-4 text-2xl font-bold">
                How to Convert {pair.from.name} to {pair.to.name}
              </h2>
              <ol className="list-inside list-decimal space-y-2 text-muted-foreground">
                <li>
                  Enter the {pair.from.name.toLowerCase()} value in the input
                  field above.
                </li>
                <li>
                  The {pair.to.name.toLowerCase()} result appears instantly as
                  you type.
                </li>
                <li>Click the copy button to copy the result to your clipboard.</li>
                <li>
                  To convert in the other direction, click the{" "}
                  <strong>Swap</strong> button or visit the{" "}
                  <Link
                    href={`/tools/convert/${reversePairSlug}`}
                    className="text-primary hover:underline"
                  >
                    {pair.to.name} to {pair.from.name}
                  </Link>{" "}
                  converter.
                </li>
              </ol>
            </section>

            {/* Privacy Badge */}
            <section className="mb-8">
              <PrivacyBadge
                toolName={`${pair.from.name} to ${pair.to.name} Converter`}
                variant="default"
              />
            </section>

            <AdUnit
              slot="before-faq"
              format="rectangle"
              className="mx-auto mb-8"
            />

            {/* FAQ */}
            <section className="mb-8">
              <h2 className="font-heading mb-6 text-2xl font-bold">
                Frequently Asked Questions
              </h2>
              <div className="space-y-6">
                {faqs.map((faq, i) => (
                  <div key={i} className="border-b pb-6 last:border-0">
                    <h3 className="mb-2 text-lg font-semibold">
                      {faq.question}
                    </h3>
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* AI Citation Block */}
            <AiCitationBlock
              toolName={getPairTitle(pair)}
              toolSlug={`convert/${pairSlug}`}
              category="converters"
              keywords={getPairKeywords(pair)}
              metaDescription={getPairDescription(pair)}
            />

            {/* Related Conversions */}
            {relatedPairs.length > 0 && (
              <section>
                <h2 className="font-heading mb-4 text-2xl font-bold">
                  Related {pair.category.name} Conversions
                </h2>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {relatedPairs.map((rel) => (
                    <Link
                      key={rel.slug}
                      href={`/tools/convert/${rel.slug}`}
                      className="rounded-xl border bg-card p-4 transition-shadow hover:shadow-md"
                    >
                      <p className="font-semibold text-sm">
                        {rel.from.abbr} to {rel.to.abbr}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {rel.from.name} to {rel.to.name}
                      </p>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <aside className="hidden lg:col-span-1 lg:block">
            <div className="sticky top-20 space-y-6">
              <AdUnit slot="sidebar-top" format="rectangle" />

              {/* Category quick links */}
              <div className="rounded-xl border p-4">
                <h3 className="mb-3 text-sm font-semibold">
                  More {pair.category.name} Converters
                </h3>
                <ul className="space-y-1.5 text-sm">
                  {pair.category.units
                    .filter((u) => u.key !== pair.from.key)
                    .slice(0, 8)
                    .map((u) => (
                      <li key={u.key}>
                        <Link
                          href={`/tools/convert/${pair.from.key}-to-${u.key}`}
                          className="text-muted-foreground hover:text-primary hover:underline"
                        >
                          {pair.from.abbr} to {u.abbr}
                        </Link>
                      </li>
                    ))}
                </ul>
              </div>

              <AdUnit slot="sidebar-bottom" format="vertical" />
            </div>
          </aside>
        </div>
      </div>
    </>
  )
}
