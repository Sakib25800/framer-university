import type { Meta, StoryObj } from "@storybook/react"
import * as React from "react"
import { TextShimmer } from "./TextShimmer"

const meta: Meta<typeof TextShimmer> = {
  title: "TextShimmer",
  component: TextShimmer,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: { component: "Animated shimmering text for loading states." },
    },
  },
  args: {
    content: "Uploading...",
    color: "#FFFFFF1A",
    shimmer: "#ffffff",
    size: 30,
    speed: 5,
    rotation: 90,
    delay: 0,
    tag: "p",
    direction: "right",
    style: { fontSize: 18 },
  },
  argTypes: {
    direction: {
      options: ["left", "right"],
      control: { type: "select" },
    },
    tag: {
      options: ["h1", "h2", "h3", "p"],
      control: { type: "select" },
    },
  },
}

type Story = StoryObj<typeof TextShimmer>

export const Default: Story = {
  render: (args) => (
      <TextShimmer {...args} />
  ),
}


export default meta


