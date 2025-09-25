import type { Meta, StoryObj } from "@storybook/react"
import * as React from "react"
import FileUpload from "./FileUpload"

const meta: Meta<typeof FileUpload> = {
  title: "FileUpload",
  component: FileUpload,
  parameters: {},
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
  args: {},
}

export const Uploading: Story = {
  args: {
    status: "uploading",
  },
}

export const Uploaded: Story = {
  args: {
    status: "uploaded",
    fileName: "scroll-variants-edited.png",
    fileSize: "2.4 MB",
    fileType: "png",
  },
}

export default meta


