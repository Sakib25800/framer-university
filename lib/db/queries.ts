"use server"

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

export type OnboardingResponse = Pick<
  Database["public"]["Tables"]["onboarding_responses"]["Insert"],
  "source" | "goal" | "experience"
>

export async function submitOnboardingResponse(response: OnboardingResponse) {
  const user = await getUser()
  const supabase = await createClient()
  const { error } = await supabase
    .from("onboarding_responses")
    .upsert({ user_id: user.id, ...response }, { onConflict: "user_id" })
  if (error) throw new Error(error.message)
  redirect("/account")
}
