import { cva, type VariantProps } from "class-variance-authority"
import NextLink from "next/link"
import { cn } from "@/lib/utils"

const linkVariants = cva(["inline-flex", "items-center", "cursor-pointer", "text-decoration-none"], {
  variants: {
    variant: {
      primary: [
        "text-primary-900",
        "hover:underline",
        "hover:decoration-primary-900",
        "hover:decoration-1",
        "hover:underline-offset-2"
      ],
      secondary: ["text-primary-950", "hover:text-white"]
    }
  },
  defaultVariants: { variant: "primary" }
})

export type LinkProps = React.ComponentProps<typeof NextLink> &
  VariantProps<typeof linkVariants> & {
    children?: React.ReactNode
    className?: string
  }

export function Link({ className, variant, children, ...props }: LinkProps) {
  return (
    <NextLink className={cn(linkVariants({ variant, className }))} {...props}>
      {children}
    </NextLink>
  )
}
