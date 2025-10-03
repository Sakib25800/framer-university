import { expect, test } from "@playwright/test"

test.describe("Account Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/account")
  })

  test("has sign out button", async ({ page }) => {
    await expect(page.getByRole("button", { name: "Sign out" })).toBeVisible()
  })
})
