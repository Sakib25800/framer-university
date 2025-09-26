import { cva, type VariantProps } from "class-variance-authority"
import { motion } from "motion/react"
import { twMerge } from "tailwind-merge"

const iconButton = cva(
  ["flex items-center justify-center rounded-full w-9 h-9 text-primary-950 cursor-pointer hover:text-white"],
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

export interface ButtonProps
  extends VariantProps<typeof iconButton>,
    Omit<
      React.ButtonHTMLAttributes<HTMLButtonElement>,
      | "className"
      | "onDrag"
      | "onDragEnd"
      | "onDragStart"
      | "onAnimationStart"
      | "onAnimationEnd"
      | "onAnimationIteration"
      | "onTransitionEnd"
    > {
  className?: string
}

export function IconButton({ className, intent, children, ...props }: ButtonProps) {
  return (
    <motion.button className={twMerge(iconButton({ intent, className }))} whileTap={{ scale: 0.95 }} {...props}>
      {children}
    </motion.button>
  )
}
