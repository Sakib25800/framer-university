import type { Meta, StoryObj } from "@storybook/react"
import { useEffect, useRef } from "react"
import { FileUpload } from "./FileUpload"

const meta: Meta<typeof FileUpload> = {
  title: "File Upload",
  component: FileUpload,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A file upload component with drag and drop support, multiple file types, and upload status indicators.",
      },
    },
  },
  args: {
    accept: undefined,
    multiple: false,
    disabled: false,
    className: "w-[340px] h-[56px]",
  },
  argTypes: {
    onChange: { action: "change" },
    onRemove: { action: "remove" },
  },
}

type Story = StoryObj<typeof FileUpload>

export const Default: Story = {
  args: {},
}

export const Uploading: Story = {
  args: {},
  render: (args) => {
    const fileUploadRef = useRef<{
      files: FileList | null
      clear: () => void
      setStatus: (status: "default" | "uploading" | "uploaded") => void
    }>(null)

    useEffect(() => {
      fileUploadRef.current?.setStatus("uploading")
    }, [])

    return <FileUpload ref={fileUploadRef} {...args} />
  },
  parameters: {
    docs: {
      description: {
        story: "The uploading state shows an animated shimmer effect while files are being processed.",
      },
    },
  },
}

export const Uploaded: Story = {
  args: {},
  render: (args) => {
    const fileUploadRef = useRef<{
      files: FileList | null
      clear: () => void
      setStatus: (status: "default" | "uploading" | "uploaded") => void
    }>(null)

    useEffect(() => {
      const mockFile = new File(["mock content"], "scroll-variants-edited.png", {
        type: "image/png",
        lastModified: Date.now(),
      })

      const dataTransfer = new DataTransfer()
      dataTransfer.items.add(mockFile)

      setTimeout(() => {
        fileUploadRef.current?.setStatus("uploaded")
      }, 100)
    }, [])

    return <FileUpload ref={fileUploadRef} {...args} />
  },
}

export const Interactive: Story = {
  args: {},
  render: (args) => {
    const fileUploadRef = useRef<{
      files: FileList | null
      clear: () => void
      setStatus: (status: "default" | "uploading" | "uploaded") => void
    }>(null)

    const handleChange = (files: FileList | null) => {
      if (files && files.length > 0) {
        fileUploadRef.current?.setStatus("uploading")

        setTimeout(() => {
          fileUploadRef.current?.setStatus("uploaded")
        }, 2000)
      }
      args.onChange?.(files)
    }

    return <FileUpload ref={fileUploadRef} {...args} onChange={handleChange} />
  },
}

export default meta
