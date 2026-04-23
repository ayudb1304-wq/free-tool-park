import type { Metadata } from "next"
import Link from "next/link"
import { breadcrumbSchema, SITE_URL } from "@/lib/schema"
import { JsonLd } from "@/components/seo/json-ld"
import { Breadcrumb } from "@/components/layout/breadcrumb"
import { getAllAnswers, getAnswersByCategory } from "@/data/answers"

export const metadata: Metadata = {
  title: "Answers - Quick Answers to Common Conversion Questions",
  description:
    "Direct, source-cited answers to the questions people actually type into Google. How many MB in a GB, square feet in an acre, tablespoons in a cup, and more.",
  keywords: [
    "conversion answers",
    "how many X in Y",
    "quick conversion facts",
    "freetoolpark answers",
  ],
  alternates: {
    canonical: `${SITE_URL}/answers`,
  },
  openGraph: {
    title: "FreeToolPark Answers",
    description:
      "Direct, source-cited answers to common conversion questions, each paired with a free converter.",
    url: `${SITE_URL}/answers`,
    type: "website",
    siteName: "FreeToolPark",
    locale: "en_US",
  },
}

export default function AnswersIndexPage() {
  const allAnswers = getAllAnswers()
  const byCategory = getAnswersByCategory()

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: SITE_URL },
          { name: "Answers", url: `${SITE_URL}/answers` },
        ])}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "FreeToolPark Answers",
          url: `${SITE_URL}/answers`,
          description:
            "Direct answers to common unit conversion questions, each with a free converter.",
          hasPart: allAnswers.map((a) => ({
            "@type": "QAPage",
            name: a.question,
            url: `${SITE_URL}/answers/${a.slug}`,
          })),
        }}
      />

      <div className="mx-auto max-w-4xl px-4 py-8">
        <Breadcrumb
          items={[{ label: "Home", href: "/" }, { label: "Answers" }]}
        />

        <header className="mb-10">
          <h1 className="font-heading mb-3 text-4xl font-bold tracking-tight">
            Quick answers, done right
          </h1>
          <p className="max-w-2xl text-lg text-muted-foreground">
            Direct, source-cited answers to the conversion questions people
            actually type into Google. Every page includes the real math, a
            reference table, worked examples, and a free browser-based
            converter. No sign-ups.
          </p>
        </header>

        {byCategory.length === 0 ? (
          <p className="text-muted-foreground">
            First answers are being prepared.
          </p>
        ) : (
          <div className="space-y-12">
            {byCategory.map((group) => (
              <section
                key={group.categorySlug}
                id={group.categorySlug}
                className="scroll-mt-24"
              >
                <h2 className="font-heading mb-4 text-2xl font-semibold tracking-tight">
                  {group.categoryName}
                </h2>
                <ul className="grid gap-4 sm:grid-cols-2">
                  {group.answers.map((a) => (
                    <li key={a.slug}>
                      <Link
                        href={`/answers/${a.slug}`}
                        className="group block h-full rounded-2xl border bg-card p-5 transition-shadow hover:shadow-md"
                      >
                        <p className="font-heading text-base font-semibold group-hover:text-primary">
                          {a.question}
                        </p>
                        <p className="mt-2 text-sm text-muted-foreground">
                          {a.directAnswer}
                        </p>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
