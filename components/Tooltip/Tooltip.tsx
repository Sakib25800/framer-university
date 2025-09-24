"use client"

import * as RadixTooltip from "@radix-ui/react-tooltip"
import { AnimatePresence, motion } from "motion/react"
import { cva, type VariantProps } from "class-variance-authority"
import React, { useState } from "react"
import { twMerge } from "tailwind-merge"

const tooltipContent = cva([], {
  variants: {
    intent: {
      primary: ["rounded-xl", "bg-white", "font-sans", "text-black", "text-small", "font-medium"],
    },
    size: {
      md: ["px-2.5", "py-1.5"],
    },
  },
  defaultVariants: {
    intent: "primary",
    size: "md",
  },
})

export interface TooltipProps extends VariantProps<typeof tooltipContent>, RadixTooltip.TooltipProps {
  explainer: React.ReactElement | string
  children: React.ReactElement
  className?: string
  side?: "top" | "right" | "bottom" | "left"
}

export function Tooltip({
  children,
  explainer,
  open,
  defaultOpen,
  onOpenChange,
  intent,
  size,
  side = "top",
  className,
}: TooltipProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen || false)
  
  const handleOpenChange = (newOpen: boolean) => {
    setIsOpen(newOpen)
    onOpenChange?.(newOpen)
  }

  return (
    <RadixTooltip.Provider>
      <RadixTooltip.Root 
        open={open ?? isOpen} 
        defaultOpen={defaultOpen} 
        onOpenChange={handleOpenChange} 
        delayDuration={0}
      >
        <RadixTooltip.Trigger asChild>{children}</RadixTooltip.Trigger>
        <RadixTooltip.Portal forceMount>
          <AnimatePresence>
            {(open ?? isOpen) && (
              <RadixTooltip.Content
                side={side}
                sideOffset={5}
                className={twMerge(tooltipContent({ intent, size, className }))}
                asChild
              >
                <motion.div
                  initial={{ scale: 0.9, y: -4, opacity: 0 }}
                  animate={{ scale: 1, y: 0, opacity: 1 }}
                  exit={{ scale: 0.9, y: -4, opacity: 0 }}
                  transition={{
                    type: "spring",
                    duration: 0.2,
                    bounce: 0,
                    delay: 0
                  }}
                >
                  {explainer}
                </motion.div>
              </RadixTooltip.Content>
            )}
          </AnimatePresence>
        </RadixTooltip.Portal>
      </RadixTooltip.Root>
    </RadixTooltip.Provider>
  )
}