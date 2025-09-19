import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
import AccountForm from "./account-form"

export default async function Account() {
  const supabase = await createClient()

  // Get the user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // If no user is signed in, redirect to login page
  if (!user) {
    redirect("/login")
  }

  return (
    <div>
      <h1>Account</h1>
      <AccountForm user={user} />
    </div>
  )
}
