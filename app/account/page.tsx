import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
import AccountForm from "./account-form"

export default async function Account() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/sign-in")
  }

  return (
    <div>
      <h1>Account</h1>
      <AccountForm user={user} />
    </div>
  )
}
