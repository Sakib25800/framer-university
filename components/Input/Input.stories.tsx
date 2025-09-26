import type { Meta, StoryObj } from "@storybook/react"
import { Input } from "./Input"

const meta: Meta<typeof Input> = {
  title: "Input",
  component: Input,
  tags: ["autodocs"],
  args: {
    placeholder: "Enter text",
    disabled: false,
    readOnly: false,
    required: false,
  },
  argTypes: {
    disabled: { control: { type: "boolean" } },
    readOnly: { control: { type: "boolean" } },
    required: { control: { type: "boolean" } },
    type: {
      control: { type: "select" },
      options: [
        "text",
        "email",
        "password",
        "number",
        "search",
        "tel",
        "url",
      ],
    },
    onChange: { action: "change" },
    onBlur: { action: "blur" },
    onFocus: { action: "focus" },
  },
}

export default meta
type Story = StoryObj<typeof Input>

export const Default: Story = {
  render: (args) => (
    <div className="w-[340px]">
      <Input {...args} className="w-[340px]" />
    </div>
  ),
}

export const WithValue: Story = {
  args: { value: "Hello world" },
  render: (args) => (
    <div className="w-[340px]">
      <Input {...args} className="w-[340px]" />
    </div>
  ),
}

