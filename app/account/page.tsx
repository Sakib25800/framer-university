import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
import AccountForm from "./account-form"

export default async function Account() {
  const supabase = await createClient()

  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/sign-in")
  }

  // If onboarding not completed, force to onboarding
  const { data: record } = await supabase
    .from("onboarding_responses")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle()

  if (!record) {
    redirect("/onboarding")
  }

  return (
    <div>
      <h1>Account</h1>
      <AccountForm user={user} />
    </div>
  )
}
