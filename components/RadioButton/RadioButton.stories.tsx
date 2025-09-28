import type { Meta, StoryObj } from "@storybook/react"
import React from "react"
import { RadioButton } from "./RadioButton"

const meta: Meta<typeof RadioButton> = {
  title: "Radio Button",
  component: RadioButton,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "A radio button component with a single fixed size (268px width).",
      },
    },
  },
  args: {
    label: "X (Twitter)",
    name: "example",
    value: "twitter",
    checked: false,
    disabled: false,
  },
  argTypes: {
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
  render: (args) => <RadioButton {...args} className="w-[268px]" />,
}

export const Checked: Story = {
  args: { checked: true, label: "Checked option" },
  render: (args) => <RadioButton {...args} className="w-[268px]" />,
}

export const Disabled: Story = {
  args: { disabled: true, label: "Disabled option" },
  render: (args) => <RadioButton {...args} className="w-[268px]" />,
}

export const RadioGroup: Story = {
  render: (args) => {
    const [selected, setSelected] = React.useState<string>("customizing")

    return (
      <div className="mx-auto flex w-[552px] flex-col gap-4">
        <RadioButton
          {...args}
          label="Customizing a template I bought"
          name="goals"
          value="customizing"
          checked={selected === "customizing"}
          onChange={(e) => setSelected(e.target.value)}
          className="w-full"
        />
        <RadioButton
          {...args}
          label="Building my first website"
          name="goals"
          value="building"
          checked={selected === "building"}
          onChange={(e) => setSelected(e.target.value)}
          className="w-full"
        />
        <RadioButton
          {...args}
          label="Leveling up my Framer skills"
          name="goals"
          value="levelling"
          checked={selected === "levelling"}
          onChange={(e) => setSelected(e.target.value)}
          className="w-full"
        />
        <RadioButton
          {...args}
          label="Launching a website for my business"
          name="goals"
          value="launching"
          checked={selected === "launching"}
          onChange={(e) => setSelected(e.target.value)}
          className="w-full"
        />
        <RadioButton
          {...args}
          label="Making money with Framer"
          name="goals"
          value="making-money"
          checked={selected === "making-money"}
          onChange={(e) => setSelected(e.target.value)}
          className="w-full"
        />
        <RadioButton
          {...args}
          label="Something else"
          name="goals"
          value="something-else"
          checked={selected === "something-else"}
          onChange={(e) => setSelected(e.target.value)}
          className="w-full"
        />
      </div>
    )
  },
}

export default meta
