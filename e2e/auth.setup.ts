import { test as setup } from "@playwright/test"
import { execSync } from "child_process"
import path from "path"
import { getLoginLink, waitForNewLink } from "./utils/mail"

const authFile = path.join(__dirname, "../playwright/.auth/user.json")

setup("authenticate", async ({ page }) => {
  execSync("supabase db reset")
  const email = "user1@test.com"
  const oldLink = await getLoginLink(email)
  await page.goto("/sign-up")
  await page.locator('input[name="email"]').fill(email)
  await page.locator('input[name="firstName"]').fill("user1")
  await page.locator('input[name="lastName"]').fill("test")
  await page.getByRole("button", { name: "Create account" }).click()
  await page.waitForURL("/magic-link?email=user1@test.com")

  const link = await waitForNewLink(oldLink, email)
  await page.goto(link)
  await page.waitForURL("/onboarding")
  await page.context().storageState({ path: authFile })
})
