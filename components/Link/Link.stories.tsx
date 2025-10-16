import type { Meta, StoryObj } from "@storybook/react"
import { Link } from "./Link"

const meta = {
  title: "Link",
  component: Link,
  parameters: {
    layout: "centered"
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["primary", "secondary"]
    },
    children: {
      control: { type: "text" }
    },
    href: {
      control: { type: "text" }
    }
  }
} satisfies Meta<typeof Link>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
    variant: "primary",
    children: "Primary Link",
    href: "#"
  }
}

export const Secondary: Story = {
  args: {
    variant: "secondary",
    children: "Secondary Link",
    href: "#"
  }
}
