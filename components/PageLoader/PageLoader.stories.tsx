import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import PageLoader from "./PageLoader";
import { Button } from "../Button/Button";

const meta: Meta<typeof PageLoader> = {
  component: PageLoader,
  title: "Components/PageLoader",
  parameters: { layout: "fullscreen" },
  argTypes: {},
  decorators: [
    (Story) => (
      <div className="h-screen w-screen">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof PageLoader>;

export const Default: Story = {
  render: () => {
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
      const t = setTimeout(() => setLoading(false), 1500);
      return () => clearTimeout(t);
    }, []);

    return (
      <PageLoader loading={loading}>
        <div className="flex h-screen flex-col items-center justify-center gap-4 p-8]">
          <h1 className="text-3xl font-semibold text-white max-w-[302px] text-center">Welcome to Framer University!</h1>
          <Button size="md">Continue</Button>
        </div>
      </PageLoader>
    );
  },
};


