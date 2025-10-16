"use client"

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
    "brightness-[1]"
  ],
  {
    variants: {
      variant: {
        outline: ["border", "border-primary-400", "text-white"],
        primary: ["bg-white", "text-black"],
        link: ["!text-primary-950", "group", "!px-0", "!py-0"]
      },
      size: {
        sm: ["text-base", "px-4", "py-[7px]"],
        md: ["text-body", "px-5", "py-2.5"],
        lg: ["text-body-l", "px-[26px]", "py-[15px]"]
      }
    },
    defaultVariants: { variant: "primary", size: "lg" }
  }
)

const spring: Transition = {
  type: "spring",
  duration: 0.3,
  bounce: 0.2,
  delay: 0
}

const parentVariants: Record<string, Variants> = {
  outline: {
    hover: { borderColor: "rgb(255,255,255)" },
    tap: { scale: 0.95 }
  },
  primary: {
    hover: { filter: "brightness(0.8)" },
    tap: { scale: 0.95 }
  },
  link: { hover: {}, tap: {} }
}

export type BaseProps = VariantProps<typeof buttonVariants> & {
  children?: React.ReactNode
  direction?: "left" | "right"
  href?: string
}

type ButtonAsButton = BaseProps & Omit<HTMLMotionProps<"button">, "children" | "ref"> & { href?: undefined }

type ButtonAsLink = BaseProps & Omit<HTMLMotionProps<"a">, "children" | "ref"> & { href: string }

export type ButtonProps = ButtonAsButton | ButtonAsLink

export function Button({ className, variant, size, href, direction = "right", children, ...props }: ButtonProps) {
  const sharedProps = {
    className: cn(buttonVariants({ variant, size, className })),
    variants: parentVariants[variant ?? "primary"],
    whileHover: "hover" as const,
    whileTap: "tap" as const,
    transition: spring
  }

  const renderContent = () => {
    if (variant !== "link") return children

    return (
      <>
        {direction === "left" && (
          <motion.span
            className="mr-[9px] flex items-center justify-center"
            variants={{ hover: { x: -1 }, tap: { x: -3 } }}
            transition={spring}
          >
            <IconChevron
              className={cn("origin-center -rotate-90", {
                "scale-80": size === "sm",
                "scale-90": size === "md",
                "scale-100": size === "lg"
              })}
            />
          </motion.span>
        )}
        <motion.span
          className="brightness-[1] filter"
          variants={{ hover: { filter: "brightness(1.25)" } }}
          transition={spring}
        >
          {children}
        </motion.span>
        {direction === "right" && (
          <motion.span
            className="ml-[9px] flex items-center justify-center"
            variants={{ hover: { x: 1 }, tap: { x: 3 } }}
            transition={spring}
          >
            <IconChevron
              className={cn("origin-center rotate-90", {
                "scale-80": size === "sm",
                "scale-90": size === "md",
                "scale-100": size === "lg"
              })}
            />
          </motion.span>
        )}
      </>
    )
  }

  if (href) {
    return (
      <motion.a href={href} {...sharedProps} {...(props as Omit<HTMLMotionProps<"a">, "children">)}>
        {renderContent()}
      </motion.a>
    )
  }

  return (
    <motion.button {...sharedProps} {...(props as Omit<HTMLMotionProps<"button">, "children">)}>
      {renderContent()}
    </motion.button>
  )
}
