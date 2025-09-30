import { createClient } from "@/utils/supabase/server"
import type { Database } from "@/types/supabase"

export async function getUser() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error) {
    return null
  }

  return user
}

type OnboardingPartial = Partial<
  Pick<Database["public"]["Tables"]["onboarding_responses"]["Insert"], "source" | "goal" | "experience">
>

export async function upsertOnboardingResponses(userId: string, partial: OnboardingPartial) {
  const supabase = await createClient()
  const { error } = await supabase
    .from("onboarding_responses")
    .upsert({ user_id: userId, ...partial }, { onConflict: "user_id" })
  if (error) throw new Error(error.message)
}

export async function markOnboardingCompleted(userId: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from("profiles")
    .update({ onboarding_completed: true })
    .eq("id", userId)
  if (error) throw new Error(error.message)
}

export async function getOnboardingCompleted(userId: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from("profiles")
    .select("onboarding_completed")
    .eq("id", userId)
    .single()
  return data?.onboarding_completed ?? false
}
