import { expect, test as setup } from "@playwright/test"
import path from "path"
import { getOnboardingResponse } from "./utils/supabase"

const authFile = path.join(__dirname, "../playwright/.auth/user.json")

setup("onboarding", async ({ page }) => {
  const email = "user1@test.com"

  // Navigate to onboarding
  await page.goto("/onboarding")
  await expect(page).toHaveURL("/onboarding")

  // Step 0 - Welcome step, just continue
  await page.getByRole("button", { name: "Continue" }).click()
  await expect(page).toHaveURL("/onboarding?step=1")

  // Step 1 - Where did you hear about Framer University?
  const source = "YouTube"
  await page.getByText(source, { exact: true }).click()
  await page.getByRole("button", { name: "Continue" }).click()
  await expect(page).toHaveURL("/onboarding?step=2")

  // Step 2 - What is your top goal?
  const goal = "Building my first website"
  await page.getByText(goal, { exact: true }).click()
  await page.getByRole("button", { name: "Continue" }).click()
  await expect(page).toHaveURL("/onboarding?step=3")

  // Step 3 - Intermediate step, just continue
  await page.getByRole("button", { name: "Continue" }).click()
  await expect(page).toHaveURL("/onboarding?step=4")

  // Step 4 - What's your experience with Framer?
  const experience = "1" // Just started
  await page.getByText("Just started", { exact: true }).click()
  await page.getByRole("button", { name: "Continue" }).click()
  await expect(page).toHaveURL("/onboarding?step=5")

  // Step 5 - Final step, submit
  await page.getByRole("button", { name: "Let's go" }).click()

  // Wait for redirect after submission (adjust URL based on your app's behavior)
  await page.waitForURL("/account")

  // Verify the onboarding response was saved to the database
  const onboardingResponse = await getOnboardingResponse(email)

  expect(onboardingResponse).toBeTruthy()
  expect(onboardingResponse.source).toBe(source)
  expect(onboardingResponse.goal).toBe(goal)
  expect(onboardingResponse.experience).toBe(experience)
  expect(onboardingResponse.completed_at).toBeTruthy()
  expect(onboardingResponse.user_id).toBeTruthy()

  // Save the storage state after onboarding
  await page.context().storageState({ path: authFile })
})
