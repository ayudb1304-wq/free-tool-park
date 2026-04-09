/**
 * Google deprecated the /ping?sitemap= endpoint in late 2023.
 * Sitemaps should be submitted via Google Search Console instead.
 * This function is kept as a no-op to avoid breaking the postbuild script.
 *
 * To get indexed:
 * 1. Submit sitemap.xml in Google Search Console
 * 2. Use the URL Inspection tool for priority pages
 * 3. IndexNow handles Bing and Yandex automatically
 */
export async function pingSitemapUpdate(): Promise<boolean> {
  console.log(
    "[Google] Sitemap ping endpoint was deprecated in 2023. Submit your sitemap at https://search.google.com/search-console instead.",
  )
  return true
}
