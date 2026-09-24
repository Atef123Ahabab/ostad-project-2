class SearchPage {
  constructor(page) {
    this.page = page;
    this.searchInput = page.locator('#small-searchterms');
    this.searchButton = page.locator('input.search-box-button');
    this.productItems = page.locator('.product-item');
  }

  async searchProduct(productName) {
    await this.searchInput.waitFor({ state: 'visible', timeout: 10000 });
    await this.searchInput.fill(productName);
    await this.searchButton.click();
    await this.page.waitForURL(/search/, { timeout: 15000 });
    await this.productItems.first().waitFor({ state: 'visible', timeout: 15000 });
  }

  async getFirstProductTitle() {
    return await this.productItems.first().locator('h2 a').textContent();
  }

  async openFirstProduct() {
    await this.productItems.first().locator('h2 a').click();
    await this.page.waitForLoadState('networkidle');
  }
}
module.exports = { SearchPage };
