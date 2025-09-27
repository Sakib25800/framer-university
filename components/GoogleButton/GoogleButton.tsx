import { Button, type ButtonProps } from "@/components/Button/Button"
import IconGoogle from "@/components/icons/google.svg"
import { cn } from "@/lib/utils"

export type GoogleButtonProps = Omit<ButtonProps, "variants">

export function GoogleButton({ className, children = "Continue with Google", ...props }: GoogleButtonProps) {
  return (
    <Button variant="outline" size="sm" className={cn("gap-2.5", className)} {...props}>
      <IconGoogle />
      {children}
    </Button>
  )
}

export default GoogleButton
