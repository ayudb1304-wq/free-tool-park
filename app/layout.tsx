import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { JsonLd } from "@/components/seo/json-ld"
import { websiteSchema, SITE_NAME } from "@/lib/schema"
import { cn } from "@/lib/utils"

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: {
    template: `%s | ${SITE_NAME}`,
    default: `${SITE_NAME} - Free Online Tools`,
  },
  description:
    "100+ free online tools for text, development, calculations, conversions, and more. No signup required. All tools run in your browser.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.freetoolpark.com"
  ),
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    images: [
      {
        url: "/images/og-default.png",
        width: 1200,
        height: 630,
        alt: "FreeToolPark - 100+ Free Browser-Based Tools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/images/og-default.png"],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        geist.variable
      )}
    >
      <body>
        <ThemeProvider>
          <JsonLd data={websiteSchema()} />
          <Header />
          <main className="min-h-[calc(100svh-3.5rem)]">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}
