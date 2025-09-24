import type { Meta, StoryObj } from "@storybook/react"
import React from "react"
import { Logo } from "./Logo"

const meta: Meta<typeof Logo> = {
  title: "Logo",
  component: Logo,
  parameters: {
    layout: "centered",
  },
  args: {
    beta: false,
  },
  argTypes: {
    beta: {
      control: { type: "boolean" },
    },
  },
}

type Story = StoryObj<typeof Logo>

export const Default: Story = {}

export const Beta: Story = {
  args: {
    beta: true,
  },
}

export default meta
