"use client"

import React from "react"
import { cn } from "@/lib/utils"

export interface ProgressBarProps {
  value?: number
  ariaLabel?: string
  intent?: "default" | "info"
  title?: string
  dayLabel?: string
  showPercentage?: boolean
  className?: string
}

export function ProgressBar({
  value = 0,
  ariaLabel,
  intent = "default",
  title,
  dayLabel,
  showPercentage = false,
  className,
}: ProgressBarProps) {
  const clampedValue = Math.max(0, Math.min(100, value))
  const fillColorClass = "bg-white"
  const trackColorClass = "bg-primary-700"
  const percentageScaleClass = clampedValue >= 100 ? "scale-[0.92]" : ""

  return (
    <div
      className={cn(
        "flex w-full items-center overflow-hidden rounded-full",
        "bg-[#252727]",
        "h-9",
        "pr-[12px] pl-[14px]",
        "shadow-[inset_0_1px_0_rgba(255,255,255,0.05),_0_5px_10px_rgba(0,0,0,0.25)]",
        className
      )}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={clampedValue}
      aria-label={ariaLabel ?? `${clampedValue}%`}
    >
      {intent === "default" && (
        <>
          <div className={cn("min-w-0 flex-1", showPercentage ? "mr-[10px]" : "")}>
            <div className={cn("h-1 w-full overflow-hidden rounded-full", trackColorClass)}>
              <div className={cn("h-full rounded-full", fillColorClass)} style={{ width: `${clampedValue}%` }} />
            </div>
          </div>
          {showPercentage && (
            <span
              className={cn(
                "text-primary-950 w-[26.5px] shrink-0 basis-[26.5px] origin-right text-right text-[14px] leading-[1em] font-medium whitespace-nowrap",
                percentageScaleClass
              )}
            >
              {clampedValue}%
            </span>
          )}
        </>
      )}

      {intent === "info" && (
        <>
          <div className="min-w-0 flex-1">
            <div className="text-primary-950 truncate text-base font-medium">{title}</div>
          </div>
          <div className="bg-primary-300 ml-[10px] inline-flex h-[28px] items-center rounded-full px-[12px] shadow-[inset_0_-1px_0_#313131,_inset_0_0_0_1px_#000]">
            <span className="text-small font-semibold whitespace-nowrap text-white">{dayLabel}</span>
          </div>
        </>
      )}
    </div>
  )
}

export default ProgressBar
