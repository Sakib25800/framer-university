import type { Meta, StoryObj } from "@storybook/react"
import { Quote } from "./Quote"

const meta: Meta<typeof Quote> = {
  title: "Quote",
  component: Quote,
  tags: ["autodocs"],
}

type Story = StoryObj<typeof Quote>

export const Default: Story = {
  render: (args) => (
    <Quote {...args}>
      <p>
        Hundreds of creators mastered <strong>template development</strong> and <strong>freelancing</strong> through Framer University courses.
      </p>
      <p>
        Be ready to join the community of designers who turned their Framer expertise into passive income streams.
      </p>
    </Quote>
  ),
}

export const SingleParagraph: Story = {
  render: (args) => (
    <Quote {...args}>
      <p>
        This is a single paragraph quote with <strong>highlighted text</strong> for emphasis.
      </p>
    </Quote>
  ),
}

export const LongContent: Story = {
  render: (args) => (
    <Quote {...args}>
      <p>
        Framer University has helped thousands of designers and developers learn the skills they need to build amazing websites and applications.
      </p>
      <p>
        Our comprehensive courses cover everything from <strong>basic design principles</strong> to <strong>advanced prototyping techniques</strong>.
      </p>
      <p>
        Join our community and start building the future of web design today.
      </p>
    </Quote>
  ),
}

export default meta
