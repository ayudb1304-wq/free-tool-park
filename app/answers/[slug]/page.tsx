import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import {
  answerPageSchema,
  breadcrumbSchema,
  faqSchema,
  SITE_URL,
} from "@/lib/schema"
import { JsonLd } from "@/components/seo/json-ld"
import { Breadcrumb } from "@/components/layout/breadcrumb"
import { AuthorByline } from "@/components/seo/author-byline"
import {
  getAllAnswers,
  getAnswerBySlug,
  getAnswerConversionPair,
  getRelatedAnswers,
} from "@/data/answers"
import { buildAnswerTable, formatAnswerNumber } from "@/lib/answers"

export function generateStaticParams() {
  return getAllAnswers().map((a) => ({ slug: a.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const answer = getAnswerBySlug(slug)
  if (!answer) return {}

  return {
    title: `${answer.question} (Quick Answer + Free Converter)`,
    description: answer.metaDescription,
    keywords: answer.keywords.join(", "),
    alternates: {
      canonical: `${SITE_URL}/answers/${slug}`,
      languages: {
        en: `${SITE_URL}/answers/${slug}`,
        "x-default": `${SITE_URL}/answers/${slug}`,
      },
    },
    openGraph: {
      title: answer.question,
      description: answer.metaDescription,
      url: `${SITE_URL}/answers/${slug}`,
      type: "article",
      siteName: "FreeToolPark",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: answer.question,
      description: answer.metaDescription,
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

export default async function AnswerPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const answer = getAnswerBySlug(slug)
  if (!answer) notFound()

  const pair = getAnswerConversionPair(answer)
  if (!pair) notFound()

  const tableRows = buildAnswerTable(answer)
  const related = getRelatedAnswers(answer)
  const lastUpdatedDisplay = formatDate(answer.lastUpdated)

  return (
    <>
      <JsonLd
        data={answerPageSchema({
          question: answer.question,
          url: `${SITE_URL}/answers/${slug}`,
          answerText: answer.directAnswer,
          datePublished: answer.publishedDate,
          dateModified: answer.lastUpdated,
          keywords: answer.keywords,
        })}
      />
      <JsonLd data={faqSchema(answer.faqs)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: SITE_URL },
          { name: "Answers", url: `${SITE_URL}/answers` },
          { name: answer.question, url: `${SITE_URL}/answers/${slug}` },
        ])}
      />

      <div className="mx-auto max-w-3xl px-4 py-8">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Answers", href: "/answers" },
            { label: answer.question },
          ]}
        />

        <article className="prose prose-neutral dark:prose-invert max-w-none">
          <header className="not-prose mb-6">
            <h1 className="font-heading mb-3 text-3xl font-bold tracking-tight sm:text-4xl">
              {answer.question}
            </h1>
            <AuthorByline
              lastUpdatedIso={answer.lastUpdated}
              lastUpdatedDisplay={lastUpdatedDisplay}
              className="mb-1"
            />
          </header>

          {/* Direct answer callout */}
          <aside className="not-prose my-6 rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-5">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
              Quick answer
            </p>
            <p className="text-lg font-semibold text-foreground">
              {answer.directAnswer}
            </p>
            {answer.directAnswerNote && (
              <p className="mt-2 text-sm text-muted-foreground">
                {answer.directAnswerNote}
              </p>
            )}
          </aside>

          {/* Context */}
          {answer.context.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}

          {/* Reference table */}
          <h2 id="quick-reference" className="scroll-mt-24">
            Quick reference: {pair.from.name} to {pair.to.name}
          </h2>
          <div className="not-prose my-4 overflow-x-auto rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-left">
                <tr>
                  <th className="px-4 py-2 font-medium">
                    {pair.from.name} ({pair.from.abbr})
                  </th>
                  <th className="px-4 py-2 font-medium">
                    {pair.to.name} ({pair.to.abbr})
                  </th>
                </tr>
              </thead>
              <tbody>
                {tableRows.map((row, i) => (
                  <tr key={i} className="border-t">
                    <td className="px-4 py-2 text-muted-foreground">
                      {formatAnswerNumber(row.fromValue)}
                    </td>
                    <td className="px-4 py-2 font-medium text-foreground">
                      {formatAnswerNumber(row.toValue)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Inline converter CTA */}
          <aside className="not-prose my-8 rounded-2xl border bg-card p-6 shadow-sm">
            <p className="mb-1 text-sm font-medium text-muted-foreground">
              Need a different number?
            </p>
            <p className="mb-4 font-heading text-lg font-semibold">
              {pair.from.name} to {pair.to.name} converter
            </p>
            <p className="mb-4 text-sm text-muted-foreground">
              Enter any value and get an instant conversion. Runs in your
              browser, nothing is sent to a server.
            </p>
            <Link
              href={`/tools/convert/${pair.slug}`}
              className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Open the converter &rarr;
            </Link>
          </aside>

          {/* Examples */}
          <h2 id="examples" className="scroll-mt-24">
            Worked examples
          </h2>
          <ol className="space-y-4">
            {answer.examples.map((ex, i) => (
              <li key={i}>
                <p className="font-medium text-foreground">
                  Example {i + 1}: {ex.scenario}
                </p>
                <p className="mt-1 text-sm">
                  <span className="text-muted-foreground">Calculation: </span>
                  <code className="text-foreground">{ex.calculation}</code>
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {ex.takeaway}
                </p>
              </li>
            ))}
          </ol>

          {/* FAQ */}
          <section className="not-prose mt-10 border-t pt-8">
            <h2 className="font-heading mb-5 text-2xl font-bold">
              Frequently asked questions
            </h2>
            <div className="space-y-4">
              {answer.faqs.map((faq, i) => (
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

          {/* Related answers */}
          {related.length > 0 && (
            <section className="not-prose mt-10 border-t pt-8">
              <h2 className="font-heading mb-5 text-2xl font-bold">
                Related answers
              </h2>
              <ul className="grid gap-3 sm:grid-cols-2">
                {related.map((r) => (
                  <li key={r.slug}>
                    <Link
                      href={`/answers/${r.slug}`}
                      className="group block rounded-lg border bg-card p-4 transition-shadow hover:shadow-sm"
                    >
                      <p className="font-semibold group-hover:text-primary">
                        {r.question}
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {r.directAnswer}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <p className="not-prose mt-10 text-center text-sm">
            <Link
              href="/answers"
              className="font-medium text-primary hover:underline"
            >
              &larr; Back to all answers
            </Link>
          </p>
        </article>
      </div>
    </>
  )
}
