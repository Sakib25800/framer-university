"use client"

import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/Button/Button'
import { useCallback, useTransition } from 'react'

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
    // No-op placeholder; Step 6 uses a form submission now
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
