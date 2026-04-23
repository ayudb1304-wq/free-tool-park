import Link from "next/link"

interface AuthorBylineProps {
  lastUpdatedIso: string
  lastUpdatedDisplay: string
  authorName?: string
  authorHref?: string
  className?: string
}

export function AuthorByline({
  lastUpdatedIso,
  lastUpdatedDisplay,
  authorName = "FreeToolPark Team",
  authorHref = "/about",
  className = "",
}: AuthorBylineProps) {
  return (
    <p
      className={`text-sm text-muted-foreground ${className}`.trim()}
      itemScope
      itemType="https://schema.org/Person"
    >
      <span>By </span>
      <Link
        href={authorHref}
        className="font-medium text-foreground hover:underline"
        itemProp="url"
      >
        <span itemProp="name">{authorName}</span>
      </Link>
      <span aria-hidden="true"> · </span>
      <span>
        Updated{" "}
        <time dateTime={lastUpdatedIso}>{lastUpdatedDisplay}</time>
      </span>
    </p>
  )
}
