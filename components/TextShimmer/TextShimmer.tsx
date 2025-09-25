"use client"

import * as React from "react"

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
  tag?: keyof JSX.IntrinsicElements
  direction?: TextShimmerDirection
  style?: React.CSSProperties
  className?: string
}

function getUniqueClassName() {
  return "text-shimmer-" + Math.random().toString(36).substr(2, 9)
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
  direction = "left",
  style,
  className,
}: TextShimmerProps) {
  const classNameRef = React.useRef<string>(getUniqueClassName())
  const Tag = tag as any
  const backgroundSize = `200% 200%`
  const speedFormatted = 11 - speed
  const gradientFirst = 50 - (size * (50 - 20)) / 100
  const gradientLast = 50 + (size * (80 - 50)) / 100
  const animationDuration = speedFormatted + delay

  const startPos = direction === "left" ? "-100%" : "200%"
  const endPos = direction === "left" ? "200%" : "-100%"
  const keyframes = `
        @keyframes shimmer-${classNameRef.current} {
            0%, ${(delay / animationDuration) * 100}% {
                background-position: ${startPos};
            }
            100% {
                background-position: ${endPos};
            }
        }
    `

  React.useEffect(() => {
    const styleId = `shimmer-style-${classNameRef.current}`
    let styleEl = document.getElementById(styleId) as HTMLStyleElement | null
    if (!styleEl) {
      styleEl = document.createElement("style")
      styleEl.id = styleId
      document.head.appendChild(styleEl)
    }
    styleEl.innerHTML = `
            ${keyframes}
            .${classNameRef.current} {
                background: linear-gradient(
                    ${rotation}deg,
                    transparent 0%,
                    transparent ${gradientFirst}%,
                    ${shimmer} 50%,
                    transparent ${gradientLast}%,
                    transparent 100%
                );
                -webkit-background-size: ${backgroundSize};
                -moz-background-size: ${backgroundSize};
                background-size: ${backgroundSize};
                -webkit-background-clip: text;
                -moz-background-clip: text;
                background-clip: text;
                background-repeat: no-repeat;
                animation: shimmer-${classNameRef.current} ${animationDuration}s linear infinite;
            }
        `
    return () => {
      if (styleEl && styleEl.parentNode) {
        styleEl.parentNode.removeChild(styleEl)
      }
    }
  }, [
    shimmer,
    rotation,
    gradientFirst,
    gradientLast,
    backgroundSize,
    animationDuration,
    delay,
    direction,
    keyframes,
  ])

  return (
    <div
      style={{
        userSelect: userSelect ? "auto" : "none",
        position: "relative",
      }}
      className={className}
    >
      <Tag
        style={{
          color,
          marginBlockStart: "0px",
          marginBlockEnd: "0px",
          ...style,
        }}
      >
        {content}
      </Tag>
      <Tag
        aria-hidden="true"
        className={classNameRef.current}
        style={{
          color: "transparent",
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1,
          marginBlockStart: "0px",
          marginBlockEnd: "0px",
          pointerEvents: "none",
          ...style,
        }}
      >
        {content}
      </Tag>
    </div>
  )
}

export default TextShimmer


