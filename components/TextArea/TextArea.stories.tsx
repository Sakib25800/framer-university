import type { Meta, StoryObj } from "@storybook/react"
import { TextArea } from "./TextArea"

const meta: Meta<typeof TextArea> = {
  title: "Text Area",
  component: TextArea,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A versatile textarea component with default and outline variants, supporting various states and configurations."
      }
    }
  },
  args: {
    placeholder: "What's on your mind?",
    rows: 4,
    disabled: false,
    readOnly: false,
    required: false
  },
  argTypes: {
    disabled: {
      control: { type: "boolean" },
      description: "Whether the textarea is disabled"
    },
    readOnly: {
      control: { type: "boolean" },
      description: "Whether the textarea is read-only"
    },
    required: {
      control: { type: "boolean" },
      description: "Whether the textarea is required"
    },
    rows: {
      control: { type: "number", min: 1, max: 20 },
      description: "Number of visible text lines"
    },
    maxLength: {
      control: { type: "number", min: 1, max: 1000 },
      description: "Maximum number of characters"
    },
    placeholder: {
      control: { type: "text" },
      description: "Placeholder text"
    },
    value: {
      control: { type: "text" },
      description: "Controlled value"
    },
    onChange: { action: "change" },
    onBlur: { action: "blur" },
    onFocus: { action: "focus" }
  }
}

type Story = StoryObj<typeof TextArea>

export const Default: Story = {
  render: (args) => (
    <div className="w-[340px]">
      <TextArea {...args} className="w-[340px]" />
    </div>
  )
}

export const WithValue: Story = {
  args: {
    value: "This is some sample text content that demonstrates how the textarea looks with actual content.",
    placeholder: "Enter your message..."
  },
  render: (args) => (
    <div className="w-[340px]">
      <TextArea {...args} className="w-[340px]" />
    </div>
  )
}

export const Disabled: Story = {
  args: {
    disabled: true,
    value: "This textarea is disabled",
    placeholder: "Disabled textarea..."
  },
  render: (args) => (
    <div className="w-[340px]">
      <TextArea {...args} className="w-[340px]" />
    </div>
  )
}

export const ReadOnly: Story = {
  args: {
    readOnly: true,
    value: "This textarea is read-only and cannot be edited.",
    placeholder: "Read-only textarea..."
  },
  render: (args) => (
    <div className="w-[340px]">
      <TextArea {...args} className="w-[340px]" />
    </div>
  )
}

export const WithMaxLength: Story = {
  args: {
    maxLength: 100,
    placeholder: "Maximum 100 characters allowed..."
  },
  render: (args) => (
    <div className="w-[340px]">
      <TextArea {...args} className="w-[340px]" />
    </div>
  )
}

export const DifferentSizes: Story = {
  render: (args) => (
    <div className="w-[340px]">
      <div className="space-y-4">
        <div>
          <label className="mb-2 block text-sm text-white">Small (2 rows)</label>
          <TextArea {...args} rows={2} placeholder="Small textarea..." className="w-[340px]" />
        </div>
        <div>
          <label className="mb-2 block text-sm text-white">Medium (4 rows)</label>
          <TextArea {...args} rows={4} placeholder="Medium textarea..." className="w-[340px]" />
        </div>
        <div>
          <label className="mb-2 block text-sm text-white">Large (8 rows)</label>
          <TextArea {...args} rows={8} placeholder="Large textarea..." className="w-[340px]" />
        </div>
      </div>
    </div>
  )
}

export const WithLabel: Story = {
  render: (args) => (
    <div className="w-[340px]">
      <div className="space-y-4">
        <div>
          <label className="mb-2 block text-sm text-white">Your Message</label>
          <TextArea {...args} placeholder="Enter your message..." className="w-[340px]" />
        </div>
      </div>
    </div>
  )
}

export default meta
