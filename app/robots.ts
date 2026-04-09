import type { MetadataRoute } from "next"
import { SITE_URL } from "@/lib/schema"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/_next/",
          "/admin/",
          "/embed/", // Don't index embed versions (they're for iframes)
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
