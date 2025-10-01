import { expect, test } from "@playwright/test"

test.describe("Landing Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/")
  })

  test("has correct page title", async ({ page }) => {
    await expect(page).toHaveTitle("Framer University")
  })

  test("displays TV image", async ({ page }) => {
    const image = page.locator('img[alt="Retro TV with color bars"]')
    await expect(image).toBeVisible()
    await expect(image).toHaveAttribute("src", /TV\.png/)
  })

  test("displays main heading text", async ({ page }) => {
    const heading = page.locator("h1")
    await expect(heading).toBeVisible()
    await expect(heading).toContainText("You're gonna want")
    await expect(heading).toContainText("to see this.")
  })

  test("displays subheading text", async ({ page }) => {
    const subheading = page.getByText("And you're probably not prepared…")
    await expect(subheading).toBeVisible()
  })

  test("displays join waitlist button", async ({ page }) => {
    const button = page.getByRole("link", { name: /join waitlist/i })
    await expect(button).toBeVisible()
    await expect(button).toHaveAttribute("href", "https://framer.university/waitlist")
  })
})
