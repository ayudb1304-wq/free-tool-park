import {
  ArrowLeftRightIcon,
  CalculatorIcon,
  CodeIcon,
  SeoIcon,
  SparklesIcon,
  TextFontIcon,
} from "@hugeicons/core-free-icons"

export const CATEGORY_SLUGS = [
  "calculators",
  "developer-tools",
  "text-tools",
  "converters",
  "seo-tools",
  "generators",
] as const

export type CategorySlug = (typeof CATEGORY_SLUGS)[number]

export interface Category {
  slug: CategorySlug
  name: string
  description: string
  icon: typeof CalculatorIcon
}

export const CATEGORIES: Category[] = [
  {
    slug: "calculators",
    name: "Calculators",
    description:
      "Free online calculators for mortgage, BMI, percentage, and more.",
    icon: CalculatorIcon,
  },
  {
    slug: "developer-tools",
    name: "Developer Tools",
    description:
      "Free online developer tools for JSON, Base64, regex, hashing, and more.",
    icon: CodeIcon,
  },
  {
    slug: "text-tools",
    name: "Text Tools",
    description:
      "Free online text tools for word counting, case conversion, and more.",
    icon: TextFontIcon,
  },
  {
    slug: "converters",
    name: "Converters",
    description:
      "Free online converters for units, numbers, and data formats.",
    icon: ArrowLeftRightIcon,
  },
  {
    slug: "seo-tools",
    name: "SEO Tools",
    description:
      "Free online SEO tools for meta tags, sitemaps, and keyword analysis.",
    icon: SeoIcon,
  },
  {
    slug: "generators",
    name: "Generators",
    description:
      "Free online generators for passwords, QR codes, UUIDs, and more.",
    icon: SparklesIcon,
  },
]

export function getCategoryBySlug(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug)
}
