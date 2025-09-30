"use client"

import { useSearchParams } from 'next/navigation'
import ContinueButton from './ContinueButton'
import BackButton from './BackButton'
import { motion } from 'motion/react'

export default function BottomNav() {
  const searchParams = useSearchParams()
  const currentStep = parseInt(searchParams.get('step') || '1')

  // Step 1 has centered continue button, no back button
  if (currentStep === 1) {
    return (
      <div className="flex justify-center">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, scale: 1, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2, ease: [0.12, 0.23, 0.5, 1] }}
        >
          <ContinueButton />
        </motion.div>
      </div>
    )
  }

  // Steps 2-6 have back and continue buttons on opposite sides
  return (
    <motion.div
      key={currentStep}
      className="flex justify-between items-center"
      initial={{ opacity: 0, scale: 1, y: -10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2, ease: [0.12, 0.23, 0.5, 1] }}
    >
      <BackButton />
      <ContinueButton />
    </motion.div>
  )
}
