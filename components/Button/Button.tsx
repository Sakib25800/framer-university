import { cva, type VariantProps } from "class-variance-authority"
import { type HTMLMotionProps, motion } from "framer-motion"
import { twMerge } from "tailwind-merge"

const button = cva(["inline-flex", "items-center", "justify-center", "text-center", "rounded-full", "cursor-pointer"], {
  variants: {
    intent: {
      primary: ["bg-white", "!text-black"],
      outline: ["border", "border-primary-400"],
    },
    size: {
      sm: ["text-base", "font-semibold", "px-4", "py-[7px]"],
      md: ["text-body", "font-semibold", "px-5", "py-2.5"],
      lg: ["text-body-l", "font-semibold", "px-[26px]", "py-[15px]"],
    },
  },
  defaultVariants: {
    intent: "primary",
    size: "lg",
  },
})

export interface ButtonProps extends VariantProps<typeof button> {
  className?: string
  children?: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  type?: "button" | "submit" | "reset"
}

export function Button({ className, intent, size, children, ...props }: ButtonProps) {
  const motionProps: HTMLMotionProps<"button"> = {
    className: twMerge(button({ intent, size, className })),
    whileHover: intent === "outline" ? { borderColor: "white" } : {},
    whileTap: intent === "outline" ? { scale: 0.95 } : {},
    transition: {
      duration: 0.3,
      type: "spring",
      bounce: 0.2,
      delay: 0,
    },
    ...props,
  }

  return <motion.button {...motionProps}>{children}</motion.button>
}
