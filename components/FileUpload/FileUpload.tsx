"use client"

import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"
import { twMerge } from "tailwind-merge"
import { IconButton } from "@/components/IconButton/IconButton"
import IconTrash from "@/components/icons/trash.svg"
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

export interface FileUploadProps
  extends VariantProps<typeof fileUpload>,
    Omit<React.InputHTMLAttributes<HTMLInputElement>, "className" | "onChange" | "disabled"> {
  className?: string
  onChange?: (files: FileList | null) => void
  onRemove?: () => void
}

export function FileUpload({
  id,
  name,
  accept,
  multiple,
  disabled,
  className,
  onChange,
  onRemove,
  status: statusProp,
  ...rest
}: FileUploadProps) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const reactId = React.useId()
  const inputId = id ?? `file-upload-${reactId}`

  const [selectedFile, setSelectedFile] = React.useState<File | null>(null)

  const status = statusProp || (selectedFile ? "uploaded" : "default")
  const isUploading = status === "uploading"
  const isDisabled = Boolean(disabled || isUploading)

  const formatFileSize = React.useCallback((bytes: number): string => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }, [])

  const getFileType = React.useCallback((file: File): string => {
    const extension = file.name.split(".").pop()
    if (extension && extension.length <= 6) {
      return extension.toUpperCase()
    }

    if (file.type) {
      const mimeType = file.type.split("/")[1]
      if (mimeType && mimeType.length <= 6) {
        return mimeType.toUpperCase()
      }
    }
    return "FILE"
  }, [])

  const handleFiles = React.useCallback(
    (files: FileList | null) => {
      if (files && files.length > 0) {
        const file = files[0]
        setSelectedFile(file ?? null)
        onChange?.(files)
      } else {
        setSelectedFile(null)
        onChange?.(null)
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

  const handleRemove = React.useCallback(() => {
    if (inputRef.current) {
      inputRef.current.value = ""
    }
    setSelectedFile(null)
    onChange?.(null)
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
            <div className="bg-primary-400 flex h-[40px] w-[40px] items-center justify-center rounded-[4px] text-[12px] font-semibold text-white">
              {selectedFile ? getFileType(selectedFile) : "FILE"}
            </div>
            <div className="min-w-0">
              <div className="text-body-s truncate font-medium">{selectedFile?.name ?? "uploaded-file.png"}</div>
              <div className="text-body-s text-primary-900 font-medium">
                {selectedFile ? formatFileSize(selectedFile.size) : "—"}
              </div>
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
