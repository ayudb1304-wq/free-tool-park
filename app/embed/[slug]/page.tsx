import { notFound } from "next/navigation"
import { getToolBySlug, getAllTools } from "@/lib/tools"
import { BUILT_TOOL_SLUGS } from "@/lib/built-tools"
import { EmbedToolRenderer } from "@/components/embed/embed-tool-renderer"

export const metadata = {
  robots: "noindex, nofollow",
}

export function generateStaticParams() {
  return getAllTools()
    .filter((t) => BUILT_TOOL_SLUGS.has(t.componentName))
    .map((t) => ({ slug: t.slug }))
}

export default async function EmbedToolPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const tool = getToolBySlug(slug)

  if (!tool || !BUILT_TOOL_SLUGS.has(tool.componentName)) {
    notFound()
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-4">
      <h2 className="mb-4 text-lg font-semibold">{tool.name}</h2>
      <EmbedToolRenderer componentName={tool.componentName} />
      <footer className="mt-4 border-t pt-2 text-center text-xs text-muted-foreground">
        Powered by{" "}
        <a
          href={`https://www.freetoolpark.com/tools/${slug}?ref=embed`}
          target="_blank"
          rel="noopener"
          className="font-medium text-primary hover:underline"
        >
          FreeToolPark
        </a>
        {" "}- Free Privacy-First Tools
      </footer>
    </div>
  )
}
