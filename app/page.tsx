import Image from "next/image"
import { getAllTools } from "@/lib/tools"
import { ToolsGrid } from "@/components/tools-grid"

export default function HomePage() {
  const tools = getAllTools()

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <section className="mb-12 text-center">
        <div aria-hidden="true">
          <Image
            src="/images/FreeToolpark-namelogo.png"
            alt=""
            width={400}
            height={200}
            className="mx-auto hidden h-auto w-[280px] sm:w-[400px] dark:block"
            priority
          />
          <Image
            src="/images/FreeToolpark-balcktext-lighttheme.png"
            alt=""
            width={400}
            height={200}
            className="mx-auto block h-auto w-[280px] sm:w-[400px] dark:hidden"
            priority
          />
        </div>
        <h1 className="mt-4 text-2xl font-bold tracking-tight text-foreground">
          Free Online Tools - No Signup Required
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          100+ free browser-based tools for developers, creators, and everyone.
          No signup, no data collection. Everything runs locally in your
          browser.
        </p>
      </section>

      <ToolsGrid tools={tools} showSearch showCategoryFilter />
    </div>
  )
}
