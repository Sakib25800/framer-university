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

  // If a response exists at all, consider onboarding complete
  const { data: record } = await supabase
    .from('onboarding_responses')
    .select('user_id')
    .eq('user_id', user.id)
    .maybeSingle()

  if (record) {
    redirect('/account')
  }

  return <OnboardingSteps />
}
