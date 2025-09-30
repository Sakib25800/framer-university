import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import OnboardingSteps from '@/app/onboarding/steps/StepsClient'

export default async function OnboardingPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/sign-in')
  }

  // If user already completed onboarding, redirect to account
  const { data: profile } = await supabase
    .from('profiles')
    .select('onboarding_completed')
    .eq('id', user.id)
    .single()

  if (profile?.onboarding_completed) {
    redirect('/account')
  }

  return <OnboardingSteps />
}
