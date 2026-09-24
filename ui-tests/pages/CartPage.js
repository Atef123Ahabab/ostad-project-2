class CartPage {
  constructor(page) {
    this.page = page;
    this.cartItems = page.locator('.cart-item-row');
    this.termsCheckbox = page.locator('#termsofservice');
    this.checkoutButton = page.locator('#checkout');
    this.productName = page.locator('.cart-item-row .product-name');
    this.quantity = page.locator('.cart-item-row .qty-input');
  }

  async getProductName() {
    return await this.productName.first().textContent();
  }

  async getQuantity() {
    return await this.quantity.first().inputValue();
  }

  async agreeAndCheckout() {
    await this.termsCheckbox.check();
    await this.checkoutButton.click();
  }
}
module.exports = { CartPage };
