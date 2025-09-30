import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

export interface QuoteProps extends React.ComponentProps<"div"> {}

const quote = cva(["flex", "gap-5"]) 
const quoteContent = cva([
  "text-primary-950",
  "body-l",
  "font-medium",
  "[&_strong]:text-white",
  "[&_strong]:font-medium",
]) 

export function Quote({ children, className, ...props }: QuoteProps) {
  return (
    <div className={cn(quote(), className)} {...props}>
      <div className="w-[2px] bg-accent flex-shrink-0" />
      <div className={quoteContent()}>{children}</div>
    </div>
  )
}

export default Quote
