import type { Metadata } from "next"
import { getAllTools } from "@/lib/tools"
import { SITE_URL } from "@/lib/schema"
import { JsonLd } from "@/components/seo/json-ld"
import { ToolsGrid } from "@/components/tools-grid"
import { Breadcrumb } from "@/components/layout/breadcrumb"

export const metadata: Metadata = {
  title: "100+ Free Online Tools - No Signup Required",
  description:
    "Browse 100+ free online tools for text processing, development, calculations, conversions, SEO, and more. No signup required.",
  alternates: {
    canonical: `${SITE_URL}/tools`,
    languages: {
      en: `${SITE_URL}/tools`,
      "x-default": `${SITE_URL}/tools`,
    },
  },
  openGraph: {
    title: "100+ Free Online Tools | FreeToolPark",
    description:
      "Browse 100+ free online tools for text processing, development, calculations, conversions, SEO, and more.",
    url: `${SITE_URL}/tools`,
    type: "website",
    siteName: "FreeToolPark",
    locale: "en_US",
    images: [
      {
        url: `${SITE_URL}/images/og-default.png`,
        width: 1200,
        height: 630,
        alt: "FreeToolPark - All Free Online Tools",
      },
    ],
  },
}

export default function ToolsPage() {
  const tools = getAllTools()

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Free Online Tools",
    description:
      "100+ free browser-based tools for developers, writers, and everyday users. No signup required.",
    url: `${SITE_URL}/tools`,
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Tools" }]} />
      <JsonLd data={collectionSchema} />

      <h1 className="font-heading mb-2 text-3xl font-bold">
        100+ Free Online Tools - No Signup Required
      </h1>

      <p className="mb-1 text-sm text-muted-foreground">
        Last updated: April 2026
      </p>
      <p className="mb-8 max-w-3xl text-muted-foreground">
        FreeToolPark offers 100+ free browser-based tools for developers,
        writers, students, and everyday users. From JSON formatters and regex
        testers to mortgage calculators and QR code generators, every tool runs
        entirely in your browser, processes data locally, and requires zero
        account or signup. Use the search below or browse by category to find
        the tool you need.
      </p>

      <ToolsGrid tools={tools} showSearch showCategoryFilter />
    </div>
  )
}
