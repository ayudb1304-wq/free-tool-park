import { getAllTools } from "@/lib/tools"
import { ToolsGrid } from "@/components/tools-grid"

export default function HomePage() {
  const tools = getAllTools()

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <section className="mb-12 text-center">
        <h1 className="font-heading text-4xl font-bold tracking-tight sm:text-5xl">
          Free Online Tools
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          100+ free browser-based tools for developers, creators, and everyone.
          No signup, no data collection -everything runs locally in your
          browser.
        </p>
      </section>

      <ToolsGrid tools={tools} showSearch showCategoryFilter />
    </div>
  )
}
