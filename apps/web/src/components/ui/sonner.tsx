"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  CheckmarkCircle02Icon,
  InformationCircleIcon,
  Alert02Icon,
  MultiplicationSignCircleIcon,
  Loading03Icon,
} from "@hugeicons/core-free-icons"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: (
          <HugeiconsIcon icon={CheckmarkCircle02Icon} strokeWidth={2} className="size-4 text-emerald-500 dark:text-emerald-400" />
        ),
        info: (
          <HugeiconsIcon icon={InformationCircleIcon} strokeWidth={2} className="size-4 text-blue-500 dark:text-blue-400" />
        ),
        warning: (
          <HugeiconsIcon icon={Alert02Icon} strokeWidth={2} className="size-4 text-amber-500 dark:text-amber-400" />
        ),
        error: (
          <HugeiconsIcon icon={MultiplicationSignCircleIcon} strokeWidth={2} className="size-4 text-destructive" />
        ),
        loading: (
          <HugeiconsIcon icon={Loading03Icon} strokeWidth={2} className="size-4 animate-spin text-muted-foreground" />
        ),
      }}
      toastOptions={{
        classNames: {
          toast:
            "!bg-card !text-card-foreground !border !border-border !shadow-sm !rounded-[var(--radius)] font-sans",
          title: "!text-sm !font-medium",
          description: "!text-xs !text-muted-foreground",
          actionButton: "!bg-primary !text-primary-foreground !rounded-[var(--radius)]",
          cancelButton: "!bg-secondary !text-secondary-foreground !rounded-[var(--radius)]",
          closeButton: "!bg-card !border-border hover:!bg-muted !text-muted-foreground",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
