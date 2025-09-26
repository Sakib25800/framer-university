import { cva } from "class-variance-authority"
import { spring } from "motion"
import { twMerge } from "tailwind-merge"

const radioButton = cva(["inline-flex", "items-center", "select-none"], {
  variants: {
    checked: {
      true: ["cursor-default"],
      false: ["cursor-pointer"],
    },
  },
  defaultVariants: {
    checked: false,
  },
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
    "ring-1",
    "ring-[rgba(37,39,39,0.65)]",
    "select-none",
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
          "pl-[14px]",
        ],
        false: ["cursor-pointer"],
      },
    },
    defaultVariants: {
      checked: false,
    },
  }
)

export interface RadioButtonProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "className" | "type"> {
  className?: string
  label?: string
}

export function RadioButton({
  className,
  label,
  name,
  value,
  checked,
  disabled,
  onChange,
  ...props
}: RadioButtonProps) {
  return (
    <label className={twMerge(radioButton({ checked }), className)}>
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
        className={twMerge(radioBlock({ checked }))}
        style={{
          transition: `all ${spring({ keyframes: [0, 1], duration: 300, bounce: 0.2, delay: 0 })}`,
        }}
      >
        {label}
      </div>
    </label>
  )
}
