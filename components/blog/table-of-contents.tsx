"use client"

import { useEffect, useState } from "react"

interface TableOfContentsProps {
  items: { id: string; label: string }[]
}

export function TableOfContents({ items }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>(items[0]?.id ?? "")

  useEffect(() => {
    if (items.length === 0) return

    const elements = items
      .map(({ id }) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)

    if (elements.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the topmost intersecting heading. If none intersect (user
        // scrolled past all of them), keep the last active one.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)

        if (visible[0]) {
          setActiveId(visible[0].target.id)
        }
      },
      {
        // Trigger when the heading is roughly in the top third of the viewport.
        rootMargin: "-80px 0px -70% 0px",
        threshold: 0,
      },
    )

    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [items])

  if (items.length === 0) return null

  return (
    <nav
      aria-label="On this page"
      className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto text-sm"
    >
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        On this page
      </p>
      <ul className="space-y-1 border-l">
        {items.map((item) => {
          const isActive = item.id === activeId
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className={[
                  "-ml-px block border-l-2 py-1 pl-3 transition-colors",
                  isActive
                    ? "border-primary font-medium text-primary"
                    : "border-transparent text-muted-foreground hover:border-border hover:text-foreground",
                ].join(" ")}
              >
                {item.label}
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
