"use client"

import { useSearchParams } from "next/navigation"
import { useState } from "react"
import { TOTAL_ONBOARDING_STEPS } from "@/lib/constants"
import { OnboardingResponse } from "@/lib/db/queries"
import BottomNav from "./components/BottomNav"
import { Step0, Step1, Step2, Step3, Step4, Step5 } from "./steps"

export default function OnboardingForm({
  submitAction,
}: {
  submitAction: (response: OnboardingResponse) => Promise<void>
}) {
  const searchParams = useSearchParams()
  const currentStep = parseInt(searchParams.get("step") || "0")
  const [data, setData] = useState({
    source: "",
    goal: "",
    experience: "",
  })

  const handleContinue = async () => {
    if (currentStep === TOTAL_ONBOARDING_STEPS) {
      await submitAction(data)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <Step0 />
      case 1:
        return <Step1 value={data.source} onChangeAction={(value) => setData({ ...data, source: value })} />
      case 2:
        return <Step2 value={data.goal} onChangeAction={(value) => setData({ ...data, goal: value })} />
      case 3:
        return <Step3 />
      case 4:
        return <Step4 value={data.experience} onChangeAction={(value) => setData({ ...data, experience: value })} />
      case 5:
        return <Step5 />
      default:
        return <Step0 />
    }
  }

  return (
    <div className="flex w-full max-w-[600px] flex-col">
      <div className="flex-1">{renderStep()}</div>
      <div className="px-6 pt-[40px]">
        <BottomNav onContinueAction={handleContinue} />
      </div>
    </div>
  )
}
