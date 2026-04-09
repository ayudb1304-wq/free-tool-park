import type { Metadata } from "next"
import Link from "next/link"
import { breadcrumbSchema, faqSchema, SITE_URL } from "@/lib/schema"
import { JsonLd } from "@/components/seo/json-ld"
import { Breadcrumb } from "@/components/layout/breadcrumb"

export const metadata: Metadata = {
  title: "Free Embeddable Widgets & Calculators for Your Website",
  description:
    "Add free calculators, converters, and tools to your website. Privacy-first, customizable widgets with one-click embed code. No signup required.",
  keywords: [
    "free embeddable calculator",
    "website widget",
    "embed calculator",
    "free currency converter widget",
    "embeddable tools",
  ],
  alternates: {
    canonical: `${SITE_URL}/embed`,
  },
}

const AVAILABLE_WIDGETS = [
  {
    name: "Mortgage Calculator",
    slug: "mortgage-calculator",
    description: "Add a mortgage payment calculator to your real estate blog.",
  },
  {
    name: "BMI Calculator",
    slug: "bmi-calculator",
    description: "Embed a BMI calculator on your health or fitness website.",
  },
  {
    name: "Word Counter",
    slug: "word-counter",
    description:
      "Add a word counter tool to your writing blog or education site.",
  },
  {
    name: "Percentage Calculator",
    slug: "percentage-calculator",
    description: "Embed a percentage calculator for education or finance sites.",
  },
  {
    name: "Color Picker",
    slug: "color-picker",
    description:
      "Add a color picker tool to your design blog or portfolio site.",
  },
  {
    name: "Password Generator",
    slug: "password-generator",
    description:
      "Embed a secure password generator on your security-focused site.",
  },
]

export default function EmbedShowcasePage() {
  const faqs = [
    {
      question: "Are these widgets really free to use?",
      answer:
        "Yes, all our embeddable widgets are 100% free with no usage limits. We only ask that you keep the small attribution link.",
    },
    {
      question: "Do the widgets collect user data?",
      answer:
        "No. All calculations happen in the browser. We don't collect, store, or transmit any data entered into our widgets.",
    },
    {
      question: "Will the widgets slow down my website?",
      answer:
        "No. Widgets load asynchronously in an iframe and don't block your page rendering. They're optimized for Core Web Vitals.",
    },
  ]

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: SITE_URL },
          { name: "Embeddable Widgets", url: `${SITE_URL}/embed` },
        ])}
      />
      <JsonLd data={faqSchema(faqs)} />
      <div className="mx-auto max-w-6xl px-4 py-8">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Embeddable Widgets" },
          ]}
        />

      <h1 className="text-center text-3xl font-bold md:text-4xl">
        Free Embeddable Widgets for Your Website
      </h1>

      <p className="mx-auto mt-4 max-w-2xl text-center text-xl text-muted-foreground">
        Add powerful calculators and tools to your blog, website, or app.
        Privacy-first, fully customizable, and always free.
      </p>

      {/* Trust badges */}
      <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
        <span>&#10003; No signup required</span>
        <span>&#10003; Customize colors &amp; defaults</span>
        <span>&#10003; Mobile responsive</span>
        <span>&#10003; GDPR compliant</span>
      </div>

      {/* Widget gallery */}
      <section className="mt-16">
        <h2 className="mb-8 text-2xl font-semibold">Available Widgets</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {AVAILABLE_WIDGETS.map((widget) => (
            <div
              key={widget.slug}
              className="rounded-lg border p-6 transition hover:shadow-md"
            >
              <h3 className="text-lg font-semibold">{widget.name}</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {widget.description}
              </p>
              <Link
                href={`/tools/${widget.slug}`}
                className="mt-4 inline-block text-sm font-medium text-primary hover:underline"
              >
                Preview tool &rarr;
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="mt-16">
        <h2 className="mb-6 text-2xl font-semibold">
          How to Add a Widget to Your Website
        </h2>
        <ol className="max-w-2xl space-y-4">
          <li className="flex gap-4">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground">
              1
            </span>
            <div>
              <strong>Choose your widget</strong>
              <p className="text-muted-foreground">
                Browse our collection and select the tool you want to embed.
              </p>
            </div>
          </li>
          <li className="flex gap-4">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground">
              2
            </span>
            <div>
              <strong>Customize appearance</strong>
              <p className="text-muted-foreground">
                Set default values, colors, and dimensions to match your site.
              </p>
            </div>
          </li>
          <li className="flex gap-4">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground">
              3
            </span>
            <div>
              <strong>Copy the embed code</strong>
              <p className="text-muted-foreground">
                Paste the iframe code into your HTML and you&apos;re done!
              </p>
            </div>
          </li>
        </ol>
      </section>

      {/* FAQ */}
      <section className="mt-16">
        <h2 className="mb-6 text-2xl font-semibold">
          Frequently Asked Questions
        </h2>
        <div className="max-w-2xl space-y-6">
          <div>
            <h3 className="font-medium">
              Are these widgets really free to use?
            </h3>
            <p className="mt-2 text-muted-foreground">
              Yes, all our embeddable widgets are 100% free with no usage
              limits. We only ask that you keep the small attribution link.
            </p>
          </div>
          <div>
            <h3 className="font-medium">
              Do the widgets collect user data?
            </h3>
            <p className="mt-2 text-muted-foreground">
              No. All calculations happen in the browser. We don&apos;t collect,
              store, or transmit any data entered into our widgets.
            </p>
          </div>
          <div>
            <h3 className="font-medium">
              Will the widgets slow down my website?
            </h3>
            <p className="mt-2 text-muted-foreground">
              No. Widgets load asynchronously in an iframe and don&apos;t block
              your page rendering. They&apos;re optimized for Core Web Vitals.
            </p>
          </div>
        </div>
      </section>
    </div>
    </>
  )
}
