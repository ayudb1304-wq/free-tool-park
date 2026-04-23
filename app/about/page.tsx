import type { Metadata } from "next"
import Link from "next/link"
import { breadcrumbSchema, SITE_URL, SITE_NAME } from "@/lib/schema"
import { JsonLd } from "@/components/seo/json-ld"
import { Breadcrumb } from "@/components/layout/breadcrumb"

const CONTACT_EMAIL = "sushi@freetoolpark.com"

export const metadata: Metadata = {
  title: "About FreeToolPark - Free, Private, No-Signup Online Tools",
  description:
    "FreeToolPark builds fast, privacy-first online tools that run entirely in your browser. No signups, no tracking of your inputs, no paywalls. Learn who we are and why we built it.",
  keywords: [
    "about FreeToolPark",
    "free online tools",
    "privacy-first tools",
    "client-side tools",
    "no signup calculator",
  ],
  alternates: {
    canonical: `${SITE_URL}/about`,
  },
  openGraph: {
    title: "About FreeToolPark",
    description:
      "FreeToolPark builds fast, privacy-first online tools that run entirely in your browser. No signups, no tracking, no paywalls.",
    url: `${SITE_URL}/about`,
    type: "website",
    siteName: "FreeToolPark",
    locale: "en_US",
  },
}

const aboutPageSchema = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: `About ${SITE_NAME}`,
  url: `${SITE_URL}/about`,
  mainEntity: {
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    email: CONTACT_EMAIL,
    logo: `${SITE_URL}/images/logo.png`,
    description:
      "FreeToolPark builds privacy-first online tools that run entirely in the browser. No signups, no tracking of inputs, no paywalls.",
    foundingDate: "2026",
    sameAs: [],
  },
}

export default function AboutPage() {
  return (
    <>
      <JsonLd data={aboutPageSchema} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: SITE_URL },
          { name: "About", url: `${SITE_URL}/about` },
        ])}
      />
      <div className="mx-auto max-w-3xl px-4 py-8">
        <Breadcrumb
          items={[{ label: "Home", href: "/" }, { label: "About" }]}
        />

        <article className="prose prose-neutral dark:prose-invert max-w-none">
          <h1 className="font-heading mb-6 text-3xl font-bold">
            About FreeToolPark
          </h1>

          <p className="text-lg leading-relaxed">
            FreeToolPark is a growing library of free online tools that run
            entirely in your browser. No signups. No input tracking. No
            paywalls. Just tools that work.
          </p>

          <div className="not-prose my-8 rounded-lg border border-green-200 bg-green-50 p-6 dark:border-green-800 dark:bg-green-950">
            <h2 className="mb-3 text-xl font-bold text-green-800 dark:text-green-200">
              What makes us different
            </h2>
            <ul className="space-y-2 text-green-700 dark:text-green-300">
              <li className="flex items-start gap-2">
                <span>&#10003;</span>
                <span>
                  <strong>Everything runs client-side.</strong> Your inputs
                  never touch our servers.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span>&#10003;</span>
                <span>
                  <strong>No account required.</strong> Every tool works
                  instantly, with no sign-up wall.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span>&#10003;</span>
                <span>
                  <strong>No hidden paywalls.</strong> All tools are free, with
                  no &quot;pro&quot; tier.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span>&#10003;</span>
                <span>
                  <strong>Works offline after first load.</strong> Bookmark any
                  tool and keep using it on the subway.
                </span>
              </li>
            </ul>
          </div>

          <div className="space-y-6 text-muted-foreground">
            <section>
              <h2 className="font-heading mb-3 text-xl font-semibold text-foreground">
                Our mission
              </h2>
              <p>
                Most online tool sites have gotten worse over the last decade.
                They track every keystroke, require accounts for basic
                functionality, bury useful features behind upsells, and stuff
                the page with pop-ups.
              </p>
              <p className="mt-2">
                FreeToolPark is the opposite. We believe a mortgage calculator
                should not need your email. A JSON formatter should not send
                your code to a server. A password generator should absolutely
                never log its output.
              </p>
              <p className="mt-2">
                So we built a tool site that does none of those things. Every
                calculator, converter, generator, and formatter here runs
                entirely in your browser using client-side JavaScript. You can
                open your browser&apos;s Network tab and confirm for yourself
                that your data never leaves your device.
              </p>
            </section>

            <section>
              <h2 className="font-heading mb-3 text-xl font-semibold text-foreground">
                What you will find here
              </h2>
              <p>
                We currently host{" "}
                <Link
                  href="/tools"
                  className="font-medium text-primary hover:underline"
                >
                  60+ tools
                </Link>{" "}
                across six categories, plus hundreds of dedicated{" "}
                <Link
                  href="/tools/convert/cm-to-in"
                  className="font-medium text-primary hover:underline"
                >
                  unit conversion pages
                </Link>
                :
              </p>
              <ul className="mt-2 list-inside list-disc space-y-1">
                <li>
                  <Link
                    href="/categories/calculators"
                    className="font-medium text-primary hover:underline"
                  >
                    Calculators
                  </Link>{" "}
                  for finance, health, and math
                </li>
                <li>
                  <Link
                    href="/categories/developer-tools"
                    className="font-medium text-primary hover:underline"
                  >
                    Developer tools
                  </Link>{" "}
                  like JSON formatter, regex tester, base64 encoder
                </li>
                <li>
                  <Link
                    href="/categories/text-tools"
                    className="font-medium text-primary hover:underline"
                  >
                    Text tools
                  </Link>{" "}
                  for writers, editors, and students
                </li>
                <li>
                  <Link
                    href="/categories/converters"
                    className="font-medium text-primary hover:underline"
                  >
                    Converters
                  </Link>{" "}
                  for units, number bases, and data sizes
                </li>
                <li>
                  <Link
                    href="/categories/seo-tools"
                    className="font-medium text-primary hover:underline"
                  >
                    SEO tools
                  </Link>{" "}
                  for meta tags, sitemaps, and keyword analysis
                </li>
                <li>
                  <Link
                    href="/categories/generators"
                    className="font-medium text-primary hover:underline"
                  >
                    Generators
                  </Link>{" "}
                  for passwords, UUIDs, QR codes, and placeholder content
                </li>
              </ul>
            </section>

            <section>
              <h2 className="font-heading mb-3 text-xl font-semibold text-foreground">
                How we make money
              </h2>
              <p>
                At the time of writing we do not run ads. When we do, it will be
                non-intrusive display ads via standard networks, placed so they
                never interfere with using the tool.
              </p>
              <p className="mt-2">
                Ad networks will never see your tool inputs. They only know
                which page you visited, not what you typed into it. Our{" "}
                <Link
                  href="/privacy"
                  className="font-medium text-primary hover:underline"
                >
                  Privacy Policy
                </Link>{" "}
                explains exactly what is and is not collected.
              </p>
            </section>

            <section>
              <h2 className="font-heading mb-3 text-xl font-semibold text-foreground">
                Accuracy and methodology
              </h2>
              <p>
                Our financial calculators use the same formulas banks, lenders,
                and financial planners use. You can read the exact formulas and
                assumptions on our{" "}
                <Link
                  href="/methodology"
                  className="font-medium text-primary hover:underline"
                >
                  Methodology page
                </Link>
                . Financial and tax tools are estimates and should not replace
                advice from a qualified professional for life-changing
                decisions.
              </p>
            </section>

            <section>
              <h2 className="font-heading mb-3 text-xl font-semibold text-foreground">
                Who builds this
              </h2>
              <p>
                FreeToolPark is built by a small independent team. We write
                every tool by hand, verify the math, and test on real devices.
                We do not outsource content generation, and every calculator is
                reviewed before it ships.
              </p>
              <p className="mt-2">
                Have feedback, spotted a bug, or want to suggest a tool? We
                want to hear from you. Reach us at{" "}
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="font-medium text-primary hover:underline"
                >
                  {CONTACT_EMAIL}
                </a>{" "}
                or through the{" "}
                <Link
                  href="/contact"
                  className="font-medium text-primary hover:underline"
                >
                  contact page
                </Link>
                .
              </p>
            </section>

            <section>
              <h2 className="font-heading mb-3 text-xl font-semibold text-foreground">
                Request a tool
              </h2>
              <p>
                Not seeing a tool you need? Let us know. We prioritize the
                build queue based on reader requests.
              </p>
              <p className="mt-2">
                <Link
                  href="/request-a-tool"
                  className="font-medium text-primary hover:underline"
                >
                  Submit a tool request
                </Link>
              </p>
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
