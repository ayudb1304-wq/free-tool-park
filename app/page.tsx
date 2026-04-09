import Image from "next/image"
import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  SecurityCheckIcon,
  LockKeyIcon,
  FlashIcon,
  InfinityCircleIcon,
} from "@hugeicons/core-free-icons"
import { getAllTools } from "@/lib/tools"
import { ToolsGrid } from "@/components/tools-grid"
import { RecentlyAdded } from "@/components/home/recently-added"
import { BrowseByCategory } from "@/components/home/browse-by-category"
import { JsonLd } from "@/components/seo/json-ld"
import { SITE_URL, SITE_NAME } from "@/lib/schema"

export default function HomePage() {
  const tools = getAllTools()
  const recentTools = tools.slice(-6).reverse()

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/images/FreeToolpark-onlylogo.png`,
    description:
      "100+ free, privacy-first online tools. Calculators, converters, developer tools, and more. No tracking, no sign-ups.",
    sameAs: [] as string[],
  }

  return (
    <>
      <JsonLd data={organizationSchema} />
      <div className="mx-auto max-w-7xl px-4 py-12">
      <section className="mb-12 text-center">
        <div aria-hidden="true">
          <Image
            src="/images/FreeToolpark-namelogo.png"
            alt=""
            width={400}
            height={400}
            className="mx-auto hidden h-auto w-[280px] sm:w-[400px] dark:block"
            priority
          />
          <Image
            src="/images/FreeToolpark-balcktext-lighttheme.png"
            alt=""
            width={400}
            height={400}
            className="mx-auto block h-auto w-[280px] sm:w-[400px] dark:hidden"
            priority
          />
        </div>
        <h1 className="mt-6 text-3xl font-bold tracking-tight text-foreground md:text-5xl">
          Free Online Tools That{" "}
          <span className="text-primary">Respect Your Privacy</span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          100+ browser-based calculators, converters, and developer tools. No
          tracking. No sign-ups. No limits. Your data never leaves your device.
        </p>

        {/* Trust Badges */}
        <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <HugeiconsIcon
              icon={SecurityCheckIcon}
              className="text-green-500"
              size={20}
            />
            <span>100% Client-Side</span>
          </div>
          <div className="flex items-center gap-2">
            <HugeiconsIcon
              icon={LockKeyIcon}
              className="text-green-500"
              size={20}
            />
            <span>No Data Collection</span>
          </div>
          <div className="flex items-center gap-2">
            <HugeiconsIcon
              icon={FlashIcon}
              className="text-green-500"
              size={20}
            />
            <span>Instant Results</span>
          </div>
          <div className="flex items-center gap-2">
            <HugeiconsIcon
              icon={InfinityCircleIcon}
              className="text-green-500"
              size={20}
            />
            <span>Unlimited Use</span>
          </div>
        </div>

        {/* CTAs */}
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            href="/tools"
            className="rounded-lg bg-primary px-8 py-3 font-medium text-primary-foreground transition hover:bg-primary/90"
          >
            Browse All Tools
          </Link>
          <Link
            href="/privacy"
            className="rounded-lg border border-border px-8 py-3 font-medium transition hover:bg-muted"
          >
            How We Protect You
          </Link>
        </div>
      </section>

      {/* Browse by Category — links to all category hub pages for crawl depth */}
      <BrowseByCategory />

      {/* Recently Added — gives new tools instant internal links from homepage */}
      <RecentlyAdded tools={recentTools} />

      <section className="mt-12">
        <h2 className="mb-6 text-2xl font-semibold">All Tools</h2>
        <ToolsGrid tools={tools} showSearch showCategoryFilter />
      </section>
    </div>
    </>
  )
}
