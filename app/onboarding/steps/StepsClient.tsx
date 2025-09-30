"use client"

import { useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import Step1 from './Step1'
import Step2 from './Step2'
import Step3 from './Step3'
import Step4 from './Step4'
import Step5 from './Step5'
import Step6 from './Step6'

export default function OnboardingSteps() {
  const searchParams = useSearchParams()
  const currentStep = parseInt(searchParams.get('step') || '1')

  // Expose a lightweight save function if needed by steps later
  const save = useCallback(async (payload: any) => {
    await fetch('/api/onboarding', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
  }, [])

  switch (currentStep) {
    case 1:
      return <Step1 />
    case 2:
      return <Step2 />
    case 3:
      return <Step3 />
    case 4:
      return <Step4 />
    case 5:
      return <Step5 />
    case 6:
      return <Step6 />
    default:
      return <Step1 />
  }
}


