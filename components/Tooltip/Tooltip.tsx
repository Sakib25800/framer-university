"use client"

import * as RadixTooltip from "@radix-ui/react-tooltip"
import { AnimatePresence, motion } from "motion/react"
import { cva, type VariantProps } from "class-variance-authority"
import React, { useState } from "react"
import { twMerge } from "tailwind-merge"

const tooltipContent = cva([], {
  variants: {
    intent: {
      primary: [
        "rounded-xl",
        "bg-white",
        "font-sans",
        "text-black",
        "text-small",
        "font-medium",
        "px-2.5",
        "py-1.5",
        "w-fit",
        "whitespace-nowrap",
        "inline-flex",
        "items-center",
      ],
    },
  },
  defaultVariants: {
    intent: "primary",
  },
})

export interface TooltipProps extends VariantProps<typeof tooltipContent>, RadixTooltip.TooltipProps {
  explainer: React.ReactElement | string
  children: React.ReactElement
  className?: string
  side?: "top" | "right" | "bottom" | "left"
  shortcut?: string
}

export function Tooltip({
  children,
  explainer,
  open,
  defaultOpen,
  onOpenChange,
  intent,
  side = "top",
  className,
  shortcut,
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
                className={twMerge(tooltipContent({ intent, className }))}
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
                  {shortcut && (
                    <div className="ml-2 rounded-sm min-w-[21px] pt-[2px] pr-[4px] pb-[3px] pl-[4px] shadow-[inset_0_-2px_0_rgba(171,171,171,0.8),inset_0_-0.5px_0_rgba(13,13,13,0.4),inset_0_-1px_0_rgba(10,10,10,1),0_0_0_2px_rgba(171,171,171,0.3),inset_0_0.5px_0_rgba(171,171,171,0.4)]">
                      <p className="text-primary-600 font-semibold leading-[1.6em]">{shortcut}</p>
                    </div>
                  )}
                </motion.div>
              </RadixTooltip.Content>
            )}
          </AnimatePresence>
        </RadixTooltip.Portal>
      </RadixTooltip.Root>
    </RadixTooltip.Provider>
  )
}