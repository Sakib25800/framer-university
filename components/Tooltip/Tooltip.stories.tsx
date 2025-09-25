import type { Meta, StoryObj } from "@storybook/react"
import React from "react"
import CloseIcon from "@/components/icons/close.svg"
import { Tooltip } from "./Tooltip"
import { IconButton } from "../IconButton/IconButton"

const meta: Meta<typeof Tooltip> = {
  title: "Tooltip",
  component: Tooltip,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {},
  },
  args: {
    explainer: "Action name",
    side: "bottom",
    shortcut: "ESC",
  },
  argTypes: {
    side: {
      options: ["left", "top", "bottom", "right"],
      control: { type: "select" },
    },
    shortcut: {
      control: { type: "text" },
    },
  },
}

type Story = StoryObj<typeof Tooltip>

export const Default: Story = {
  render: (args) => (
    <Tooltip {...args}>
      <IconButton>
        <CloseIcon />
      </IconButton>
    </Tooltip>
  ),
}

export const Positions: Story = {
  render: (args) => (
    <div className="grid grid-cols-2 gap-8">
      <div className="flex items-center justify-center">
        <Tooltip {...args} side="left"><IconButton><CloseIcon /></IconButton></Tooltip>
      </div>
      <div className="flex items-center justify-center">
        <Tooltip {...args} side="top"><IconButton><CloseIcon /></IconButton></Tooltip>
      </div>
      <div className="flex items-center justify-center">
        <Tooltip {...args} side="bottom"><IconButton><CloseIcon /></IconButton></Tooltip>
      </div>
      <div className="flex items-center justify-center">
        <Tooltip {...args} side="right"><IconButton><CloseIcon /></IconButton></Tooltip>
      </div>
    </div>
  ),
}

export default meta
