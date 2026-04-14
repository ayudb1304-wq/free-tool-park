import type { MetadataRoute } from "next"
import { TOOLS } from "@/data/tools"
import { CATEGORIES } from "@/data/categories"
import { getAllPersonaSlugs } from "@/data/personas"
import { ALL_CONVERSION_PAIRS } from "@/data/conversions"
import { SITE_URL } from "@/lib/schema"

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/tools`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/embed`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/privacy`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/terms`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ]

  const personaPages: MetadataRoute.Sitemap = getAllPersonaSlugs().map(
    (slug) => ({
      url: `${SITE_URL}/for/${slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }),
  )

  const categoryPages: MetadataRoute.Sitemap = CATEGORIES.map((cat) => ({
    url: `${SITE_URL}/categories/${cat.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }))

  const toolPages: MetadataRoute.Sitemap = TOOLS.map((tool) => ({
    url: `${SITE_URL}/tools/${tool.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }))

  const converterPages: MetadataRoute.Sitemap = ALL_CONVERSION_PAIRS.map(
    (pair) => ({
      url: `${SITE_URL}/tools/convert/${pair.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }),
  )

  return [
    ...staticPages,
    ...personaPages,
    ...categoryPages,
    ...toolPages,
    ...converterPages,
  ]
}
