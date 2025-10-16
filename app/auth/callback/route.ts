import { redirect } from "next/navigation"
import { NextRequest } from "next/server"
import { createClient } from "@/utils/supabase/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get("code")

  if (!code) {
    return redirect("/sign-in?error=missing_code")
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    return redirect("/sign-in?error=invalid_code")
  }

  const {
    data: { session }
  } = await supabase.auth.getSession()

  // User has not completed onboarding, redirect to onboarding
  if (session) {
    const { data: record } = await supabase
      .from("onboarding_responses")
      .select("user_id")
      .eq("user_id", session.user.id)
      .maybeSingle()
    if (!record) {
      return redirect("/onboarding")
    }
  }

  return redirect("/account")
}
