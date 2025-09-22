import { cva, type VariantProps } from "class-variance-authority"
import { HTMLMotionProps, motion } from "framer-motion"
import { twMerge } from "tailwind-merge"
import IconChevron from "@/components/icons/chevron.svg"

const button = cva(
  ["inline-flex", "items-center", "justify-center", "text-center", "rounded-full", "cursor-pointer", "font-semibold"],
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
    defaultVariants: {
      intent: "primary",
      size: "lg",
    },
  }
)

export interface ButtonProps extends VariantProps<typeof button> {
  className?: string
  children?: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  type?: "button" | "submit" | "reset"
}

export function Button({ className, intent, size, children, ...props }: ButtonProps) {
  const motionProps: Record<string, HTMLMotionProps<"button">> = {
    outline: {
      whileHover: {
        borderColor: "white",
      },
      whileTap: {
        scale: 0.95,
      },
    },
    primary: {
      whileHover: {
        filter: "brightness(0.8)",
      },
      whileTap: {
        scale: 0.95,
      },
    },
    link: {},
  }

  return (
    <motion.button
      className={twMerge(button({ intent, size, className }))}
      {...motionProps[intent ?? "outline"]}
      transition={{
        duration: 0.3,
        type: "spring",
        bounce: 0.2,
        delay: 0,
      }}
      {...props}
    >
      {intent !== "link" && children}

      {intent === "link" && (
        <>
          <span className="group-hover:brightness-125">{children}</span>
          <div className="ml-[9px] flex items-center justify-center">
            <div className="transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:translate-x-[1px] group-active:translate-x-[3px]">
              <IconChevron
                className="rotate-90"
                style={{
                  transform: `scale(${size === "sm" ? 0.8 : size === "md" ? 0.9 : 1})`,
                  transformOrigin: "center",
                }}
              />
            </div>
          </div>
        </>
      )}
    </motion.button>
  )
}
