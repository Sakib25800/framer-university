import { cva, type VariantProps } from "class-variance-authority"
import { HTMLMotionProps, motion, Transition, Variants } from "motion/react"
import { cn } from "@/lib/utils"

const iconButtonVariants = cva(
  ["flex items-center justify-center rounded-full w-9 h-9 text-primary-950 cursor-pointer"],
  {
    variants: {
      intent: {
        primary: [
          "shadow-[0px_5px_10px_0px_rgba(0,0,0,0.25)]",
          "shadow-[inset_0px_1px_0px_0px_rgba(255,255,255,0.05)]",
          "bg-[#252727]",
        ],
        secondary: [],
      },
    },
    defaultVariants: {
      intent: "primary",
    },
  }
)

const spring: Transition = {
  type: "spring",
  duration: 0.3,
  bounce: 0.2,
  delay: 0,
}

const iconButtonMotionVariants: Variants = {
  hover: {
    color: "rgb(255, 255, 255)",
  },
  tap: {
    scale: 0.95,
  },
}

export type ButtonProps = Omit<HTMLMotionProps<"button">, "children"> &
  VariantProps<typeof iconButtonVariants> & {
    children?: React.ReactNode
  }

export function IconButton({ className, intent, children, ...props }: ButtonProps) {
  return (
    <motion.button
      className={cn(iconButtonVariants({ intent, className }))}
      variants={iconButtonMotionVariants}
      whileHover="hover"
      whileTap="tap"
      transition={spring}
      {...props}
    >
      {children}
    </motion.button>
  )
}
