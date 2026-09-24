const { test, expect } = require('@playwright/test');
const { RegisterPage } = require('../pages/RegisterPage');
const { LoginPage } = require('../pages/LoginPage');
const { SearchPage } = require('../pages/SearchPage');
const { ProductPage } = require('../pages/ProductPage');
const { CartPage } = require('../pages/CartPage');
const testData = require('../fixtures/testData.json');

test('Q2: Register + Add Product to Cart', async ({ page }) => {
  const uniqueEmail = `johndoe${Date.now()}@test.com`;
  const registerPage = new RegisterPage(page);
  const loginPage = new LoginPage(page);
  const searchPage = new SearchPage(page);
  const productPage = new ProductPage(page);
  const cartPage = new CartPage(page);

  // 1. Register
  await registerPage.navigate();
  await registerPage.register({ ...testData.newUser, email: uniqueEmail });
  const successMsg = await registerPage.getSuccessMessage();
  expect(successMsg).toContain('Your registration completed');
  console.log('✓ Registered:', uniqueEmail);

  // 2. Login (waits for logout link)
  await loginPage.navigate();
  await loginPage.loginAndWait(uniqueEmail, testData.newUser.password);
  console.log('✓ Logged in');

  // 3. Search
  await searchPage.searchProduct(testData.product.name);
  const resultTitle = await searchPage.getFirstProductTitle();
  expect(resultTitle).toContain(testData.product.name);
  console.log('✓ Search result:', resultTitle);

  // 4. Open product + add to cart
  await searchPage.openFirstProduct();
  await productPage.setQuantity(1);
  await productPage.addToCart();
  console.log('✓ Added to cart');

  // 5. Go to cart
  await productPage.goToCart();
  console.log('✓ On cart page:', page.url());

  // 6. Verify
  await expect(cartPage.productName.first()).toBeVisible({ timeout: 15000 });
  const cartProduct = await cartPage.getProductName();
  const cartQty = await cartPage.getQuantity();
  console.log('✓ Cart contains:', cartProduct.trim(), '| Qty:', cartQty);
  expect(cartProduct).toContain(testData.product.name);
  expect(cartQty).toBe('1');

  // Screenshot
  const screenshot = await page.screenshot({ fullPage: true });
  await test.info().attach('Cart Verification', {
    body: screenshot,
    contentType: 'image/png',
  });
});
