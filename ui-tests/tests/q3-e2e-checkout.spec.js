const { test, expect } = require('@playwright/test');
const { RegisterPage } = require('../pages/RegisterPage');
const { LoginPage } = require('../pages/LoginPage');
const { SearchPage } = require('../pages/SearchPage');
const { ProductPage } = require('../pages/ProductPage');
const { CartPage } = require('../pages/CartPage');
const { CheckoutPage } = require('../pages/CheckoutPage');
const testData = require('../fixtures/testData.json');

test('Q3: E2E - Search, Add to Cart, Checkout, Order Confirmation', async ({ page }) => {
  const uniqueEmail = `e2e${Date.now()}@test.com`;
  const registerPage = new RegisterPage(page);
  const loginPage = new LoginPage(page);
  const searchPage = new SearchPage(page);
  const productPage = new ProductPage(page);
  const cartPage = new CartPage(page);
  const checkoutPage = new CheckoutPage(page);

  // 1. Register
  await registerPage.navigate();
  await registerPage.register({ ...testData.newUser, email: uniqueEmail });
  const successMsg = await registerPage.getSuccessMessage();
  expect(successMsg).toContain('Your registration completed');
  console.log('✓ Registered:', uniqueEmail);

  // 2. Login
  await loginPage.navigate();
  await loginPage.loginAndWait(uniqueEmail, testData.newUser.password);
  console.log('✓ Logged in');

  // 3. Search
  await searchPage.searchProduct(testData.product.name);
  const resultTitle = await searchPage.getFirstProductTitle();
  expect(resultTitle).toContain(testData.product.name);
  console.log('✓ Search result:', resultTitle);

  // 4. Add to cart
  await searchPage.openFirstProduct();
  await productPage.setQuantity(testData.product.quantity);
  await productPage.addToCart();
  console.log('✓ Added to cart with qty', testData.product.quantity);

  // 5. Cart
  await productPage.goToCart();
  await expect(cartPage.productName.first()).toBeVisible({ timeout: 15000 });
  const cartQty = await cartPage.getQuantity();
  expect(cartQty).toBe(testData.product.quantity.toString());
  console.log('✓ Cart qty:', cartQty);

  // 6. Checkout
  await cartPage.agreeAndCheckout();
  await page.waitForURL(/checkout/, { timeout: 15000 });
  console.log('✓ On checkout page:', page.url());

  // 7. Complete checkout (handles one-page dynamic flow)
  await checkoutPage.completeCheckout();

  // 8. Confirm
  await expect(
    page.locator('.title').filter({ hasText: /successfully processed/i })
  ).toBeVisible({ timeout: 20000 });
  console.log('✓ Order confirmed');

  // 9. Order details
  await checkoutPage.viewOrderDetails();
  await expect(page.locator('.order-number')).toBeVisible({ timeout: 15000 });
  const orderNum = await page.locator('.order-number').textContent();
  console.log('✓ Order number:', orderNum.trim());

  // Screenshot
  const screenshot = await page.screenshot({ fullPage: true });
  await test.info().attach('Order Confirmation', {
    body: screenshot,
    contentType: 'image/png',
  });
});
