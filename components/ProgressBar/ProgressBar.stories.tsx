import type { Meta, StoryObj } from "@storybook/react";
import { ProgressBar } from "./ProgressBar";

const meta: Meta<typeof ProgressBar> = {
  title: "ProgressBar",
  component: ProgressBar,
  tags: ["autodocs"],
  args: {
    value: 42,
  },
  argTypes: {
    value: { control: { type: "range", min: 0, max: 100, step: 1 } },
    color: { control: { type: "inline-radio" }, options: ["white", "accent"] },
    ariaLabel: { control: { type: "text" } },
  },
};

export default meta;
type Story = StoryObj<typeof ProgressBar>;

export const Default: Story = {
  render: (args) => (
    <div className="w-[340px]">
      <ProgressBar {...args} />
    </div>
  ),
};

export const Accent: Story = {
  args: { value: 60, color: "accent" },
  render: (args) => (
    <div className="w-[340px]">
      <ProgressBar {...args} />
    </div>
  ),
};



