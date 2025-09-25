"use client"

import * as React from "react"
import { twMerge } from "tailwind-merge"
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
  className,
}: TextShimmerProps) {
  const Tag = tag as any

  const speedFormatted = 11 - speed
  const gradFirst = 50 - (size * (50 - 20)) / 100
  const gradLast = 50 + (size * (80 - 50)) / 100
  const durationSec = `${speedFormatted + delay}s`
  const startPos = direction === "left" ? "-100%" : "200%"
  const endPos = direction === "left" ? "200%" : "-100%"

  return (
    <div className={twMerge("relative select-none", userSelect && "select-auto", className)}>
      <Tag className={twMerge("m-0", !style?.fontSize && "") as string} style={{ color, ...style }}>
        {content}
      </Tag>
      <Tag
        aria-hidden="true"
        className={twMerge(styles.layer)}
        style={{
          ["--ts-rotation" as any]: `${rotation}deg`,
          ["--ts-grad-first" as any]: `${gradFirst}%`,
          ["--ts-grad-last" as any]: `${gradLast}%`,
          ["--ts-shimmer" as any]: shimmer,
          ["--ts-duration" as any]: durationSec,
          ["--ts-delay" as any]: `${delay}s`,
          ["--ts-start" as any]: startPos,
          ["--ts-end" as any]: endPos,
          ...style,
        }}
      >
        {content}
      </Tag>
    </div>
  )
}

export default TextShimmer


