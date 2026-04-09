import type { Metadata } from "next"
import { getAllTools } from "@/lib/tools"
import { SITE_URL } from "@/lib/schema"
import { ToolsGrid } from "@/components/tools-grid"
import { Breadcrumb } from "@/components/layout/breadcrumb"

export const metadata: Metadata = {
  title: "All Free Online Tools",
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
    title: "All Free Online Tools | FreeToolPark",
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

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Tools" }]} />

      <h1 className="font-heading mb-6 text-3xl font-bold">
        All Free Online Tools
      </h1>

      <ToolsGrid tools={tools} showSearch showCategoryFilter />
    </div>
  )
}
