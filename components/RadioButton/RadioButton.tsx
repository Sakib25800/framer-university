import { cva, type VariantProps } from "class-variance-authority"
import { twMerge } from "tailwind-merge"

const radioButton = cva(
  ["inline-flex", "items-center", "cursor-pointer"],
  {
    variants: {
      size: {
        sm: ["text-sm"],
        md: ["text-base"],
        lg: ["text-lg"],
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
)

export interface RadioButtonProps extends VariantProps<typeof radioButton> {
  className?: string
  label?: string
  name?: string
  value?: string
  checked?: boolean
  disabled?: boolean
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export function RadioButton({ 
  className, 
  size, 
  label, 
  name, 
  value, 
  checked, 
  disabled, 
  onChange,
  ...props 
}: RadioButtonProps) {
  return (
    <label className={twMerge(radioButton({ size, className }))}>
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        disabled={disabled}
        onChange={onChange}
        className="mr-2"
        {...props}
      />
      {label}
    </label>
  )
}
