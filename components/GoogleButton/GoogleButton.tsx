import { cn } from "@/lib/utils"
import { Button, type ButtonProps } from "@/components/Button/Button"
import IconGoogle from "@/components/icons/google.svg"

export type GoogleButtonProps = Omit<ButtonProps, "intent">

export function GoogleButton({ className, children = "Continue with Google", ...props }: GoogleButtonProps) {
  return (
    <Button intent="outline" size="sm" className={cn("gap-2.5", className)} {...props}>
      <IconGoogle />
      {children}
    </Button>
  )
}

export default GoogleButton
