"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import { Copy01Icon, Tick01Icon } from "@hugeicons/core-free-icons"
import { useCopy } from "@/hooks/use-copy"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface CopyButtonProps {
  value: string
  className?: string
  label?: string
}

export function CopyButton({ value, className, label }: CopyButtonProps) {
  const { copied, copy } = useCopy()

  if (label) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => copy(value)}
        className={cn(className)}
      >
        <HugeiconsIcon
          icon={copied ? Tick01Icon : Copy01Icon}
          size={14}
          data-icon="inline-start"
        />
        {copied ? "Copied!" : label}
      </Button>
    )
  }

  return (
    <Button
      variant="outline"
      size="icon-sm"
      onClick={() => copy(value)}
      className={cn(className)}
      aria-label={copied ? "Copied" : "Copy to clipboard"}
    >
      <HugeiconsIcon icon={copied ? Tick01Icon : Copy01Icon} size={16} />
    </Button>
  )
}
