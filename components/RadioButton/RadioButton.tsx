import { cva } from "class-variance-authority"
import { spring } from "motion"
import { cn } from "@/lib/utils"

const radioButton = cva(["inline-flex", "items-center", "select-none"], {
  variants: {
    checked: {
      true: ["cursor-default"],
      false: ["cursor-pointer"]
    }
  },
  defaultVariants: {
    checked: false
  }
})

const radioBlock = cva(
  [
    "pt-4",
    "pr-[18px]",
    "pb-4",
    "pl-[18px]",
    "rounded-lg",
    "bg-primary-200",
    "hover:bg-primary-300",
    "w-full",
    "h-fit",
    "text-body",
    "font-semibold",
    "text-white",
    "flex",
    "items-center",
    "justify-start",
    "gap-2",
    "ring-1",
    "ring-[rgba(37,39,39,0.65)]",
    "select-none"
  ],
  {
    variants: {
      checked: {
        true: [
          "bg-[#15313E]",
          "text-accent",
          "hover:bg-[#15313E]",
          "ring-[3px]",
          "ring-[#0E0E0E]",
          "outline",
          "outline-[2px]",
          "outline-accent",
          "outline-offset-[3px]",
          "cursor-default",
          "pl-[14px]"
        ],
        false: ["cursor-pointer"]
      }
    },
    defaultVariants: {
      checked: false
    }
  }
)

export type RadioButtonProps = React.ComponentProps<"input"> & {
  label: string
  subtext?: string
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>
}

export function RadioButton({
  className,
  label,
  subtext,
  icon,
  name,
  value,
  checked,
  disabled,
  onChange,
  ...props
}: RadioButtonProps) {
  const Icon = icon
  return (
    <label className={cn(radioButton({ checked }), className)}>
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        disabled={disabled}
        onChange={onChange}
        className="sr-only"
        {...props}
      />
      <div
        className={cn(radioBlock({ checked }))}
        style={{
          transition: `all ${spring({ keyframes: [0, 1], duration: 300, bounce: 0.2, delay: 0 })}`
        }}
      >
        {Icon ? (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center">
            <Icon className="h-5 w-5 [fill:currentColor]" aria-hidden="true" />
          </div>
        ) : null}
        <div className="flex min-w-0 flex-col items-start">
          <span className="block w-full truncate">{label}</span>
          {subtext ? (
            <span className={cn("base text-primary-950 w-full truncate font-normal", checked && "text-[#00BBFFA6]")}>
              {subtext}
            </span>
          ) : null}
        </div>
      </div>
    </label>
  )
}
