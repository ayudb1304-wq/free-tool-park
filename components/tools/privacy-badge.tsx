import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import { SecurityCheckIcon } from "@hugeicons/core-free-icons"

interface PrivacyBadgeProps {
  toolName?: string
  variant?: "default" | "compact" | "detailed"
}

export function PrivacyBadge({
  toolName,
  variant = "default",
}: PrivacyBadgeProps) {
  if (variant === "compact") {
    return (
      <div className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-3 py-1.5 text-sm dark:border-green-800 dark:bg-green-950">
        <HugeiconsIcon
          icon={SecurityCheckIcon}
          className="text-green-600 dark:text-green-400"
          size={16}
        />
        <span className="font-medium text-green-700 dark:text-green-300">
          100% Private
        </span>
      </div>
    )
  }

  if (variant === "detailed") {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-950">
        <div className="flex items-start gap-3">
          <HugeiconsIcon
            icon={SecurityCheckIcon}
            className="mt-0.5 shrink-0 text-green-600 dark:text-green-400"
            size={24}
          />
          <div>
            <h3 className="font-semibold text-green-800 dark:text-green-200">
              Your Privacy is Protected
            </h3>
            <p className="mt-1 text-sm text-green-700 dark:text-green-300">
              This {toolName || "tool"} runs entirely in your browser using
              JavaScript. Your data is never sent to our servers, stored in any
              database, or shared with third parties. We can&apos;t see what you
              enter because it never leaves your device.
            </p>
            <Link
              href="/privacy"
              className="mt-2 inline-flex items-center text-sm font-medium text-green-600 hover:underline dark:text-green-400"
            >
              Learn how we protect your data &rarr;
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 p-3 dark:border-green-800 dark:bg-green-950">
      <HugeiconsIcon
        icon={SecurityCheckIcon}
        className="shrink-0 text-green-600 dark:text-green-400"
        size={20}
      />
      <div className="text-sm">
        <span className="font-medium text-green-800 dark:text-green-200">
          100% Private
        </span>
        <span className="text-green-700 dark:text-green-300">
          {" "}
          &mdash; This tool runs entirely in your browser. Your data never
          touches our servers.{" "}
        </span>
        <Link
          href="/privacy"
          className="font-medium text-green-600 hover:underline dark:text-green-400"
        >
          How we protect you &rarr;
        </Link>
      </div>
    </div>
  )
}
