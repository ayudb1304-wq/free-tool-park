"use client"

import Link from "next/link"
import Image from "next/image"
import { useTheme } from "next-themes"
import { HugeiconsIcon } from "@hugeicons/react"
import { Sun01Icon, MoonIcon, Menu01Icon } from "@hugeicons/core-free-icons"
import { CATEGORIES } from "@/data/categories"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { useState } from "react"

export function Header() {
  const { resolvedTheme, setTheme } = useTheme()
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-lg">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center">
            <Image
              src="/images/FreeToolpark-namelogo.png"
              alt="FreeToolPark"
              width={120}
              height={40}
              className="hidden h-10 w-auto dark:block"
            />
            <Image
              src="/images/FreeToolpark-balcktext-lighttheme.png"
              alt="FreeToolPark"
              width={120}
              height={40}
              className="block h-10 w-auto dark:hidden"
            />
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/">Home</Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/tools">Tools</Link>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  Categories
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {CATEGORIES.map((cat) => (
                  <DropdownMenuItem key={cat.slug} asChild>
                    <Link href={`/categories/${cat.slug}`}>
                      <HugeiconsIcon icon={cat.icon} size={16} />
                      {cat.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  For You
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem asChild>
                  <Link href="/for/developers">For Developers</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/for/writers">For Writers</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/for/students">For Students</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/for/designers">For Designers</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/for/finance">For Finance</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/embed">Embed</Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/request-a-tool">Request a Tool</Link>
            </Button>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() =>
              setTheme(resolvedTheme === "dark" ? "light" : "dark")
            }
            aria-label="Toggle theme"
          >
            <HugeiconsIcon
              icon={resolvedTheme === "dark" ? Sun01Icon : MoonIcon}
              size={18}
            />
          </Button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                className="md:hidden"
                aria-label="Open menu"
              >
                <HugeiconsIcon icon={Menu01Icon} size={18} />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1 overflow-y-auto p-4">
                <Button
                  variant="ghost"
                  className="justify-start"
                  asChild
                  onClick={() => setOpen(false)}
                >
                  <Link href="/">Home</Link>
                </Button>
                <Button
                  variant="ghost"
                  className="justify-start"
                  asChild
                  onClick={() => setOpen(false)}
                >
                  <Link href="/tools">All Tools</Link>
                </Button>
                <div className="mt-4 mb-2 px-3 text-xs font-medium text-muted-foreground">
                  Categories
                </div>
                {CATEGORIES.map((cat) => (
                  <Button
                    key={cat.slug}
                    variant="ghost"
                    className="justify-start gap-2"
                    asChild
                    onClick={() => setOpen(false)}
                  >
                    <Link href={`/categories/${cat.slug}`}>
                      <HugeiconsIcon icon={cat.icon} size={16} />
                      {cat.name}
                    </Link>
                  </Button>
                ))}
                <div className="mt-4 mb-2 px-3 text-xs font-medium text-muted-foreground">
                  For You
                </div>
                {[
                  { href: "/for/developers", label: "For Developers" },
                  { href: "/for/writers", label: "For Writers" },
                  { href: "/for/students", label: "For Students" },
                  { href: "/for/designers", label: "For Designers" },
                  { href: "/for/finance", label: "For Finance" },
                ].map((item) => (
                  <Button
                    key={item.href}
                    variant="ghost"
                    className="justify-start"
                    asChild
                    onClick={() => setOpen(false)}
                  >
                    <Link href={item.href}>{item.label}</Link>
                  </Button>
                ))}
                <div className="mt-4 mb-2 px-3 text-xs font-medium text-muted-foreground">
                  More
                </div>
                <Button
                  variant="ghost"
                  className="justify-start"
                  asChild
                  onClick={() => setOpen(false)}
                >
                  <Link href="/embed">Embed Widgets</Link>
                </Button>
                <Button
                  variant="ghost"
                  className="justify-start"
                  asChild
                  onClick={() => setOpen(false)}
                >
                  <Link href="/request-a-tool">Request a Tool</Link>
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
