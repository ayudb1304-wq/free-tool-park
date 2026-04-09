import { ImageResponse } from "next/og"
import { getToolBySlug } from "@/lib/tools"
import { getCategoryBySlug } from "@/data/categories"

export const alt = "FreeToolPark"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function OgImage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const tool = getToolBySlug(slug)
  const category = tool ? getCategoryBySlug(tool.category) : null

  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "60px",
          fontFamily: "sans-serif",
        }}
      >
        {category && (
          <div
            style={{
              fontSize: 22,
              color: "#a5b4fc",
              marginBottom: 20,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
            }}
          >
            {category.name}
          </div>
        )}
        <div
          style={{
            fontSize: 68,
            fontWeight: 800,
            color: "white",
            textAlign: "center",
            lineHeight: 1.1,
            marginBottom: 24,
          }}
        >
          {tool?.name ?? "Free Online Tool"}
        </div>
        <div
          style={{
            fontSize: 26,
            color: "#c7d2fe",
            textAlign: "center",
            maxWidth: 800,
          }}
        >
          {tool?.metaDescription ??
            "Free browser-based utility tool. No signup required."}
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 40,
            fontSize: 20,
            color: "#6366f1",
            fontWeight: 600,
          }}
        >
          FreeToolPark.com
        </div>
      </div>
    ),
    { ...size }
  )
}
