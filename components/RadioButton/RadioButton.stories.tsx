import type { Meta, StoryObj } from "@storybook/react"
import React from "react"
import { RadioButton } from "./RadioButton"

const meta: Meta<typeof RadioButton> = {
  title: "RadioButton",
  component: RadioButton,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A radio button component with three sizes and support for labels.",
      },
    },
  },
  args: {
    size: "md",
    label: "Option 1",
    name: "example",
    value: "option1",
    checked: false,
    disabled: false,
  },
  argTypes: {
    size: {
      options: ["sm", "md", "lg"],
      control: { type: "select" },
      description: "Radio button size",
    },
    label: {
      control: { type: "text" },
      description: "Label text for the radio button",
    },
    name: {
      control: { type: "text" },
      description: "Name attribute for grouping radio buttons",
    },
    value: {
      control: { type: "text" },
      description: "Value attribute for the radio button",
    },
    checked: {
      control: { type: "boolean" },
      description: "Whether the radio button is checked",
    },
    disabled: {
      control: { type: "boolean" },
      description: "Whether the radio button is disabled",
    },
    onChange: { action: "change" },
  },
}

type Story = StoryObj<typeof RadioButton>

export const Default: Story = {
  render: (args) => <RadioButton {...args} />,
}

export const Checked: Story = {
  args: { checked: true, label: "Checked option" },
}

export const Disabled: Story = {
  args: { disabled: true, label: "Disabled option" },
}

export const Sizes: Story = {
  render: (args) => {
    const [selectedSize, setSelectedSize] = React.useState<string>("md")
    
    return (
      <div className="flex flex-col gap-3">
        <RadioButton 
          {...args} 
          size="sm" 
          label="Small option" 
          name="sizes"
          value="sm"
          checked={selectedSize === "sm"}
          onChange={(e) => setSelectedSize(e.target.value)}
        />
        <RadioButton 
          {...args} 
          size="md" 
          label="Medium option" 
          name="sizes"
          value="md"
          checked={selectedSize === "md"}
          onChange={(e) => setSelectedSize(e.target.value)}
        />
        <RadioButton 
          {...args} 
          size="lg" 
          label="Large option" 
          name="sizes"
          value="lg"
          checked={selectedSize === "lg"}
          onChange={(e) => setSelectedSize(e.target.value)}
        />
      </div>
    )
  },
}

export const RadioGroup: Story = {
  render: (args) => (
    <div className="flex flex-col gap-2">
      <RadioButton {...args} value="option1" label="Option 1" />
      <RadioButton {...args} value="option2" label="Option 2" />
      <RadioButton {...args} value="option3" label="Option 3" />
    </div>
  ),
}

export default meta
