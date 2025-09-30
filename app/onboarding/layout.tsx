"use client"

import { useSearchParams } from "next/navigation"
import { Logo } from "@/components/Logo/Logo"
import ProgressBar from "@/components/ProgressBar/ProgressBar"
import { TOTAL_ONBOARDING_STEPS } from "@/lib/constants"

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams()
  const step = parseInt(searchParams.get("step") || "0")
  const progressValue = (step / TOTAL_ONBOARDING_STEPS) * 100

  return (
    <main className="bg-primary-50 flex min-h-screen min-w-screen flex-col">
      <nav className="relative flex h-[76px] w-full flex-shrink-0 items-center justify-center">
        <div className="absolute left-[24px] hidden sm:left-[24px] sm:block md:left-[74px]">
          <Logo beta={true} />
        </div>
        <div className="flex w-full max-w-[1100px] items-center">
          <div className="flex w-full justify-center">
            <ProgressBar value={progressValue} className="max-w-[340px]" />
          </div>
        </div>
      </nav>
      <div className="flex flex-1 items-center justify-center">{children}</div>
    </main>
  )
}
