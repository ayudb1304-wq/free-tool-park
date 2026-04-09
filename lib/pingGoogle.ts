export async function pingSitemapUpdate(): Promise<boolean> {
  const sitemapUrl = encodeURIComponent(
    "https://freetoolpark.com/sitemap.xml",
  )

  try {
    const response = await fetch(
      `https://www.google.com/ping?sitemap=${sitemapUrl}`,
    )
    return response.ok
  } catch (error) {
    console.error("Google sitemap ping failed:", error)
    return false
  }
}
