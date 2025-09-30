import { redirect } from "next/navigation"
import type { Database } from "@/types/supabase"
import { createClient } from "@/utils/supabase/server"

export async function getUser() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/sign-in")
  }

  return user
}

type OnboardingResponse = Pick<
  Database["public"]["Tables"]["onboarding_responses"]["Insert"],
  "source" | "goal" | "experience"
>

export async function upsertOnboardingResponses(userId: string, response: OnboardingResponse) {
  const supabase = await createClient()
  const { error } = await supabase
    .from("onboarding_responses")
    .upsert({ user_id: userId, ...response }, { onConflict: "user_id" })
  if (error) throw new Error(error.message)
}
