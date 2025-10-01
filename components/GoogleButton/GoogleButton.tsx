"use client"

import { signInWithGoogle } from "@/app/(login)/actions"
import { Button, type ButtonProps } from "@/components/Button/Button"
import IconGoogle from "@/components/icons/google.svg"
import { cn } from "@/lib/utils"

export function GoogleButton({ className, children = "Continue with Google", ...props }: ButtonProps) {
  return (
    <Button variant="outline" size="sm" className={cn("gap-2.5", className)} onClick={signInWithGoogle} {...props}>
      <IconGoogle />
      {children}
    </Button>
  )
}

export default GoogleButton
