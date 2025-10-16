import type { Preview } from "@storybook/react"
import "../styles/tailwind.css"

const preview: Preview = {
  parameters: {
    layout: "centered",
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/
      }
    },
    backgrounds: {
      default: "dark",
      values: [
        {
          name: "dark",
          value: "#1D1D1D"
        }
      ],
      disable: false,
      grid: {
        disable: true
      }
    }
  },
  globalTypes: {
    backgrounds: {
      defaultValue: "dark"
    }
  }
}

export default preview
