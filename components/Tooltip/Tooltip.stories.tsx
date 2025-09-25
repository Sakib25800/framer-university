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
    docs: {
      description: {
        component: "Accessible tooltip with optional keyboard shortcut hint.",
      },
    },
  },
  args: {
    intent: "primary",
    explainer: "Action name",
    side: "bottom",
    shortcut: "ESC",
  },
  argTypes: {
    intent: {
      options: ["primary"],
      control: { type: "inline-radio" },
    },
    side: {
      options: ["top", "right", "bottom", "left"],
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
    <div className="flex gap-4">
      <Tooltip {...args} side="top"><IconButton><CloseIcon /></IconButton></Tooltip>
      <Tooltip {...args} side="right"><IconButton><CloseIcon /></IconButton></Tooltip>
      <Tooltip {...args} side="bottom"><IconButton><CloseIcon /></IconButton></Tooltip>
      <Tooltip {...args} side="left"><IconButton><CloseIcon /></IconButton></Tooltip>
    </div>
  ),
}

export default meta
