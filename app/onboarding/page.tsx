"use client"

import { useSearchParams } from 'next/navigation'
import Step1 from './steps/Step1'
import Step2 from './steps/Step2'
import Step3 from './steps/Step3'
import Step4 from './steps/Step4'
import Step5 from './steps/Step5'
import Step6 from './steps/Step6'

export default function OnboardingPage() {
  const searchParams = useSearchParams()
  const currentStep = parseInt(searchParams.get('step') || '1')

  const renderStep = () => {
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

  return renderStep()
}
