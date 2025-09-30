import { NextResponse } from "next/server"
import { createClient } from "@/utils/supabase/server"

// This route is called by Supabase Auth after OAuth or magic link authentication
export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  const error = requestUrl.searchParams.get("error")
  const errorDescription = requestUrl.searchParams.get("error_description")

  // Handle OAuth errors
  if (error) {
    console.error("OAuth error:", error, errorDescription)
    return NextResponse.redirect(`${requestUrl.origin}/sign-in?error=${encodeURIComponent(errorDescription || error)}`)
  }

  if (!code) {
    return NextResponse.redirect(`${requestUrl.origin}/sign-in?error=Missing+code`)
  }

  try {
    const supabase = await createClient()

    // For OAuth flows, the session should be established automatically by the redirect
    // Check if we have a session first
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession()

    if (sessionError) {
      console.error("Session error:", sessionError)
      return NextResponse.redirect(`${requestUrl.origin}/sign-in?error=${encodeURIComponent(sessionError.message)}`)
    }

    // If we have a session, redirect to account
    if (session) {
      return NextResponse.redirect(`${requestUrl.origin}/account`)
    }

    // If no session exists, this might be a magic link flow
    // Only try to exchange the code if we don't have a session
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

    if (exchangeError) {
      console.error("Exchange error:", exchangeError)
      return NextResponse.redirect(`${requestUrl.origin}/sign-in?error=${encodeURIComponent(exchangeError.message)}`)
    }

    // Redirect to the account page on successful authentication
    return NextResponse.redirect(`${requestUrl.origin}/account`)
  } catch (error) {
    console.error("Error in auth callback:", error)
    return NextResponse.redirect(`${requestUrl.origin}/sign-in?error=Something+went+wrong`)
  }
}
