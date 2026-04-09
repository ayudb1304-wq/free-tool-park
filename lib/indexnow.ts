const INDEXNOW_KEY = process.env.INDEXNOW_KEY!
const SITE_HOST = "freetoolpark.com"

export async function pingIndexNow(urls: string[]): Promise<boolean> {
  try {
    const response = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        host: SITE_HOST,
        key: INDEXNOW_KEY,
        keyLocation: `https://${SITE_HOST}/${INDEXNOW_KEY}.txt`,
        urlList: urls,
      }),
    })

    return response.ok
  } catch (error) {
    console.error("IndexNow ping failed:", error)
    return false
  }
}
