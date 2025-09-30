"use client"

import clsx from "clsx"
import { motion } from "motion/react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/Button/Button"
import { TOTAL_ONBOARDING_STEPS } from "@/lib/constants"

export default function BottomNav({ onContinueAction }: { onContinueAction: () => void }) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const currentStep = parseInt(searchParams.get("step") || "0")

  const handleBack = () => {
    if (currentStep > 0) {
      router.push(`/onboarding?step=${currentStep - 1}`)
    }
  }

  const handleContinue = () => {
    if (currentStep < TOTAL_ONBOARDING_STEPS) {
      router.push(`/onboarding?step=${currentStep + 1}`)
    }
    onContinueAction()
  }

  return (
    <motion.div
      key={currentStep}
      className={clsx("flex items-center", currentStep === 0 ? "justify-center" : "justify-between")}
      initial={{ opacity: 0, scale: 1, y: -10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2, ease: [0.12, 0.23, 0.5, 1] }}
    >
      {currentStep > 0 && (
        <Button variant="link" size="md" onClick={handleBack} direction="left">
          Back
        </Button>
      )}
      <Button variant="primary" size="md" onClick={handleContinue}>
        {currentStep === TOTAL_ONBOARDING_STEPS ? "Let's go!" : "Continue"}
      </Button>
    </motion.div>
  )
}
