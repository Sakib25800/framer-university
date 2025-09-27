"use client"

import { cva } from "class-variance-authority"
import * as React from "react"
import { cn } from "@/lib/utils"

const input = cva([
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
])

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "className"> {
  className?: string
}

export function Input({ className, ...props }: InputProps) {
  return <input className={cn(input({ className }))} {...props} />
}

export default Input
