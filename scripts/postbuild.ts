/**
 * Post-build script: pings IndexNow and Google after every build.
 * Runs automatically via the "postbuild" npm script.
 */

import { pingIndexNow } from "@/lib/indexnow"
import { pingSitemapUpdate } from "@/lib/pingGoogle"
import { TOOLS } from "@/data/tools"
import { CATEGORIES } from "@/data/categories"
import { getAllPersonaSlugs } from "@/data/personas"

async function postbuild() {
  const baseUrl = "https://freetoolpark.com"

  // 1. Ping Google about sitemap update
  console.log("[postbuild] Pinging Google sitemap...")
  const googleOk = await pingSitemapUpdate()
  console.log(
    `[postbuild] Google sitemap ping: ${googleOk ? "success" : "failed"}`,
  )

  // 2. Submit all URLs to IndexNow (Bing + Yandex)
  const urls = [
    baseUrl,
    `${baseUrl}/tools`,
    `${baseUrl}/privacy`,
    `${baseUrl}/terms`,
    `${baseUrl}/embed`,
    ...getAllPersonaSlugs().map((slug) => `${baseUrl}/for/${slug}`),
    ...CATEGORIES.map((cat) => `${baseUrl}/categories/${cat.slug}`),
    ...TOOLS.map((tool) => `${baseUrl}/tools/${tool.slug}`),
  ]

  console.log(`[postbuild] Pinging IndexNow with ${urls.length} URLs...`)
  const indexNowOk = await pingIndexNow(urls)
  console.log(
    `[postbuild] IndexNow ping: ${indexNowOk ? "success" : "failed"}`,
  )
}

postbuild()
