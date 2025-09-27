import LogoIcon from "@/components/icons/logo.svg"
import { cn } from "@/lib/utils"

interface LogoProps {
  beta?: boolean
  className?: string
}

export function Logo({ beta = false, className }: LogoProps) {
  return (
    <div className={cn("flex gap-3", className)}>
      <LogoIcon />
      {beta && (
        <div className="border-primary-500 flex w-fit items-center rounded-full border border-dashed px-2.5">
          <p className="text-primary-950 font-chivo-mono text-[11px] leading-[1.2em] font-medium">BETA</p>
        </div>
      )}
    </div>
  )
}
