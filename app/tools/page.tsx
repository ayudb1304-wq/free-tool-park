import type { Metadata } from "next"
import { getAllTools } from "@/lib/tools"
import { ToolsGrid } from "@/components/tools-grid"
import { Breadcrumb } from "@/components/layout/breadcrumb"

export const metadata: Metadata = {
  title: "All Free Online Tools",
  description:
    "Browse 100+ free online tools for text processing, development, calculations, conversions, SEO, and more. No signup required.",
}

export default function ToolsPage() {
  const tools = getAllTools()

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Tools" }]} />

      <h1 className="font-heading mb-6 text-3xl font-bold">
        All Free Online Tools
      </h1>

      <ToolsGrid tools={tools} showSearch showCategoryFilter />
    </div>
  )
}
