import { cva, type VariantProps } from "class-variance-authority"
import { HTMLMotionProps, motion, Transition, Variants } from "motion/react"
import IconChevron from "@/components/icons/chevron.svg"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  [
    "inline-flex",
    "items-center",
    "justify-center",
    "text-center",
    "rounded-full",
    "cursor-pointer",
    "font-semibold",
    "filter",
    "brightness-[1]",
  ],
  {
    variants: {
      variant: {
        outline: ["border", "border-primary-400", "!text-white"],
        primary: ["bg-white", "text-black"],
        link: ["!text-primary-950", "group"],
      },
      size: {
        sm: ["text-base", "px-4", "py-[7px]"],
        md: ["text-body", "px-5", "py-2.5"],
        lg: ["text-body-l", "px-[26px]", "py-[15px]"],
      },
    },
    defaultVariants: { variant: "primary", size: "lg" },
  }
)

const spring: Transition = {
  type: "spring",
  duration: 0.3,
  bounce: 0.2,
  delay: 0,
}

const parentVariants: Record<string, Variants> = {
  outline: {
    hover: { borderColor: "rgb(255,255,255)" },
    tap: { scale: 0.95 },
  },
  primary: {
    hover: { filter: "brightness(0.8)" },
    tap: { scale: 0.95 },
  },
  link: { hover: {}, tap: {} },
}

export type ButtonProps = Omit<HTMLMotionProps<"button">, "children"> &
  VariantProps<typeof buttonVariants> & {
    children?: React.ReactNode
  }

export function Button({ className, variant: intent, size, children, ...props }: ButtonProps) {
  return (
    <motion.button
      className={cn(buttonVariants({ variant: intent, size, className }))}
      variants={parentVariants[intent ?? "primary"]}
      whileHover="hover"
      whileTap="tap"
      transition={spring}
      {...props}
    >
      {intent === "link" ? (
        <motion.span
          className="brightness-[1] filter"
          variants={{ hover: { filter: "brightness(1.25)" } }}
          transition={spring}
        >
          {children}
        </motion.span>
      ) : (
        children
      )}
      {intent === "link" && (
        <motion.span
          className="ml-[9px] flex items-center justify-center"
          variants={{ hover: { x: 1 }, tap: { x: 3 } }}
          transition={spring}
        >
          <IconChevron
            className={cn("origin-center rotate-90", {
              "scale-80": size === "sm",
              "scale-90": size === "md",
              "scale-100": size === "lg",
            })}
          />
        </motion.span>
      )}
    </motion.button>
  )
}
