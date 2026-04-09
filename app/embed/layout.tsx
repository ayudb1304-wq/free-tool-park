import "@/app/globals.css"
import { ThemeProvider } from "@/components/theme-provider"

export const metadata = {
  robots: "noindex, nofollow",
}

export default function EmbedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <div className="p-4">{children}</div>

          <footer className="border-t px-4 py-2 text-center text-xs text-muted-foreground">
            Powered by{" "}
            <a
              href="https://www.freetoolpark.com?ref=embed"
              target="_blank"
              rel="noopener"
              className="font-medium text-primary hover:underline"
            >
              FreeToolPark
            </a>
            {" "}&mdash; Free Privacy-First Tools
          </footer>
        </ThemeProvider>
      </body>
    </html>
  )
}
