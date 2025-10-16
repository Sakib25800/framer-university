"use client"

import * as React from "react"
import IconResizer from "@/components/icons/resizer.svg"
import { cn } from "@/lib/utils"

const textAreaVariants = cn([
  "w-full",
  "!bg-primary-400",
  "resize-y",
  "outline-none",
  "border-2",
  "border-transparent",
  "bg-transparent",
  "text-white",
  "text-base",
  "font-normal",
  "rounded-[10px]",
  "p-3",
  "placeholder:text-primary-900",
  "shadow-[0_1px_0_0_rgba(255,255,255,0.05),0_2px_4px_0_rgba(0,0,0,0.1)]",
  "focus:border-primary-200",
  "focus:ring-1",
  "focus:ring-accent",
  "focus:ring-offset-0"
])

export function TextArea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <div className="relative inline-block">
      <textarea className={cn(textAreaVariants, className)} {...props} />
      <IconResizer className="text-primary-900 pointer-events-none absolute right-1 bottom-3 h-3 w-3" />
    </div>
  )
}

export default TextArea
