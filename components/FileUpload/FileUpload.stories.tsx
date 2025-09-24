import type { Meta, StoryObj } from "@storybook/react"
import * as React from "react"
import FileUpload from "./FileUpload"

const meta: Meta<typeof FileUpload> = {
  title: "FileUpload",
  component: FileUpload,
  args: {
    accept: undefined,
    multiple: false,
    disabled: false,
    status: "default",
    className: "w-[340px] h-[56px]",
  },
  argTypes: {
    onChange: { action: "change" },
    onRemove: { action: "remove" },
    status: {
      control: { type: "select" },
      options: ["default", "uploading", "uploaded"],
    },
  },
}

type Story = StoryObj<typeof FileUpload>

export const Default: Story = {
  render: (args) => {
    const [status, setStatus] = React.useState<"default" | "uploading" | "uploaded">("default")
    const [fileName, setFileName] = React.useState<string | undefined>(undefined)
    const [fileSize, setFileSize] = React.useState<string | undefined>(undefined)
    const [fileType, setFileType] = React.useState<string | undefined>(undefined)

    const formatBytes = (bytes: number) => {
      if (bytes === 0) return "0 B"
      const k = 1024
      const sizes = ["B", "KB", "MB", "GB", "TB"] as const
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      const num = parseFloat((bytes / Math.pow(k, i)).toFixed(1))
      return `${num} ${sizes[i]}`
    }

    return (
      <FileUpload
        {...args}
        className="w-[340px] h-[56px]"
        status={status}
        fileName={fileName}
        fileSize={fileSize}
        fileType={fileType}
        onChange={(files) => {
          if (files.length === 0) {
            setStatus("default")
            setFileName(undefined)
            setFileSize(undefined)
            setFileType(undefined)
            return
          }
          const file = files.item(0)
          if (!file) return
          setStatus("uploading")
          // Simulate upload
          setTimeout(() => {
            setFileName(file.name)
            setFileSize(formatBytes(file.size))
            setFileType(file.name.split(".").pop())
            setStatus("uploaded")
          }, 800)
        }}
        onRemove={() => {
          setStatus("default")
          setFileName(undefined)
          setFileSize(undefined)
          setFileType(undefined)
        }}
      />
    )
  },
}

export const Uploading: Story = {
  args: {
    status: "uploading",
  },
}

export const Uploaded: Story = {
  render: (args) => {
    const [status, setStatus] = React.useState<"default" | "uploading" | "uploaded">("uploaded")
    const [fileName, setFileName] = React.useState<string | undefined>("scroll-variants-edited.png")
    const [fileSize, setFileSize] = React.useState<string | undefined>("2.4 MB")
    const [fileType, setFileType] = React.useState<string | undefined>("png")

    return (
      <FileUpload
        {...args}
        className="w-[340px] h-[56px]"
        status={status}
        fileName={fileName}
        fileSize={fileSize}
        fileType={fileType}
        onRemove={() => {
          setStatus("default")
          setFileName(undefined)
          setFileSize(undefined)
          setFileType(undefined)
        }}
        onChange={(files) => {
          if (files.length === 0) {
            setStatus("default")
            return
          }
        }}
      />
    )
  },
}

export default meta


