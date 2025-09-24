import type { Meta, StoryObj } from "@storybook/react"
import React from "react"
import CloseIcon from "@/components/icons/close.svg"
import { Tooltip } from "./Tooltip"
import { IconButton } from "../IconButton/IconButton"

const meta: Meta<typeof Tooltip> = {
  title: "Tooltip",
  component: Tooltip,
  parameters: {
    layout: "centered",
  },
  args: {
    intent: "primary",
    explainer: "Action name",
    side: "bottom",
  },
  argTypes: {
    intent: {
      options: ["primary"],
      control: { type: "select" },
    },
    side: {
      options: ["top", "right", "bottom", "left"],
      control: { type: "select" },
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

export default meta
