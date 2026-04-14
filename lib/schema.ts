import type { Tool } from "@/data/tools"
import type { Category } from "@/data/categories"
import type { CategorySlug } from "@/data/categories"

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.freetoolpark.com"
export const SITE_NAME = "FreeToolPark"

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: `${SITE_NAME} - Free Online Tools`,
    url: SITE_URL,
    description:
      "100+ free online tools for text, development, calculations, conversions, and more. No signup required.",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/tools?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  }
}

const CATEGORY_SUB_MAP: Record<CategorySlug, string> = {
  calculators: "FinanceApplication",
  "developer-tools": "DeveloperApplication",
  "text-tools": "UtilityApplication",
  converters: "UtilityApplication",
  "seo-tools": "WebApplication",
  generators: "UtilityApplication",
}

export function toolSchema(tool: Tool) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: tool.name,
    url: `${SITE_URL}/tools/${tool.slug}`,
    description: tool.metaDescription,
    applicationCategory: "UtilityApplication",
    applicationSubCategory:
      CATEGORY_SUB_MAP[tool.category] || "UtilityApplication",
    operatingSystem: "All",
    permissions: "none",
    browserRequirements: "Requires JavaScript",
    softwareVersion: "2026.04",
    image: `${SITE_URL}/images/og-default.png`,
    screenshot: `${SITE_URL}/images/og-default.png`,
    datePublished: "2026-04-09",
    dateModified: tool.lastUpdated || new Date().toISOString().split("T")[0],
    inLanguage: "en",
    isAccessibleForFree: true,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
    featureList: tool.keywords.join(", "),
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
    maintainer: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
  }
}

export function faqSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  }
}

export function categorySchema(category: Category, tools: Tool[]) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `Free ${category.name} Online`,
    description: category.description,
    url: `${SITE_URL}/categories/${category.slug}`,
    hasPart: tools.map((tool) => ({
      "@type": "SoftwareApplication",
      name: tool.name,
      url: `${SITE_URL}/tools/${tool.slug}`,
    })),
  }
}

export function breadcrumbSchema(
  items: { name: string; url: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

export function howToSchema(tool: Tool) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: `How to Use the ${tool.name}`,
    description: tool.metaDescription,
    step: tool.steps.map((step, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: step.title,
      text: step.description,
    })),
  }
}
