import type { Meta, StoryObj } from "@storybook/react";
import { Loader } from "./Loader";

const meta: Meta<typeof Loader> = {
	component: Loader,
	title: "Loader",
	tags: ["autodocs"],
	parameters: { layout: "fullscreen" },
	argTypes: {
		size: { control: { type: "number", min: 24, max: 160, step: 4 } },
	},
	decorators: [
		(Story) => (
			<div className="flex h-screen items-center justify-center">
				<Story />
			</div>
		),
	],
};

export default meta;
type Story = StoryObj<typeof Loader>;

export const Default: Story = {
	args: {
		size: 56,
	},
};


