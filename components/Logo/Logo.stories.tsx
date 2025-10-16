import type { Meta, StoryObj } from "@storybook/react"
import { Logo } from "./Logo"

const meta: Meta<typeof Logo> = {
  title: "Logo",
  component: Logo,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: { component: "Brand logo with optional beta badge." }
    }
  },
  args: {
    beta: false
  },
  argTypes: {
    beta: {
      control: { type: "boolean" }
    },
    size: {
      control: { type: "select" },
      options: ["sm", "lg"]
    }
  }
}

type Story = StoryObj<typeof Logo>

export const Default: Story = {}

export const Beta: Story = {
  args: {
    beta: true
  }
}

export const Small: Story = {
  args: {
    size: "sm"
  }
}

export const Large: Story = {
  args: {
    size: "lg"
  }
}

export const LargeBeta: Story = {
  args: {
    size: "lg",
    beta: true
  }
}

export default meta
