import { redirect } from "next/navigation"
import { z } from "zod"
import { validatedAction } from "@/lib/auth/middleware"
import { createClient } from "@/utils/supabase/server"

const signUpSchema = z.object({
  email: z.string().email().min(3).max(255),
  firstName: z.string().min(2).max(100),
  lastName: z.string().min(2).max(100),
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
        last_name: lastName,
      },
    },
  })

  if (error) {
    return {
      error: error.message,
    }
  }

  redirect("/magic-link")
})

const signInSchema = z.object({
  email: z.string().email().min(3).max(255),
})

export const signIn = validatedAction(signInSchema, async (data) => {
  const { email } = data
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      shouldCreateUser: false,
    },
  })

  if (error) {
    return {
      error: error.message,
    }
  }

  redirect("/magic-link")
})
