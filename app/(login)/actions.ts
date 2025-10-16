"use server"

import { redirect } from "next/navigation"
import { z } from "zod"
import { validatedAction } from "@/lib/auth/middleware"
import { createClient } from "@/utils/supabase/server"

const signUpSchema = z.object({
  email: z.string().email().min(3).max(50),
  firstName: z.string().min(2).max(50),
  lastName: z.string().min(2).max(50)
})

export const signUp = validatedAction(signUpSchema, async (data) => {
  const { email, firstName, lastName } = data
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      data: {
        first_name: firstName,
        last_name: lastName
      }
    }
  })

  if (error) {
    return {
      error: error.message
    }
  }

  redirect(`/magic-link?email=${email}`)
})

const signInSchema = z.object({
  email: z.string().email().min(3).max(50)
})

export const signIn = validatedAction(signInSchema, async (data) => {
  const { email } = data
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      shouldCreateUser: false
    }
  })

  if (error) {
    const code = error.code

    if (code === "otp_disabled") {
      return {
        error: "No account found with this email address. Please sign up first."
      }
    }

    return {
      error: error.message
    }
  }

  redirect(`/magic-link?email=${email}`)
})

export const signInWithGoogle = async () => {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      queryParams: {
        access_type: "offline",
        prompt: "consent",
        scope: "openid email profile"
      }
    }
  })

  if (error) {
    redirect(`/sign-in?error=${encodeURIComponent("Something went wrong")}`)
  }

  redirect(data.url)
}
