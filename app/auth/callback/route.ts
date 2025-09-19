import { NextResponse } from "next/server"
import { createClient } from "@/utils/supabase/server"

// This route is called by Supabase Auth after a user clicks on the magic link
export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")

  if (!code) {
    return NextResponse.redirect(`${requestUrl.origin}/login?error=Missing+code`)
  }

  try {
    const supabase = await createClient()

    // Exchange the code for a session
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      return NextResponse.redirect(`${requestUrl.origin}/login?error=${encodeURIComponent(error.message)}`)
    }

    // Redirect to the account page on successful authentication
    return NextResponse.redirect(`${requestUrl.origin}/account`)
  } catch (error) {
    console.error("Error in auth callback:", error)
    return NextResponse.redirect(`${requestUrl.origin}/login?error=Something+went+wrong`)
  }
}
