"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { submitOnboardingResponse } from "@/lib/db/queries"
import OnboardingForm from "./Form"
import Loader from "@/components/Loader/Loader"

export default function OnboardingPage() {
  const [showLoader, setShowLoader] = useState(true)

  useEffect(() => {
    // Show loader for 1.5 seconds
    const timer = setTimeout(() => {
      setShowLoader(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  // Prevent scrollbars during loading
  useEffect(() => {
    if (typeof document === "undefined") return
    const { body } = document
    const previousOverflow = body.style.overflow
    
    if (showLoader) {
      body.style.overflow = "hidden"
    } else {
      body.style.overflow = previousOverflow || ""
    }
    
    return () => {
      body.style.overflow = previousOverflow || ""
    }
  }, [showLoader])

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        {showLoader ? (
          <motion.div
            key="loader"
            className="bg-primary-50 fixed inset-0 z-50 flex items-center justify-center"
            initial={{ opacity: 1 }}
            exit={{ 
              opacity: 0,
              transition: { 
                duration: 0.2,
                ease: "easeOut"
              }
            }}
          >
            <Loader size={56} />
          </motion.div>
        ) : (
          <motion.div
            key="onboarding"
            initial={{ opacity: 0, y: 10 }}
            animate={{ 
              opacity: 1, 
              y: 0,
              transition: {
                duration: 0.3,
                ease: "easeOut"
              }
            }}
          >
            <OnboardingForm submitAction={submitOnboardingResponse} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
