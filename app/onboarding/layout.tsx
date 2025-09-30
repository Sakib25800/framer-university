"use client"

import { Logo } from "@/components/Logo/Logo"
import ProgressBar from "@/components/ProgressBar/ProgressBar"
import { useSearchParams } from "next/navigation"
import BottomNav from "./components/BottomNav"

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams()
  const currentStep = parseInt(searchParams.get('step') || '1')
  const totalSteps = 6
  const progressValue = (currentStep / totalSteps) * 100
  
  return (
    <main className="bg-primary-50 min-h-screen min-w-screen flex flex-col">
      <nav className="flex h-[76px] items-center justify-center w-full relative flex-shrink-0">
        <div className="hidden sm:block absolute left-[24px] md:left-[74px] sm:left-[24px]">
          <Logo beta={true} />
        </div>
        <div className="flex items-center max-w-[1100px] w-full">
          <div className="flex justify-center w-full">
              <ProgressBar value={progressValue} className="max-w-[340px]"/>
          </div>
        </div>
      </nav>
      <div className="flex-1 flex justify-center items-center">
        <div className="w-full max-w-[600px] flex flex-col">
          <div className="flex-1">{children}</div>
          <div className="px-6 pt-[40px]">
            <BottomNav />
          </div>
        </div>
      </div>
    </main>
  )
}
