import type { Meta, StoryObj } from "@storybook/react"
import { GoogleButton } from "./GoogleButton"

const meta: Meta<typeof GoogleButton> = {
  title: "GoogleButton",
  component: GoogleButton,
  args: {
    children: "Continue with Google",
    className: "w-[400px]",
  },
  argTypes: {
    children: {
      control: { type: "text" },
    },
  },
}

type Story = StoryObj<typeof GoogleButton>

export const ContinueWithGoogle: Story = {
  args: {
    children: "Continue with Google",
  },
}

export const LoginWithGoogle: Story = {
  args: {
    children: "Login with Google",
  },
}

export default meta


