import Link from "next/link"
import Image from "next/image"
import { CATEGORIES } from "@/data/categories"

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-3">
          <div>
            <div className="mb-3">
              <Image
                src="/images/FreeToolpark-namelogo.png"
                alt="FreeToolPark"
                width={100}
                height={32}
                className="hidden h-9 w-auto dark:block"
              />
              <Image
                src="/images/FreeToolpark-balcktext-lighttheme.png"
                alt="FreeToolPark"
                width={100}
                height={32}
                className="block h-9 w-auto dark:hidden"
              />
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/" className="hover:text-foreground">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/tools" className="hover:text-foreground">
                  All Tools
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-3 text-sm font-semibold">Categories</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {CATEGORIES.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/categories/${cat.slug}`}
                    className="hover:text-foreground"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="mb-3 text-sm font-semibold">Legal</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/privacy" className="hover:text-foreground">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-foreground">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-6 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} FreeToolPark. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
