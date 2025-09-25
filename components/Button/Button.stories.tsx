import type { Meta, StoryObj } from "@storybook/react"
import { Button } from "./Button"

const meta: Meta<typeof Button> = {
  title: "Button",
  component: Button,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A versatile button supporting primary, outline, and link intents with three sizes.",
      },
    },
  },
  args: {
    intent: "primary",
    children: "Continue",
    size: "lg",
    disabled: false,
  },
  argTypes: {
    intent: {
      options: ["primary", "outline", "link"],
      control: { type: "inline-radio" },
      description: "Visual intent of the button",
    },
    size: {
      options: ["sm", "md", "lg"],
      control: { type: "select" },
      description: "Button size",
    },
    disabled: { control: { type: "boolean" } },
    onClick: { action: "click" },
  },
}

type Story = StoryObj<typeof Button>

export const Default: Story = {
  render: (args) => <Button {...args} />,
}

export const Primary: Story = {
  args: { intent: "primary", children: "Primary" },
}

export const Outline: Story = {
  args: { intent: "outline", children: "Outline" },
}

export const Link: Story = {
  args: { intent: "link", children: "Learn more" },
}

export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-center gap-3">
      <Button {...args} size="sm">Small</Button>
      <Button {...args} size="md">Medium</Button>
      <Button {...args} size="lg">Large</Button>
    </div>
  ),
}

export const Disabled: Story = {
  args: { disabled: true, children: "Disabled" },
}

export default meta
