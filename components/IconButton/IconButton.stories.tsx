import type { Meta, StoryObj } from "@storybook/react"
import Close from "@/components/icons/close.svg"
import { IconButton } from "./IconButton"

const meta: Meta<typeof IconButton> = {
  title: "IconButton",
  component: IconButton,
  args: {
    intent: "primary",
    children: <Close />,
  },
  argTypes: {
    intent: {
      options: ["primary", "secondary"],
      control: { type: "select" },
    },
  },
}

type Story = StoryObj<typeof IconButton>

export const Default: Story = {
  render: (args) => <IconButton {...args} />,
}

export default meta
