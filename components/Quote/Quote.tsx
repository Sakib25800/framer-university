import { cva } from "class-variance-authority"
import * as React from "react"
import { cn } from "@/lib/utils"

const quote = cva(["flex", "gap-5"])
const quoteContent = cva([
  "text-primary-950",
  "body-l",
  "font-medium",
  "[&_strong]:text-white",
  "[&_strong]:font-medium",
])

export function Quote({ children, className, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={cn(quote(), className)} {...props}>
      <div className="bg-accent w-[2px] flex-shrink-0" />
      <div className={quoteContent()}>{children}</div>
    </div>
  )
}

export default Quote
