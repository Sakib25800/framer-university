"use client"

import { Button, type ButtonProps } from "@/components/Button/Button"
import IconGoogle from "@/components/icons/google.svg"
import { cn } from "@/lib/utils"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"

export type GoogleButtonProps = Omit<ButtonProps, "variants"> & {
  onSuccess?: () => void
  onError?: (error: string) => void
}

export function GoogleButton({
  className,
  children = "Continue with Google",
  onSuccess,
  onError,
  ...props
}: GoogleButtonProps) {
  const router = useRouter()

  const handleGoogleSignIn = async () => {
    try {
      console.log("Starting Google OAuth...")
      const supabase = createClient()

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
            scope: "openid email profile",
          },
        },
      })

      if (error) {
        console.error("Google OAuth error:", error)
        onError?.(error.message)
        return
      }

      console.log("Google OAuth initiated successfully:", data)
      onSuccess?.()
    } catch (error) {
      console.error("Google OAuth exception:", error)
      onError?.(error instanceof Error ? error.message : "An error occurred")
    }
  }

  return (
    <Button variant="outline" size="sm" className={cn("gap-2.5", className)} onClick={handleGoogleSignIn} {...props}>
      <IconGoogle />
      {children}
    </Button>
  )
}

export default GoogleButton
