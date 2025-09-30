"use client"

import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/Button/Button'
import { useCallback, useTransition } from 'react'
import { completeOnboardingServerAction } from '@/lib/onboarding/actions'

export default function ContinueButton({ 
  children = "Continue",
  disabled = false 
}: { 
  children?: React.ReactNode
  disabled?: boolean 
}) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentStep = parseInt(searchParams.get('step') || '1')
  const totalSteps = 6

  const [isPending, startTransition] = useTransition()

  const saveForStep = useCallback(async () => {
    // In steps 2/3/5 we persist user's selection before navigating
    try {
      // No per-step save here; forms will submit themselves on change
      if (currentStep === 6) {
        await completeOnboardingServerAction()
      }
    } catch (e) {
      // Non-blocking
    }
  }, [currentStep])

  const handleContinue = async () => {
    startTransition(async () => {
      // If the current step's form exists, submit it; otherwise just navigate
      const form = document.querySelector('form') as HTMLFormElement | null
      if (form) {
        form.requestSubmit()
      } else {
        await saveForStep()
      }
      if (currentStep < totalSteps) {
        router.push(`/onboarding?step=${currentStep + 1}`)
      } else {
        router.push('/account')
      }
    })
  }

  const buttonText = currentStep === totalSteps ? "Let's go!" : (children || "Continue")

  return (
    <div className="flex justify-center">
      <Button 
        variant="primary" 
        size="md" 
        onClick={handleContinue}
        disabled={disabled || isPending}
      >
        {buttonText}
      </Button>
    </div>
  )
}
