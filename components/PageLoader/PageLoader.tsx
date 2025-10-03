"use client"

import { motion } from "motion/react"
import React, { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import Loader from "../Loader/Loader"

export interface PageLoaderProps {
  loading: boolean
  children?: React.ReactNode
}

export function PageLoader({ loading, children }: PageLoaderProps) {
  const FADE_OUT_MS = 200
  const [contentReady, setContentReady] = useState(false)

  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => setContentReady(true), FADE_OUT_MS)
      return () => clearTimeout(timer)
    }
    setContentReady(false)
  }, [loading])

  useEffect(() => {
    if (typeof document === "undefined") return
    const { body } = document
    const previousOverflow = body.style.overflow
    if (loading) {
      body.style.overflow = "hidden"
    } else {
      body.style.overflow = previousOverflow || ""
    }
    return () => {
      body.style.overflow = previousOverflow || ""
    }
  }, [loading])

  const wrapperOverflowClass = contentReady ? "overflow-x-clip overflow-y-visible" : "overflow-hidden"

  return (
    <div className={cn("relative", wrapperOverflowClass)}>
      <motion.div
        className={cn(
          "bg-background/80 absolute inset-0 flex items-center justify-center",
          loading ? "z-50" : "pointer-events-none -z-10"
        )}
        initial={{ opacity: 1 }}
        animate={{ opacity: loading ? 1 : 0 }}
        transition={{ duration: FADE_OUT_MS / 1000 }}
        aria-live="polite"
        role="status"
      >
        <Loader size={56} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 1.05, y: -10 }}
        animate={{ opacity: contentReady ? 1 : 0, scale: contentReady ? 1 : 1.05, y: contentReady ? 0 : -10 }}
        transition={{ duration: 0.7, ease: [0.75, 0.07, 0.31, 1.03] }}
      >
        {children}
      </motion.div>
    </div>
  )
}

export function PageLoaderFallback() {
  return (
    <div className="bg-background/80 flex min-h-screen items-center justify-center" aria-live="polite" role="status">
      <Loader size={56} />
    </div>
  )
}

export default PageLoader
