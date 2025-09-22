import { cva, type VariantProps } from "class-variance-authority"
import { motion } from "framer-motion"
import { twMerge } from "tailwind-merge"

const button = cva(["inline-flex", "items-center", "justify-center", "text-center", "rounded-full", "cursor-pointer"], {
  variants: {
    intent: {
      outline: ["border", "border-primary-400"],
      primary: ["bg-white", "!text-black"],
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
  return (
    <motion.button
      className={twMerge(button({ intent, size, className }))}
      whileHover={intent === "outline" ? { borderColor: "white" } : { filter: "brightness(0.8)" }}
      whileTap={intent === "outline" ? { scale: 0.95 } : { scale: 0.95 }}
      transition={{
        duration: 0.3,
        type: "spring",
        bounce: 0.2,
        delay: 0,
      }}
      {...props}
    >
      {children}
    </motion.button>
  )
}
