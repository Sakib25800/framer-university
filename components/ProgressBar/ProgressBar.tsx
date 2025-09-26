"use client";

import React from "react";
import { twMerge } from "tailwind-merge";

export interface ProgressBarProps {
  /** Current progress value from 0 to 100 */
  value?: number;
  /** Optional label for accessibility; falls back to percentage */
  ariaLabel?: string;
  /** Visual intent: default progress, or info header */
  intent?: "default" | "info";
  /** Info variant: title text shown on the left */
  title?: string;
  /** Info variant: day text for the pill on the right */
  dayLabel?: string;
  /** Show percentage label at right inside container */
  showPercentage?: boolean;
  /** Additional class names to merge */
  className?: string;
}

export function ProgressBar({ value = 0, ariaLabel, intent = "default", title, dayLabel, showPercentage = false, className }: ProgressBarProps) {
  const clampedValue = Math.max(0, Math.min(100, value));
  const fillColorClass = "bg-white";
  const trackColorClass = "bg-primary-700";
  const percentageScaleClass = clampedValue >= 100 ? "scale-[0.92]" : "";

  return (
    <div
      className={twMerge(
        "w-full rounded-full flex items-center overflow-hidden",
        "bg-[#252727]",
        "h-9",
        "pl-[14px] pr-[12px]",
        "shadow-[inset_0_1px_0_rgba(255,255,255,0.05),_0_5px_10px_rgba(0,0,0,0.25)]",
        className,
      )}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={clampedValue}
      aria-label={ariaLabel ?? `${clampedValue}%`}
    >
      {intent === "default" && (
        <>
          <div className={twMerge("flex-1 min-w-0", showPercentage ? "mr-[10px]" : "") }>
            <div className={twMerge("h-1 w-full rounded-full overflow-hidden", trackColorClass)}>
              <div
                className={twMerge("h-full rounded-full", fillColorClass)}
                style={{ width: `${clampedValue}%` }}
              />
            </div>
          </div>
          {showPercentage && (
            <span className={twMerge("text-primary-950 text-[14px] leading-[1em] font-medium w-[26.5px] basis-[26.5px] text-right shrink-0 whitespace-nowrap origin-right", percentageScaleClass)}>{clampedValue}%</span>
          )}
        </>
      )}

      {intent === "info" && (
        <>
          <div className="flex-1 min-w-0">
            <div className="truncate text-base font-medium text-primary-950">{title}</div>
          </div>
          <div className="ml-[10px] inline-flex h-[28px] items-center rounded-full bg-primary-300 px-[12px] shadow-[inset_0_-1px_0_#313131,_inset_0_0_0_1px_#000]">
            <span className="text-small font-semibold text-white whitespace-nowrap">{dayLabel}</span>
          </div>
        </>
      )}
    </div>
  );
}

export default ProgressBar;


