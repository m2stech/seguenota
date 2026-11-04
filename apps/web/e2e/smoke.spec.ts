import { test, expect } from "@playwright/test";

test("a home carrega", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/create next app/i);
});
