"use server"

import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"

export async function login(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get("email") as string

  // Send magic link email
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  })

  if (error) {
    redirect("/error")
  }

  // Redirect to a page informing the user to check their email
  redirect("/login/check-email")
}
