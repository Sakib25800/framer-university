"use client"

import { useSearchParams } from 'next/navigation'
import ContinueButton from './ContinueButton'
import BackButton from './BackButton'

export default function BottomNav() {
  const searchParams = useSearchParams()
  const currentStep = parseInt(searchParams.get('step') || '1')

  // Step 1 has centered continue button, no back button
  if (currentStep === 1) {
    return (
      <div className="flex justify-center">
        <ContinueButton />
      </div>
    )
  }

  // Steps 2-6 have back and continue buttons on opposite sides
  return (
    <div className="flex justify-between items-center">
      <BackButton />
      <ContinueButton />
    </div>
  )
}
