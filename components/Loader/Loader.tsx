"use client"

import React from "react"
import { cn } from "@/lib/utils"

export interface LoaderProps {
  size?: number
  className?: string
}

export function Loader({ size = 56, className }: LoaderProps) {
  return (
    <div
      className={cn(
        "fu-loader inline-block",
        "[mask-image:url(/universal-loader-mask.png)]",
        "[mask-size:contain] [mask-position:center] [mask-repeat:no-repeat]",
        "animate-fu-loader-bob",
        className
      )}
      style={{ width: size, height: size }}
      role="status"
      aria-live="polite"
      aria-label="Loading"
    >
      <video
        src="/universal-loader-video.mp4"
        className="block h-full w-full object-cover"
        playsInline
        loop
        muted
        autoPlay
      />
    </div>
  )
}

export default Loader
