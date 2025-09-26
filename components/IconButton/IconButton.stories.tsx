import type { Meta, StoryObj } from "@storybook/react"
import Close from "@/components/icons/close.svg"
import { IconButton } from "./IconButton"

const meta: Meta<typeof IconButton> = {
  title: "Icon Button",
  component: IconButton,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "Circular icon button for compact actions.",
      },
    },
    layout: "centered",
  },
  args: {
    intent: "primary",
    children: <Close />,
  },
  argTypes: {
    intent: {
      options: ["primary", "secondary"],
      control: { type: "inline-radio" },
    },
    onClick: { action: "click" },
  },
}

type Story = StoryObj<typeof IconButton>

export const Default: Story = {
  render: (args) => <IconButton {...args} />,
}

export const Primary: Story = {}

export const Secondary: Story = {
  args: { intent: "secondary" },
}

export default meta
