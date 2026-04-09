import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"

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
    template: `%s | ${SITE_NAME} -Free Privacy-First Tools`,
    default: `Free Online Tools -No Tracking, No Limits | ${SITE_NAME}`,
  },
  description:
    "100+ free browser-based tools that respect your privacy. No data collection, no sign-ups, no limits. Calculators, converters, dev tools & more.",
  keywords: [
    "free online tools",
    "privacy-focused tools",
    "no tracking tools",
    "browser-based calculator",
    "free converter",
    "developer tools online",
  ],
  authors: [{ name: `${SITE_NAME} Team` }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.freetoolpark.com"
  ),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: SITE_NAME,
    title: "Free Online Tools -No Tracking, No Limits",
    description:
      "100+ free browser-based tools. Your data never leaves your browser. No sign-ups required.",
    images: [
      {
        url: "/images/og-default.png",
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} -Free Privacy-First Online Tools`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Online Tools -No Tracking, No Limits",
    description: "100+ free browser-based tools that respect your privacy.",
    images: ["/images/og-default.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large" as const,
      "max-snippet": -1,
    },
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
        <Analytics />
      </body>
    </html>
  )
}
