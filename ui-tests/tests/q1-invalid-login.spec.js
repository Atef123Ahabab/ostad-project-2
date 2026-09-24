const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const testData = require('../fixtures/testData.json');

test('Q1: Invalid Login - Error message displayed', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.navigate();
  await loginPage.login(testData.invalidUser.email, testData.invalidUser.password);

  await expect(loginPage.errorMessage).toBeVisible();
  const errorText = await loginPage.getErrorMessage();
  expect(errorText).toContain('Login was unsuccessful');

  const logoutLink = page.locator('a.ico-logout');
  await expect(logoutLink).not.toBeVisible();

  const screenshot = await page.screenshot({ fullPage: true });
  await test.info().attach('Invalid Login Screenshot', {
    body: screenshot,
    contentType: 'image/png',
  });
});
