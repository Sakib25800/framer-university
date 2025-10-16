import { cva, type VariantProps } from "class-variance-authority"
import LogoIcon from "@/components/icons/logo.svg"
import { cn } from "@/lib/utils"

const logoIconVariants = cva([], {
  variants: {
    size: {
      sm: ["w-6", "h-6"],
      lg: ["w-[34px]", "h-[34px]"]
    }
  },
  defaultVariants: {
    size: "sm"
  }
})

type LogoProps = React.ComponentProps<"div"> &
  VariantProps<typeof logoIconVariants> & {
    beta?: boolean
    className?: string
  }

export function Logo({ beta = false, className, size }: LogoProps) {
  return (
    <div className={cn("flex gap-3", className)}>
      <LogoIcon className={cn(logoIconVariants({ size }))} />
      {beta && (
        <div className="border-primary-500 flex w-fit items-center rounded-full border border-dashed px-2.5">
          <p className="text-primary-950 font-chivo-mono text-[11px] leading-[1.2em] font-medium">BETA</p>
        </div>
      )}
    </div>
  )
}
