import { cva, type VariantProps } from "class-variance-authority"
import clsx from "clsx"
import { motion, Transition } from "motion/react"
import { twMerge } from "tailwind-merge"
import IconChevron from "@/components/icons/chevron.svg"

const button = cva(
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
      intent: {
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
    defaultVariants: { intent: "primary", size: "lg" },
  }
)

const springTransition: Transition = {
  type: "spring",
  duration: 0.3,
  bounce: 0.2,
  delay: 0,
}

const parentVariants = {
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

const chevronVariants = { hover: { x: 1 }, tap: { x: 3 } }

export interface ButtonProps
  extends VariantProps<typeof button>,
    Omit<
      React.ButtonHTMLAttributes<HTMLButtonElement>,
      | "onDrag"
      | "onDragEnd"
      | "onDragStart"
      | "onAnimationStart"
      | "onAnimationEnd"
      | "onAnimationIteration"
      | "onTransitionEnd"
    > {}

export function Button({ className, intent, size, children, ...props }: ButtonProps) {
  return (
    <motion.button
      className={twMerge(button({ intent, size, className }))}
      variants={parentVariants[intent ?? "primary"]}
      whileHover="hover"
      whileTap="tap"
      transition={springTransition}
      {...props}
    >
      {intent === "link" ? (
        <motion.span
          className="brightness-[1] filter"
          variants={{ hover: { filter: "brightness(1.25)" } }}
          transition={springTransition}
        >
          {children}
        </motion.span>
      ) : (
        children
      )}
      {intent === "link" && (
        <motion.span
          className="ml-[9px] flex items-center justify-center"
          variants={chevronVariants}
          transition={springTransition}
        >
          <IconChevron
            className={twMerge(
              "origin-center rotate-90",
              clsx({
                "scale-80": size === "sm",
                "scale-90": size === "md",
                "scale-100": size === "lg",
              })
            )}
          />
        </motion.span>
      )}
    </motion.button>
  )
}
