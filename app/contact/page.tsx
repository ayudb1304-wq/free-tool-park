import type { Metadata } from "next"
import Link from "next/link"
import { breadcrumbSchema, SITE_URL, SITE_NAME } from "@/lib/schema"
import { JsonLd } from "@/components/seo/json-ld"
import { Breadcrumb } from "@/components/layout/breadcrumb"

const CONTACT_EMAIL = "sushi@freetoolpark.com"

export const metadata: Metadata = {
  title: "Contact FreeToolPark - Get in Touch, Request a Tool, Report a Bug",
  description:
    "Contact FreeToolPark directly at sushi@freetoolpark.com. Send feedback, request a new tool, report a calculator bug, or reach out about partnerships and press.",
  keywords: [
    "contact FreeToolPark",
    "FreeToolPark email",
    "request a tool",
    "feedback online tools",
    "report bug calculator",
  ],
  alternates: {
    canonical: `${SITE_URL}/contact`,
  },
  openGraph: {
    title: "Contact FreeToolPark",
    description:
      "Send feedback, request a new tool, or report a bug. Reach us directly at sushi@freetoolpark.com.",
    url: `${SITE_URL}/contact`,
    type: "website",
    siteName: "FreeToolPark",
    locale: "en_US",
  },
}

const contactPageSchema = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: `Contact ${SITE_NAME}`,
  url: `${SITE_URL}/contact`,
  mainEntity: {
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    email: CONTACT_EMAIL,
    contactPoint: [
      {
        "@type": "ContactPoint",
        email: CONTACT_EMAIL,
        contactType: "customer support",
        availableLanguage: ["English"],
      },
    ],
  },
}

export default function ContactPage() {
  return (
    <>
      <JsonLd data={contactPageSchema} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: SITE_URL },
          { name: "Contact", url: `${SITE_URL}/contact` },
        ])}
      />
      <div className="mx-auto max-w-3xl px-4 py-8">
        <Breadcrumb
          items={[{ label: "Home", href: "/" }, { label: "Contact" }]}
        />

        <article className="prose prose-neutral dark:prose-invert max-w-none">
          <h1 className="font-heading mb-6 text-3xl font-bold">
            Contact FreeToolPark
          </h1>

          <p className="text-lg leading-relaxed">
            Have a question, a bug report, a tool request, or a partnership
            idea? We read every message.
          </p>

          <div className="not-prose my-8 rounded-lg border bg-card p-6">
            <h2 className="mb-3 text-xl font-bold">Email us directly</h2>
            <p className="mb-4 text-muted-foreground">
              The fastest way to reach the team:
            </p>
            <p>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="text-lg font-semibold text-primary hover:underline"
              >
                {CONTACT_EMAIL}
              </a>
            </p>
            <p className="mt-3 text-sm text-muted-foreground">
              We aim to respond within 2 business days.
            </p>
          </div>

          <div className="space-y-6 text-muted-foreground">
            <section>
              <h2 className="font-heading mb-3 text-xl font-semibold text-foreground">
                What to contact us about
              </h2>
              <ul className="mt-2 list-inside list-disc space-y-2">
                <li>
                  <strong className="text-foreground">Bug reports.</strong>{" "}
                  Spotted a calculator giving wrong results, a layout issue, or
                  something that is broken on mobile? Tell us the tool, the
                  inputs you used, and what you expected.
                </li>
                <li>
                  <strong className="text-foreground">Tool requests.</strong>{" "}
                  Want a calculator or converter we do not have yet? Use the{" "}
                  <Link
                    href="/request-a-tool"
                    className="font-medium text-primary hover:underline"
                  >
                    Request a Tool
                  </Link>{" "}
                  form or email us directly.
                </li>
                <li>
                  <strong className="text-foreground">Methodology questions.</strong>{" "}
                  Wondering how a financial calculation works? Check our{" "}
                  <Link
                    href="/methodology"
                    className="font-medium text-primary hover:underline"
                  >
                    Methodology page
                  </Link>{" "}
                  first, then email if something is unclear.
                </li>
                <li>
                  <strong className="text-foreground">Partnerships and press.</strong>{" "}
                  Writing about free online tools, want to embed a calculator,
                  or interested in a content partnership? Email us with the
                  subject line &quot;Partnership&quot;.
                </li>
                <li>
                  <strong className="text-foreground">Privacy and data.</strong>{" "}
                  Most privacy questions are answered in our{" "}
                  <Link
                    href="/privacy"
                    className="font-medium text-primary hover:underline"
                  >
                    Privacy Policy
                  </Link>
                  . For GDPR requests or anything specific, email us.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="font-heading mb-3 text-xl font-semibold text-foreground">
                What not to send
              </h2>
              <p>
                Please do not email us your actual financial information,
                passwords, API keys, or other sensitive data. Our tools run
                entirely in your browser so you never need to share that data
                with anyone, including us. If you are debugging a calculator
                issue, share the kind of input (for example, &quot;loan amount
                around $300k, 30-year term&quot;) rather than real account
                details.
              </p>
            </section>

            <section>
              <h2 className="font-heading mb-3 text-xl font-semibold text-foreground">
                Response times
              </h2>
              <p>
                FreeToolPark is run by a small team. We reply to most messages
                within 2 business days. Bug reports that affect calculation
                accuracy get priority.
              </p>
            </section>

            <section>
              <h2 className="font-heading mb-3 text-xl font-semibold text-foreground">
                Other links
              </h2>
              <ul className="mt-2 list-inside list-disc space-y-1">
                <li>
                  <Link
                    href="/about"
                    className="font-medium text-primary hover:underline"
                  >
                    About FreeToolPark
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy"
                    className="font-medium text-primary hover:underline"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="font-medium text-primary hover:underline"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    href="/methodology"
                    className="font-medium text-primary hover:underline"
                  >
                    Methodology (how our calculators work)
                  </Link>
                </li>
                <li>
                  <Link
                    href="/request-a-tool"
                    className="font-medium text-primary hover:underline"
                  >
                    Request a tool
                  </Link>
                </li>
              </ul>
            </section>
          </div>

          <p className="mt-8 text-center text-sm">
            <Link
              href="/tools"
              className="font-medium text-primary hover:underline"
            >
              &larr; Back to all tools
            </Link>
          </p>
        </article>
      </div>
    </>
  )
}
