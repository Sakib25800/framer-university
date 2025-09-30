"use client"

import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/Button/Button'

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

  const handleContinue = () => {
    if (currentStep < totalSteps) {
      // Go to next step
      router.push(`/onboarding?step=${currentStep + 1}`)
    } else {
      // Go to account page (last step)
      router.push('/account')
    }
  }

  const buttonText = currentStep === totalSteps ? "Let's go!" : (children || "Continue")

  return (
    <div className="flex justify-center">
      <Button 
        variant="primary" 
        size="md" 
        onClick={handleContinue}
        disabled={disabled}
      >
        {buttonText}
      </Button>
    </div>
  )
}
