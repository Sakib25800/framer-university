"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { twMerge } from "tailwind-merge"
import IconTrash from "@/components/icons/trash.svg"
import { IconButton } from "@/components/IconButton/IconButton"
import { TextShimmer } from "@/components/TextShimmer/TextShimmer"

const fileUpload = cva(
  [
    "bg-primary-300",
    "rounded-[10px]",
    "border",
    "border-dashed",
    "text-base",
    "text-white",
    "font-medium",
    "flex",
    "items-center",
    "justify-center",
    "select-none",
  ],
  {
    variants: {
      status: {
        default: ["border-primary-400"],
        uploading: ["border-primary-400"],
        uploaded: ["border-primary-400"],
      },
      disabled: {
        true: ["opacity-60", "cursor-not-allowed"],
        false: [],
      },
    },
    defaultVariants: {
      status: "default",
      disabled: false,
    },
  }
)

export interface FileUploadProps extends VariantProps<typeof fileUpload> {
  id?: string
  name?: string
  accept?: string
  multiple?: boolean
  disabled?: boolean
  className?: string
  style?: React.CSSProperties
  "aria-label"?: string
  onChange?: (files: FileList) => void
  onRemove?: () => void
  fileName?: string
  fileSize?: string
  fileType?: string
}

export function FileUpload({ id, name, accept, multiple, disabled, className, onChange, onRemove, fileName, fileSize, fileType, status, ...rest }: FileUploadProps) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const reactId = React.useId()
  const inputId = id ?? `file-upload-${reactId}`

  const isUploading = status === "uploading"
  const isDisabled = Boolean(disabled || isUploading)

  const handleFiles = React.useCallback(
    (files: FileList | null) => {
      if (files && files.length > 0) {
        onChange?.(files)
      }
    },
    [onChange]
  )

  const handleChange = React.useCallback<React.ChangeEventHandler<HTMLInputElement>>(
    (event) => {
      handleFiles(event.target.files)
    },
    [handleFiles]
  )

  const handleDrop = React.useCallback<React.DragEventHandler<HTMLDivElement>>(
    (event) => {
      event.preventDefault()
      if (isDisabled) return
      handleFiles(event.dataTransfer.files)
    },
    [isDisabled, handleFiles]
  )

  const handleDragOver = React.useCallback<React.DragEventHandler<HTMLDivElement>>((event) => {
    event.preventDefault()
  }, [])

  // Clicking is handled by <label htmlFor> to ensure cross-browser support

  // Keyboard activation is naturally handled by the label + input

  const resolvedFileType = React.useMemo(() => {
    if (fileType && fileType.trim().length > 0) return fileType.toUpperCase()
    if (fileName) {
      const match = fileName.split(".").pop()
      if (match && match.length <= 6) return match.toUpperCase()
    }
    return "FILE"
  }, [fileType, fileName])

  const handleRemove = React.useCallback(() => {
      // Clear the input's current value so the same file can be re-selected
      if (inputRef.current) {
        inputRef.current.value = ""
      }
      // Notify consumer with an empty FileList
      const emptyFiles = new DataTransfer().files
      onChange?.(emptyFiles)
      onRemove?.()
  }, [onChange, onRemove])

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      aria-disabled={isDisabled}
      className={twMerge(
        fileUpload({ status, disabled: isDisabled }),
        status === "default" && !isDisabled && "cursor-pointer",
        isDisabled && "cursor-not-allowed",
        className
      )}
      {...rest}
    >
      {status === "uploaded" ? (
        <div className="flex w-full items-center justify-between px-[6px]">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex h-[40px] w-[40px] items-center justify-center rounded-[4px] bg-primary-400 text-[12px] font-semibold text-white">
              {resolvedFileType}
            </div>
            <div className="min-w-0">
              <div className="truncate text-body-s font-medium">
                {fileName ?? "uploaded-file.png"}
              </div>
              <div className="text-body-s font-medium text-primary-900">{fileSize ?? "—"}</div>
            </div>
          </div>
          <IconButton aria-label="Remove file" intent="secondary" onClick={handleRemove}>
            <IconTrash />
          </IconButton>
        </div>
      ) : (
        <label
          htmlFor={inputId}
          className={twMerge(
            "flex h-full w-full items-center justify-center",
            isDisabled ? "pointer-events-none cursor-not-allowed" : "cursor-pointer"
          )}
        >
          {status === "uploading" ? (
            <TextShimmer
              content="Uploading..."
              style={{ fontSize: 14 }}
              speed={8}
              direction="right"
              rotation={90}
              delay={0}
              tag="p"
            />
          ) : (
            <span>Drop your image here or browse</span>
          )}
          <input
            ref={inputRef}
            type="file"
            id={inputId}
            name={name}
            accept={accept}
            multiple={multiple}
            disabled={isDisabled}
            onChange={handleChange}
            className="sr-only"
          />
        </label>
      )}
    </div>
  )
}

export default FileUpload


