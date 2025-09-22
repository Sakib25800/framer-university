import { render, screen } from "@testing-library/react"
import { userEvent } from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { Button } from "./Button"

describe("Button", () => {
  it("renders with children", () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText("Click me")).toBeInTheDocument()
  })

  it("applies correct primary intent classes", () => {
    const { container } = render(<Button intent="primary">Primary Button</Button>)
    const button = container.querySelector("button")
    expect(button).toHaveClass("bg-white")
    expect(button).toHaveClass("!text-black")
  })

  it("applies correct outline intent classes", () => {
    const { container } = render(<Button intent="outline">Outline Button</Button>)
    const button = container.querySelector("button")
    expect(button).toHaveClass("border")
    expect(button).toHaveClass("border-primary-400")
  })

  it("applies correct small size classes", () => {
    const { container } = render(<Button size="sm">Small Button</Button>)
    const button = container.querySelector("button")
    expect(button).toHaveClass("text-base")
    expect(button).toHaveClass("px-4")
    expect(button).toHaveClass("py-[7px]")
  })

  it("applies correct medium size classes", () => {
    const { container } = render(<Button size="md">Medium Button</Button>)
    const button = container.querySelector("button")
    expect(button).toHaveClass("text-body")
    expect(button).toHaveClass("px-5")
    expect(button).toHaveClass("py-2.5")
  })

  it("applies correct large size classes", () => {
    const { container } = render(<Button size="lg">Large Button</Button>)
    const button = container.querySelector("button")
    expect(button).toHaveClass("text-body-l")
    expect(button).toHaveClass("px-[26px]")
    expect(button).toHaveClass("py-[15px]")
  })

  it("calls onClick handler when clicked", async () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click me</Button>)

    const user = userEvent.setup()
    await user.click(screen.getByText("Click me"))

    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it("doesn't call onClick when disabled", async () => {
    const handleClick = vi.fn()
    render(
      <Button onClick={handleClick} disabled>
        Click me
      </Button>
    )

    const user = userEvent.setup()
    await user.click(screen.getByText("Click me"))

    expect(handleClick).not.toHaveBeenCalled()
  })

  it("renders with disabled attribute when disabled", () => {
    render(<Button disabled>Disabled Button</Button>)

    const button = screen.getByText("Disabled Button")
    expect(button).toBeDisabled()
  })

  it("applies custom className", () => {
    const { container } = render(<Button className="test-class">Custom Class Button</Button>)
    const button = container.querySelector("button")
    expect(button).toHaveClass("test-class")
  })

  it("renders with correct button type", () => {
    render(<Button type="submit">Submit Button</Button>)

    const button = screen.getByText("Submit Button")
    expect(button).toHaveAttribute("type", "submit")
  })

  it("uses default variants when none provided", () => {
    const { container } = render(<Button>Default Button</Button>)

    const button = container.querySelector("button")
    // Check default intent (primary)
    expect(button).toHaveClass("bg-white")
    expect(button).toHaveClass("!text-black")

    // Check default size (lg)
    expect(button).toHaveClass("text-body-l")
    expect(button).toHaveClass("px-[26px]")
    expect(button).toHaveClass("py-[15px]")
  })
})
