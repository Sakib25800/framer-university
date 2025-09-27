"use client"

import { cva } from "class-variance-authority"
import * as React from "react"
import { cn } from "@/lib/utils"

const input = cva(
  [
    "bg-primary-400",
    "text-white",
    "text-base",
    "font-medium",
    "rounded-[10px]",
    "p-3",
    "outline-none",
    "placeholder:text-primary-900",
    "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05),0_2px_4px_0_rgba(0,0,0,0.1)]",
    "focus:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05),0_2px_4px_0_rgba(0,0,0,0.1),0_0_0_2px_#161717,0_0_0_3px_#00bbff]",
  ],
  {
    variants: {
      variant: {
        default: [],
        error: [
          "shadow-[0_0_0_1px_#161717]",
          "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05),0_2px_4px_0_rgba(0,0,0,0.1),0_0_0_2px_#161717,0_0_0_3px_#ff4545]",
        ],
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface InputProps extends React.ComponentProps<"input"> {
  variant?: "default" | "error"
  errorText?: string
}

export function Input({ className, variant = "default", errorText, ...props }: InputProps) {
  return (
    <div className="flex flex-col">
      <input className={cn(input({ variant, className }))} {...props} />
      {errorText && <p className="text-small text-error mt-1.5 font-medium">{errorText}</p>}
    </div>
  )
}

export default Input
