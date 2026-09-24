class ProductPage {
  constructor(page) {
    this.page = page;
    this.quantityInput = page.locator('input.qty-input').first();
    this.addToCartButton = page.locator('input.add-to-cart-button').first();
    this.notification = page.locator('#bar-notification');
    this.productName = page.locator('.product-name h1');
  }

  async setQuantity(qty) {
    await this.quantityInput.fill(qty.toString());
  }

  async addToCart() {
    await this.addToCartButton.click();
    await this.notification.waitFor({ state: 'visible', timeout: 10000 });
  }

  async goToCart() {
    await this.page.goto('https://demowebshop.tricentis.com/cart');
    await this.page.waitForLoadState('networkidle');
  }
}
module.exports = { ProductPage };
