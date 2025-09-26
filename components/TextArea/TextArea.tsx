"use client"

import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"
import { twMerge } from "tailwind-merge"
import IconResizer from "@/components/icons/resizer.svg"

const textArea = cva(
  [
    "w-full",
    "resize-y",
    "outline-none",
    "border-2",
    "border-transparent",
    "bg-transparent",
    "text-white",
    "text-base",
    "font-normal",
    "rounded-[10px]",
    "p-3",
    "placeholder:text-primary-900",
    "shadow-[0_1px_0_0_rgba(255,255,255,0.05),0_2px_4px_0_rgba(0,0,0,0.1)]",
    "focus:border-primary-200",
    "focus:ring-1",
    "focus:ring-accent",
    "focus:ring-offset-0",
  ],
  {
    variants: {
      variant: {
        default: ["bg-primary-400"],
      },
      disabled: {
        true: ["opacity-60", "cursor-not-allowed"],
        false: [],
      },
    },
    defaultVariants: {
      variant: "default",
      disabled: false,
    },
  }
)

export interface TextAreaProps
  extends VariantProps<typeof textArea>,
    Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "className" | "disabled"> {
  className?: string
}

export function TextArea({
  className,
  variant,
  disabled,
  placeholder,
  value,
  defaultValue,
  readOnly,
  required,
  rows = 4,
  cols,
  maxLength,
  minLength,
  name,
  id,
  "aria-label": ariaLabel,
  "aria-describedby": ariaDescribedby,
  onChange,
  onBlur,
  onFocus,
  ...props
}: TextAreaProps) {
  const reactId = React.useId()
  const textAreaId = id ?? `textarea-${reactId}`

  return (
    <div className="relative inline-block">
      <textarea
        id={textAreaId}
        name={name}
        className={twMerge(textArea({ variant, disabled }), className)}
        placeholder={placeholder}
        value={value}
        defaultValue={defaultValue}
        disabled={disabled ?? false}
        readOnly={readOnly}
        required={required}
        rows={rows}
        cols={cols}
        maxLength={maxLength}
        minLength={minLength}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedby}
        onChange={onChange}
        onBlur={onBlur}
        onFocus={onFocus}
        {...props}
      />
      <IconResizer className="text-primary-900 pointer-events-none absolute right-1 bottom-3 h-3 w-3" />
    </div>
  )
}

export default TextArea
