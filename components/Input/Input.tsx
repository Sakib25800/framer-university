"use client"

import { cva } from "class-variance-authority"
import * as React from "react"
import { twMerge } from "tailwind-merge"

const input = cva([
  "bg-primary-400",
  "text-white",
  "text-base",
  "font-medium",
  "rounded-[10px]",
  "p-3",
  "outline-none",
  "placeholder:text-primary-900",
  // base shadows (inside and outside)
  "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05),0_2px_4px_0_rgba(0,0,0,0.1)]",
  // additional focus shadows only (tokens from images 3 & 4)
  "focus:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05),0_2px_4px_0_rgba(0,0,0,0.1),0_0_0_2px_#161717,0_0_0_3px_#00bbff]",
])

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "className"> {
  className?: string
}

export function Input({
  className,
  disabled,
  placeholder,
  value,
  defaultValue,
  readOnly,
  required,
  name,
  id,
  type = "text",
  maxLength,
  minLength,
  pattern,
  "aria-label": ariaLabel,
  "aria-describedby": ariaDescribedby,
  onChange,
  onBlur,
  onFocus,
  ...props
}: InputProps) {
  const reactId = React.useId()
  const inputId = id ?? `input-${reactId}`

  return (
    <input
      id={inputId}
      name={name}
      type={type}
      className={twMerge(input(), className)}
      placeholder={placeholder}
      value={value}
      defaultValue={defaultValue}
      disabled={disabled}
      readOnly={readOnly}
      required={required}
      maxLength={maxLength}
      minLength={minLength}
      pattern={pattern}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedby}
      onChange={onChange}
      onBlur={onBlur}
      onFocus={onFocus}
      {...props}
    />
  )
}

export default Input
