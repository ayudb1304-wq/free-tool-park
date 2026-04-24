import type { Tool } from "@/data/tools"
import type { Category } from "@/data/categories"
import type { CategorySlug } from "@/data/categories"
import type { BlogPost } from "@/data/blog-posts"

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
  finance: "FinanceApplication",
  calculators: "UtilityApplication",
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
    inLanguage: "en",
    mainEntity: {
      "@type": "ItemList",
      name: `Free ${category.name}`,
      numberOfItems: tools.length,
      itemListElement: tools.map((tool, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `${SITE_URL}/tools/${tool.slug}`,
        name: tool.name,
      })),
    },
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

export function blogPostingSchema(post: BlogPost) {
  const url = `${SITE_URL}/blog/${post.slug}`
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.metaDescription,
    url,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    datePublished: post.publishedDate,
    dateModified: post.lastUpdated,
    inLanguage: "en",
    keywords: post.keywords.join(", "),
    image: `${SITE_URL}/images/og-default.png`,
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
  }
}

export function answerPageSchema(input: {
  question: string
  url: string
  answerText: string
  datePublished: string
  dateModified: string
  keywords: string[]
}) {
  return {
    "@context": "https://schema.org",
    "@type": "QAPage",
    mainEntity: {
      "@type": "Question",
      name: input.question,
      text: input.question,
      answerCount: 1,
      datePublished: input.datePublished,
      dateModified: input.dateModified,
      inLanguage: "en",
      acceptedAnswer: {
        "@type": "Answer",
        text: input.answerText,
        url: input.url,
        datePublished: input.datePublished,
        author: {
          "@type": "Organization",
          name: SITE_NAME,
          url: SITE_URL,
        },
      },
      author: {
        "@type": "Organization",
        name: SITE_NAME,
        url: SITE_URL,
      },
    },
    url: input.url,
    datePublished: input.datePublished,
    dateModified: input.dateModified,
    inLanguage: "en",
    keywords: input.keywords.join(", "),
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/images/logo.png`,
      },
    },
  }
}

export function blogIndexSchema(posts: BlogPost[]) {
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: `${SITE_NAME} Blog`,
    url: `${SITE_URL}/blog`,
    description:
      "Guides, benchmarks, and worked examples for finance, developer, and unit conversion tools on FreeToolPark.",
    inLanguage: "en",
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/images/logo.png`,
      },
    },
    mainEntity: {
      "@type": "ItemList",
      name: `${SITE_NAME} Blog posts`,
      numberOfItems: posts.length,
      itemListElement: posts.map((post, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `${SITE_URL}/blog/${post.slug}`,
        name: post.title,
      })),
    },
    blogPost: posts.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      url: `${SITE_URL}/blog/${post.slug}`,
      datePublished: post.publishedDate,
      dateModified: post.lastUpdated,
      description: post.metaDescription,
    })),
  }
}
