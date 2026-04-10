import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const CANONICAL_HOST = "www.freetoolpark.com"

export function middleware(request: NextRequest) {
  const host = request.headers.get("host") ?? ""

  // Redirect Vercel-generated *.vercel.app hostnames (including the production
  // alias like free-tool-park.vercel.app and any preview URLs) to the canonical
  // www domain. This prevents Google from discovering and indexing duplicate
  // content under the .vercel.app domain.
  if (host.endsWith(".vercel.app")) {
    const url = request.nextUrl.clone()
    url.host = CANONICAL_HOST
    url.protocol = "https:"
    url.port = ""
    return NextResponse.redirect(url, 308)
  }

  return NextResponse.next()
}

export const config = {
  // Run on all paths except Next.js internals and static assets.
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
}
