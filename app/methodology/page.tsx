import type { Metadata } from "next"
import Link from "next/link"
import { breadcrumbSchema, SITE_URL, SITE_NAME } from "@/lib/schema"
import { JsonLd } from "@/components/seo/json-ld"
import { Breadcrumb } from "@/components/layout/breadcrumb"

const CONTACT_EMAIL = "sushi@freetoolpark.com"

export const metadata: Metadata = {
  title: "Methodology - How FreeToolPark Calculators Work",
  description:
    "The exact formulas, assumptions, and sources behind every FreeToolPark financial calculator: mortgage, refinance, loan, 401(k), retirement, compound interest, and more.",
  keywords: [
    "FreeToolPark methodology",
    "mortgage calculator formula",
    "401k calculator formula",
    "retirement calculator assumptions",
    "compound interest formula",
    "calculator accuracy",
  ],
  alternates: {
    canonical: `${SITE_URL}/methodology`,
  },
  openGraph: {
    title: "FreeToolPark Methodology",
    description:
      "The exact formulas, assumptions, and sources behind every FreeToolPark financial calculator.",
    url: `${SITE_URL}/methodology`,
    type: "article",
    siteName: "FreeToolPark",
    locale: "en_US",
  },
}

const methodologySchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Methodology: how FreeToolPark calculators work",
  description:
    "The formulas, assumptions, and sources behind every FreeToolPark financial calculator.",
  url: `${SITE_URL}/methodology`,
  datePublished: "2026-04-23",
  dateModified: "2026-04-23",
  inLanguage: "en",
  author: {
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
  },
  publisher: {
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/images/logo.png`,
    },
  },
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": `${SITE_URL}/methodology`,
  },
}

export default function MethodologyPage() {
  return (
    <>
      <JsonLd data={methodologySchema} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: SITE_URL },
          { name: "Methodology", url: `${SITE_URL}/methodology` },
        ])}
      />
      <div className="mx-auto max-w-3xl px-4 py-8">
        <Breadcrumb
          items={[{ label: "Home", href: "/" }, { label: "Methodology" }]}
        />

        <article className="prose prose-neutral dark:prose-invert max-w-none">
          <h1 className="font-heading mb-6 text-3xl font-bold">
            Methodology: how our calculators work
          </h1>

          <p className="text-lg leading-relaxed">
            Every financial calculator on FreeToolPark uses standard formulas
            used by banks, lenders, and financial planners. This page documents
            the formulas, assumptions, and limitations so you can decide when
            to trust the results and when to consult a professional.
          </p>

          <div className="not-prose my-6 rounded-lg border border-amber-500/30 bg-amber-500/5 p-4 text-sm">
            <strong>Estimates only.</strong> Results are for planning and
            educational purposes. Real-world outcomes depend on loan terms,
            tax rules, market conditions, and personal circumstances that no
            online calculator can fully capture. Not financial, tax, or legal
            advice.
          </div>

          <p className="mb-8 text-sm text-muted-foreground">
            Last updated: April 23, 2026
          </p>

          <nav aria-label="On this page" className="not-prose my-6 rounded-lg border bg-card p-4 text-sm">
            <p className="mb-2 font-semibold">On this page</p>
            <ul className="list-inside list-disc space-y-1 text-muted-foreground">
              <li><a href="#principles" className="hover:text-foreground">Principles</a></li>
              <li><a href="#mortgage" className="hover:text-foreground">Mortgage and refinance</a></li>
              <li><a href="#loan" className="hover:text-foreground">Loan and EMI</a></li>
              <li><a href="#compound-interest" className="hover:text-foreground">Compound interest and investments</a></li>
              <li><a href="#retirement" className="hover:text-foreground">Retirement and 401(k)</a></li>
              <li><a href="#savings-goal" className="hover:text-foreground">Savings goal</a></li>
              <li><a href="#income-tax" className="hover:text-foreground">Income tax</a></li>
              <li><a href="#bmi-health" className="hover:text-foreground">BMI and body composition</a></li>
              <li><a href="#unit-conversion" className="hover:text-foreground">Unit conversion</a></li>
              <li><a href="#limits" className="hover:text-foreground">Known limits</a></li>
            </ul>
          </nav>

          <div className="space-y-8 text-muted-foreground">
            <section id="principles">
              <h2 className="font-heading mb-3 text-2xl font-semibold text-foreground">
                Our principles
              </h2>
              <ol className="mt-2 list-inside list-decimal space-y-2">
                <li>
                  <strong className="text-foreground">Standard formulas only.</strong>{" "}
                  We do not invent math. Every calculator uses the same
                  formulas that banks, actuaries, and standards bodies use.
                </li>
                <li>
                  <strong className="text-foreground">Assumptions are visible.</strong>{" "}
                  If a calculator assumes a fixed rate, compounds monthly, or
                  ignores taxes, that assumption is documented below and
                  surfaced on the tool itself where it matters.
                </li>
                <li>
                  <strong className="text-foreground">Nothing is hidden.</strong>{" "}
                  All calculations run client-side. You can open the browser
                  developer tools and inspect the code. Nothing is sent to a
                  server.
                </li>
                <li>
                  <strong className="text-foreground">Precision is disclosed.</strong>{" "}
                  Results are typically rounded to 2 decimal places for
                  currency and 4 decimal places for unit conversions, unless
                  stated otherwise.
                </li>
              </ol>
            </section>

            <section id="mortgage">
              <h2 className="font-heading mb-3 text-2xl font-semibold text-foreground">
                Mortgage and refinance
              </h2>
              <p>
                Tools:{" "}
                <Link href="/tools/mortgage-calculator" className="font-medium text-primary hover:underline">Mortgage Calculator</Link>,{" "}
                <Link href="/tools/refinance-calculator" className="font-medium text-primary hover:underline">Refinance Calculator</Link>,{" "}
                <Link href="/tools/auto-loan-calculator" className="font-medium text-primary hover:underline">Auto Loan Calculator</Link>.
              </p>
              <p className="mt-2">
                Monthly payment uses the standard amortizing-loan formula:
              </p>
              <pre className="mt-2 overflow-x-auto rounded bg-muted p-3 text-sm text-foreground">
{`M = P * (r * (1 + r)^n) / ((1 + r)^n - 1)

where
  M = monthly payment
  P = principal (loan amount)
  r = monthly interest rate (annual rate / 12)
  n = total number of monthly payments (years * 12)`}
              </pre>
              <p className="mt-3">
                <strong className="text-foreground">Assumptions:</strong> fixed
                annual rate for the full term, monthly compounding, equal
                payments. Does not include property taxes, insurance, HOA fees,
                or PMI unless explicitly added as inputs. Refinance break-even
                is calculated as closing costs divided by monthly payment
                savings.
              </p>
              <p className="mt-2">
                <strong className="text-foreground">Sources:</strong> Consumer
                Financial Protection Bureau (CFPB) amortization guidance,
                Federal Reserve loan formula reference.
              </p>
            </section>

            <section id="loan">
              <h2 className="font-heading mb-3 text-2xl font-semibold text-foreground">
                Loan and EMI
              </h2>
              <p>
                Tools:{" "}
                <Link href="/tools/loan-calculator" className="font-medium text-primary hover:underline">Loan Calculator</Link>,{" "}
                <Link href="/tools/emi-calculator" className="font-medium text-primary hover:underline">EMI Calculator</Link>,{" "}
                <Link href="/tools/interest-calculator" className="font-medium text-primary hover:underline">Interest Calculator</Link>.
              </p>
              <p className="mt-2">
                EMI uses the same amortizing formula as the mortgage tool. The
                interest calculator supports both simple interest (I = P * r *
                t) and compound interest (see below).
              </p>
            </section>

            <section id="compound-interest">
              <h2 className="font-heading mb-3 text-2xl font-semibold text-foreground">
                Compound interest and investment return
              </h2>
              <p>
                Tools:{" "}
                <Link href="/tools/compound-interest-calculator" className="font-medium text-primary hover:underline">Compound Interest Calculator</Link>,{" "}
                <Link href="/tools/investment-return-calculator" className="font-medium text-primary hover:underline">Investment Return Calculator</Link>,{" "}
                <Link href="/tools/roi-calculator" className="font-medium text-primary hover:underline">ROI Calculator</Link>.
              </p>
              <p className="mt-2">Future value with recurring contributions:</p>
              <pre className="mt-2 overflow-x-auto rounded bg-muted p-3 text-sm text-foreground">
{`FV = P * (1 + r/n)^(n*t) + PMT * (((1 + r/n)^(n*t) - 1) / (r/n))

where
  FV  = future value
  P   = initial principal
  PMT = periodic contribution
  r   = annual interest rate (decimal)
  n   = compounding periods per year
  t   = time in years`}
              </pre>
              <p className="mt-3">
                <strong className="text-foreground">Assumptions:</strong>{" "}
                constant rate of return, contributions made at the end of each
                period, no fees or taxes unless explicitly modeled. Real
                investment returns vary year to year. Our tools show the
                compounded result assuming a flat rate, which is useful for
                comparison but is not a forecast.
              </p>
              <p className="mt-2">
                <strong className="text-foreground">ROI formula:</strong> ROI =
                (Gain - Cost) / Cost.
              </p>
            </section>

            <section id="retirement">
              <h2 className="font-heading mb-3 text-2xl font-semibold text-foreground">
                Retirement and 401(k)
              </h2>
              <p>
                Tools:{" "}
                <Link href="/tools/retirement-calculator" className="font-medium text-primary hover:underline">Retirement Calculator</Link>,{" "}
                <Link href="/tools/401k-calculator" className="font-medium text-primary hover:underline">401(k) Calculator</Link>.
              </p>
              <p className="mt-2">
                Both tools project future balance using the compound interest
                formula above, adding the annual employee contribution and any
                employer match as recurring deposits. For the 401(k)
                calculator, employer match is modeled as a percent of salary
                capped at the employer match limit.
              </p>
              <p className="mt-2">
                <strong className="text-foreground">Assumptions:</strong>{" "}
                annual contribution limits are not enforced (you are
                responsible for entering realistic numbers), salary growth is
                optional, returns compound annually, no taxes are withheld at
                retirement. The result is a pre-tax balance estimate.
              </p>
              <p className="mt-2">
                <strong className="text-foreground">Sources:</strong> IRS 401(k)
                contribution limit tables (for informational context only),
                standard time-value-of-money formulas.
              </p>
            </section>

            <section id="savings-goal">
              <h2 className="font-heading mb-3 text-2xl font-semibold text-foreground">
                Savings goal
              </h2>
              <p>
                Tool:{" "}
                <Link href="/tools/savings-goal-calculator" className="font-medium text-primary hover:underline">Savings Goal Calculator</Link>.
              </p>
              <p className="mt-2">
                Solves the future value formula above for the required monthly
                contribution given a target balance, time horizon, and assumed
                rate of return.
              </p>
            </section>

            <section id="income-tax">
              <h2 className="font-heading mb-3 text-2xl font-semibold text-foreground">
                Income tax
              </h2>
              <p>
                Tool:{" "}
                <Link href="/tools/income-tax-calculator" className="font-medium text-primary hover:underline">Income Tax Calculator</Link>.
              </p>
              <p className="mt-2">
                Applies published marginal tax brackets for the selected
                jurisdiction and filing status. Standard deduction is applied
                by default unless itemized deductions are entered. State
                taxes, city taxes, FICA, Medicare, and capital gains are not
                modeled unless the tool specifically says so.
              </p>
              <p className="mt-2">
                <strong className="text-foreground">Assumptions:</strong>{" "}
                single tax year, no tax credits beyond those explicitly
                modeled, no special situations (self-employment, AMT, estate,
                trust).
              </p>
              <p className="mt-2">
                Tax rules change every year and vary by jurisdiction. Confirm
                with a qualified tax professional before filing.
              </p>
            </section>

            <section id="bmi-health">
              <h2 className="font-heading mb-3 text-2xl font-semibold text-foreground">
                BMI and body composition
              </h2>
              <p>
                Tools:{" "}
                <Link href="/tools/bmi-calculator" className="font-medium text-primary hover:underline">BMI Calculator</Link>,{" "}
                <Link href="/tools/body-fat-calculator" className="font-medium text-primary hover:underline">Body Fat Calculator</Link>,{" "}
                <Link href="/tools/calorie-calculator" className="font-medium text-primary hover:underline">Calorie Calculator</Link>,{" "}
                <Link href="/tools/macro-calculator" className="font-medium text-primary hover:underline">Macro Calculator</Link>.
              </p>
              <p className="mt-2">BMI uses the WHO formula:</p>
              <pre className="mt-2 overflow-x-auto rounded bg-muted p-3 text-sm text-foreground">
{`BMI = weight_kg / (height_m)^2`}
              </pre>
              <p className="mt-3">
                Body fat percentage uses the U.S. Navy method (circumference
                measurements) by default. Calorie needs use the Mifflin-St Jeor
                equation for basal metabolic rate, multiplied by an activity
                factor. Macro splits follow standard fitness-industry ratios
                (for example, 40/30/30 balanced).
              </p>
              <p className="mt-2">
                <strong className="text-foreground">Assumptions:</strong> BMI
                is a screening tool, not a diagnosis. It does not account for
                muscle mass, bone density, or fat distribution. Use it as a
                starting point, not a verdict.
              </p>
            </section>

            <section id="unit-conversion">
              <h2 className="font-heading mb-3 text-2xl font-semibold text-foreground">
                Unit conversion
              </h2>
              <p>
                Tools:{" "}
                <Link href="/categories/converters" className="font-medium text-primary hover:underline">all converters</Link>, plus 324 dedicated pairs at{" "}
                <code>/tools/convert/&lt;pair&gt;</code>.
              </p>
              <p className="mt-2">
                All unit conversions multiply the input by the internationally
                standardized conversion factor for that unit pair. Source
                factors come from SI definitions, NIST, and ISO standards.
                Temperature conversions use the exact arithmetic conversions
                (not multiplicative factors) between Celsius, Fahrenheit, and
                Kelvin.
              </p>
              <p className="mt-2">
                Digital storage conversions default to binary prefixes (1 KB
                = 1024 bytes), which matches what operating systems display.
                SI decimal prefixes (1 KB = 1000 bytes), which matches what
                hard drive manufacturers advertise, are available for
                comparison.
              </p>
            </section>

            <section id="limits">
              <h2 className="font-heading mb-3 text-2xl font-semibold text-foreground">
                Known limits
              </h2>
              <ul className="mt-2 list-inside list-disc space-y-2">
                <li>
                  We do not model inflation unless a tool explicitly lets you
                  enter an inflation rate.
                </li>
                <li>
                  Rates are assumed fixed for the full term unless the tool
                  supports a variable-rate input.
                </li>
                <li>
                  Taxes are only modeled by tools that explicitly say so.
                </li>
                <li>
                  Currency is cosmetic. Math works the same regardless of
                  currency symbol.
                </li>
                <li>
                  Calculations assume modern browser JavaScript number
                  precision (IEEE 754 doubles). Very large or very precise
                  values may lose precision in the last few digits.
                </li>
              </ul>
            </section>

            <section id="report">
              <h2 className="font-heading mb-3 text-2xl font-semibold text-foreground">
                Report an issue
              </h2>
              <p>
                Spotted a bug in a calculation, disagreement with a formula,
                or outdated tax rule? Email{" "}
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="font-medium text-primary hover:underline"
                >
                  {CONTACT_EMAIL}
                </a>{" "}
                or reach us via the{" "}
                <Link
                  href="/contact"
                  className="font-medium text-primary hover:underline"
                >
                  contact page
                </Link>
                . Accuracy issues get priority.
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
