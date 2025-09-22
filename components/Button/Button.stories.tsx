import type { Meta, StoryObj } from "@storybook/react"
import { Button } from "./Button"

const meta: Meta<typeof Button> = {
  title: "Button",
  component: Button,
  args: {
    intent: "primary",
    children: "Continue",
    size: "lg",
  },
  argTypes: {
    intent: {
      options: ["primary", "outline"],
      control: { type: "select" },
    },
    size: {
      options: ["sm", "md", "lg"],
      control: { type: "select" },
    },
  },
}

type Story = StoryObj<typeof Button>

export const Default: Story = {
  render: (args) => <Button {...args} />,
}

export default meta
