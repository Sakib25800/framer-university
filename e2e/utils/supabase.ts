import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export const getSupabaseClient = () => {
  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

export const getOnboardingResponse = async (email: string) => {
  const supabase = getSupabaseClient()

  // Get user by email
  const { data: userData } = await supabase.auth.admin.listUsers()
  const user = userData.users.find((u) => u.email === email)

  if (!user) {
    throw new Error(`User with email ${email} not found`)
  }

  // Get onboarding response
  const { data, error } = await supabase.from("onboarding_responses").select("*").eq("user_id", user.id).single()

  if (error) {
    throw error
  }

  return data
}
