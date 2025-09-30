"use client"

import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/Button/Button'

export default function BackButton() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentStep = parseInt(searchParams.get('step') || '1')

  const handleBack = () => {
    if (currentStep > 1) {
      router.push(`/onboarding?step=${currentStep - 1}`)
    }
  }

  // Don't show back button on first step
  if (currentStep <= 1) {
    return null
  }

  return (
    <Button variant="link" size="md" onClick={handleBack} direction="left">
      Back
    </Button>
  )
}
