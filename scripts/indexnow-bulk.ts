/**
 * Bulk-submit all site URLs to IndexNow (Bing + Yandex).
 *
 * Usage:
 *   INDEXNOW_KEY=your_key npx tsx scripts/indexnow-bulk.ts
 *
 * Run this once after initial deployment, or whenever you add
 * a batch of new tools.
 */

import { pingIndexNow } from "@/lib/indexnow"
import { getAllToolSlugs } from "@/lib/tools"
import { getAllPersonaSlugs } from "@/data/personas"
import { CATEGORIES } from "@/data/categories"

async function submitAllPages() {
  const toolSlugs = getAllToolSlugs()
  const personaSlugs = getAllPersonaSlugs()
  const baseUrl = "https://freetoolpark.com"

  const urls = [
    baseUrl,
    `${baseUrl}/tools`,
    `${baseUrl}/privacy`,
    `${baseUrl}/terms`,
    `${baseUrl}/embed`,
    ...personaSlugs.map((slug) => `${baseUrl}/for/${slug}`),
    ...CATEGORIES.map((cat) => `${baseUrl}/categories/${cat.slug}`),
    ...toolSlugs.map((slug) => `${baseUrl}/tools/${slug}`),
  ]

  // IndexNow accepts max 10,000 URLs per request
  const chunkSize = 10000
  for (let i = 0; i < urls.length; i += chunkSize) {
    const chunk = urls.slice(i, i + chunkSize)
    const ok = await pingIndexNow(chunk)
    console.log(
      `Submitted ${chunk.length} URLs to IndexNow: ${ok ? "success" : "failed"}`,
    )
  }

  console.log(`\nTotal URLs submitted: ${urls.length}`)
}

submitAllPages()
