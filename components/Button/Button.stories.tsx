import type { Meta, StoryObj } from "@storybook/react"
import { Button } from "./Button"

const meta: Meta<typeof Button> = {
  title: "Button",
  component: Button,
  tags: ["autodocs"],
  args: {
    variant: "primary",
    children: "Continue",
    size: "lg",
    disabled: false,
  },
  argTypes: {
    variant: {
      options: ["primary", "outline", "link"],
      control: { type: "select" },
    },
    size: {
      options: ["sm", "md", "lg"],
      control: { type: "inline-radio" },
      description: "Button size",
    },
    direction: {
      options: ["left", "right"],
      control: { type: "inline-radio" },
      description: "Icon direction for link variant",
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
  args: { variant: "primary", children: "Primary" },
}

export const Outline: Story = {
  args: { variant: "outline", children: "Outline" },
}

export const Link: Story = {
  args: { variant: "link", children: "Continue" },
}

export const LinkWithLeftIcon: Story = {
  args: { variant: "link", children: "Back", direction: "left" },
}

export const LinkIconDirections: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Button variant="link" direction="left">
        Back
      </Button>
      <Button variant="link" direction="right">
        Continue
      </Button>
    </div>
  ),
}

export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-center gap-3">
      <Button {...args} size="sm">
        Small
      </Button>
      <Button {...args} size="md">
        Medium
      </Button>
      <Button {...args} size="lg">
        Large
      </Button>
    </div>
  ),
}

export default meta
