"use client"

import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"
import { IconButton } from "@/components/IconButton/IconButton"
import IconTrash from "@/components/icons/trash.svg"
import { TextShimmer } from "@/components/TextShimmer/TextShimmer"
import { cn } from "@/lib/utils"

const fileUploadVariants = cva(
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
    "relative",
    "overflow-hidden"
  ],
  {
    variants: {
      status: {
        default: ["border-primary-400"],
        uploading: ["border-primary-400"],
        uploaded: ["border-primary-400"]
      },
      disabled: {
        true: ["opacity-60", "cursor-not-allowed"],
        false: []
      }
    },
    defaultVariants: {
      status: "default",
      disabled: false
    }
  }
)

type FileInputProps = Pick<
  React.ComponentProps<"input">,
  | "id"
  | "name"
  | "accept"
  | "multiple"
  | "className"
  | "style"
  | "tabIndex"
  | "aria-label"
  | "aria-labelledby"
  | "aria-describedby"
>

export interface FileUploadProps
  extends FileInputProps,
    Omit<VariantProps<typeof fileUploadVariants>, "disabled" | "status"> {
  disabled?: boolean
  onChange?: (files: FileList | null) => void
  onRemove?: () => void
}

export interface FileUploadRef {
  files: FileList | null
  clear: () => void
  setStatus: (status: "default" | "uploading" | "uploaded") => void
}

export const FileUpload = React.forwardRef<FileUploadRef, FileUploadProps>(
  (
    {
      id,
      name,
      accept,
      multiple = false,
      disabled = false,
      className,
      style,
      tabIndex,
      onChange,
      onRemove,
      ...ariaProps
    },
    ref
  ) => {
    const inputRef = React.useRef<HTMLInputElement>(null)
    const reactId = React.useId()
    const inputId = id ?? `file-upload-${reactId}`

    const [selectedFiles, setSelectedFiles] = React.useState<FileList | null>(null)
    const [status, setStatus] = React.useState<"default" | "uploading" | "uploaded">("default")
    const isUploading = status === "uploading"
    const isUploaded = status === "uploaded"
    const isDisabled = Boolean(disabled || isUploading)

    React.useImperativeHandle(
      ref,
      () => ({
        files: selectedFiles,
        clear: () => {
          handleRemove()
        },
        setStatus: (newStatus: "default" | "uploading" | "uploaded") => {
          setStatus(newStatus)
        }
      }),
      [selectedFiles]
    )

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
        setSelectedFiles(files)
        setStatus(files && files.length > 0 ? "uploaded" : "default")
        onChange?.(files)
      },
      [onChange]
    )

    const handleInputChange = React.useCallback<React.ChangeEventHandler<HTMLInputElement>>(
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
      setSelectedFiles(null)
      setStatus("default")
      onChange?.(null)
      onRemove?.()
    }, [onChange, onRemove])

    const handleContainerClick = React.useCallback(() => {
      if (!isDisabled && !isUploaded) {
        inputRef.current?.click()
      }
    }, [isDisabled, isUploaded])

    const displayFile = selectedFiles?.[0]

    return (
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={handleContainerClick}
        className={cn(
          fileUploadVariants({ status, disabled: isDisabled }),
          !isDisabled && "cursor-pointer",
          isDisabled && "cursor-not-allowed",
          className
        )}
        style={style}
        aria-disabled={isDisabled}
        {...ariaProps}
      >
        <div
          className={cn(
            "absolute inset-0 flex items-center justify-center",
            isUploaded || isUploading ? "pointer-events-none opacity-0" : "opacity-100"
          )}
        >
          <span>Drop your image here or browse</span>
        </div>

        <div
          className={cn(
            "absolute inset-0 flex items-center justify-center",
            isUploading ? "opacity-100" : "pointer-events-none opacity-0"
          )}
        >
          <TextShimmer
            content="Uploading..."
            style={{ fontSize: 14 }}
            speed={8}
            direction="right"
            rotation={90}
            delay={0}
            tag="p"
          />
        </div>

        <div
          className={cn(
            "absolute inset-0 flex w-full items-center justify-between px-[6px]",
            isUploaded && !isUploading ? "opacity-100" : "pointer-events-none opacity-0"
          )}
        >
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="bg-primary-400 flex h-[40px] w-[40px] items-center justify-center rounded-[4px] text-[12px] font-semibold text-white">
              {displayFile ? getFileType(displayFile) : "PNG"}
            </div>
            <div className="min-w-0">
              <div className="text-body-s truncate font-medium">
                {displayFile?.name ?? "scroll-variants-edited.png"}
              </div>
              <div className="text-body-s text-primary-900 font-medium">
                {displayFile ? formatFileSize(displayFile.size) : "2.4 MB"}
              </div>
            </div>
          </div>
          <IconButton
            aria-label="Remove file"
            intent="secondary"
            onClick={(e) => {
              e.stopPropagation()
              handleRemove()
            }}
          >
            <IconTrash />
          </IconButton>
        </div>

        <input
          ref={inputRef}
          type="file"
          id={inputId}
          name={name}
          accept={accept}
          multiple={multiple}
          disabled={isDisabled}
          tabIndex={tabIndex}
          onChange={handleInputChange}
          className="sr-only"
        />
      </div>
    )
  }
)
