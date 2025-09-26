"use client";

import React from "react";
import { twMerge } from "tailwind-merge";

export interface ProgressBarProps {
  /** Current progress value from 0 to 100 */
  value?: number;
  /** Optional label for accessibility; falls back to percentage */
  ariaLabel?: string;
  /** Fill color theme (progress): white by default, or accent */
  color?: "white" | "accent";
  /** Additional class names to merge */
  className?: string;
}

export function ProgressBar({ value = 0, ariaLabel, color = "white", className }: ProgressBarProps) {
  const clampedValue = Math.max(0, Math.min(100, value));
  const fillColorClass = color === "accent" ? "bg-accent" : "bg-white";
  const trackColorClass = color === "accent" ? "bg-[#0080FF]/15" : "bg-primary-700";

  return (
    <div
      className={twMerge(
        "w-full rounded-full flex items-center",
        "bg-[#252727]",
        "h-9",
        "shadow-[inset_0_1px_0_rgba(255,255,255,0.05),_0_5px_10px_rgba(0,0,0,0.25)]",
        className,
      )}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={clampedValue}
      aria-label={ariaLabel ?? `${clampedValue}%`}
    >
      <div className="w-full px-[14px]">
        <div className={twMerge("h-1 w-full rounded-full overflow-hidden", trackColorClass)}>
          <div
            className={twMerge("h-full rounded-full", fillColorClass)}
            style={{ width: `${clampedValue}%` }}
          />
        </div>
      </div>
    </div>
  );
}

export default ProgressBar;


