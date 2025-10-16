"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import styles from "./TextShimmer.module.css"

export type TextShimmerDirection = "left" | "right"

export interface TextShimmerProps {
  content?: string
  color?: string
  shimmer?: string
  size?: number
  speed?: number
  userSelect?: boolean
  rotation?: number
  delay?: number
  tag?: keyof React.JSX.IntrinsicElements
  direction?: TextShimmerDirection
  style?: React.CSSProperties
  className?: string
}

export function TextShimmer({
  content = "",
  color = "#FFFFFF1A",
  shimmer = "#ffffff",
  size = 30,
  speed = 5,
  userSelect = false,
  rotation = 90,
  delay = 0,
  tag = "p",
  direction = "right",
  style,
  className
}: TextShimmerProps) {
  const Tag = tag as keyof React.JSX.IntrinsicElements

  const speedFormatted = 11 - speed
  const gradFirst = 50 - (size * (50 - 20)) / 100
  const gradLast = 50 + (size * (80 - 50)) / 100
  const durationSec = `${speedFormatted + delay}s`
  const startPos = direction === "left" ? "-100%" : "200%"
  const endPos = direction === "left" ? "200%" : "-100%"

  return (
    <div className={cn("relative select-none", userSelect && "select-auto", className)}>
      <Tag className={cn("m-0", !style?.fontSize && "") as string} style={{ color, ...style }}>
        {content}
      </Tag>
      <Tag
        aria-hidden="true"
        className={cn(styles.layer)}
        style={
          {
            ["--ts-rotation" as string]: `${rotation}deg`,
            ["--ts-grad-first" as string]: `${gradFirst}%`,
            ["--ts-grad-last" as string]: `${gradLast}%`,
            ["--ts-shimmer" as string]: shimmer,
            ["--ts-duration" as string]: durationSec,
            ["--ts-delay" as string]: `${delay}s`,
            ["--ts-start" as string]: startPos,
            ["--ts-end" as string]: endPos,
            ...style
          } as React.CSSProperties
        }
      >
        {content}
      </Tag>
    </div>
  )
}

export default TextShimmer
