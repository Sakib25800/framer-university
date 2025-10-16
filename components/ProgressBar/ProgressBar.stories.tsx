import type { Meta, StoryObj } from "@storybook/react"
import Close from "@/components/icons/close.svg"
import { ProgressBar } from "./ProgressBar"
import { IconButton } from "../IconButton/IconButton"
import { Tooltip } from "../Tooltip/Tooltip"

const meta: Meta<typeof ProgressBar> = {
  title: "Progress Bar",
  component: ProgressBar,
  tags: ["autodocs"],
  args: {
    value: 42,
    intent: "default"
  },
  argTypes: {
    value: { control: { type: "range", min: 0, max: 100, step: 1 } },
    intent: { control: { type: "inline-radio" }, options: ["default", "info"] },
    showPercentage: { control: { type: "boolean" } },
    ariaLabel: { control: { type: "text" } }
  }
}

export default meta
type Story = StoryObj<typeof ProgressBar>

export const Percentage: Story = {
  args: { value: 25, showPercentage: true },
  render: (args) => (
    <div className="w-[340px]">
      <ProgressBar {...args} />
    </div>
  )
}

export const Info: Story = {
  render: () => (
    <div className="w-[340px]">
      <ProgressBar intent="info" title="Building a Personal Website" dayLabel="Day 24" />
    </div>
  )
}

export const Action: Story = {
  render: (args) => (
    <div className="w-[340px]">
      <div className="flex items-center gap-2">
        <Tooltip explainer="Quit lesson" side="bottom" shortcut="ESC">
          <IconButton intent="primary">
            <Close />
          </IconButton>
        </Tooltip>
        <div className="flex-1">
          <ProgressBar {...args} />
        </div>
      </div>
    </div>
  ),
  args: { value: 42 }
}
