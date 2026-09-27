class CheckoutPage {
  constructor(page) {
    this.page = page;
  }

  async fillBillingAddress() {
    const country = this.page.locator('#BillingNewAddress_CountryId');
    if (!(await country.isVisible().catch(() => false))) {
      console.log('⏭ Billing form not visible — using existing address');
      return;
    }

    await country.selectOption({ label: 'United States' });
    console.log('✓ Billing: selected country');

    await this.page.waitForTimeout(1500);

    const state = this.page.locator('#BillingNewAddress_StateProvinceId');
    const options = await state.locator('option').all();
    for (const opt of options) {
      const val = await opt.getAttribute('value');
      if (val && val !== '0' && val !== '') {
        await state.selectOption(val);
        console.log(`✓ Billing: selected state (value=${val})`);
        break;
      }
    }

    await this.page.locator('#BillingNewAddress_City').fill('New York');
    await this.page.locator('#BillingNewAddress_Address1').fill('123 Main Street');
    await this.page.locator('#BillingNewAddress_ZipPostalCode').fill('10001');
    await this.page.locator('#BillingNewAddress_PhoneNumber').fill('1234567890');
    console.log('✓ Billing: filled city, address, zip, phone');
  }

  // Robust: try all containers, wait for visible+enabled, scroll into view, click
  async clickAnyVisibleContinue() {
    const containers = [
      'billing-buttons-container',
      'shipping-buttons-container',
      'shipping-method-buttons-container',
      'payment-method-buttons-container',
      'payment-info-buttons-container',
      'confirm-order-buttons-container',
    ];

    for (const c of containers) {
      const btn = this.page.locator(`#${c} input.button-1`);
      try {
        const visible = await btn.isVisible().catch(() => false);
        if (!visible) continue;

        // Wait up to 15s for it to become enabled (AJAX might be in progress)
        await btn.waitFor({ state: 'visible', timeout: 5000 });
        await this.page.waitForFunction(
          (sel) => {
            const el = document.querySelector(sel);
            return el && !el.disabled;
          },
          `#${c} input.button-1`,
          { timeout: 15000 }
        );

        await btn.scrollIntoViewIfNeeded();
        await btn.click({ timeout: 10000 });
        console.log(`✓ Clicked continue in #${c}`);
        await this.page.waitForTimeout(1500);
        return c;
      } catch (e) {
        // try next container
      }
    }
    return null;
  }

  async completeCheckout() {
    await this.fillBillingAddress();

    const maxSteps = 15;
    for (let i = 1; i <= maxSteps; i++) {
      // Check if confirmation page appeared
      const confirmed = await this.page
        .locator('.title')
        .filter({ hasText: /successfully processed/i })
        .isVisible()
        .catch(() => false);
      if (confirmed) {
        console.log('✓ Reached order confirmation');
        return;
      }

      // Fill shipping address if present (some flows require it)
      const shippingCountry = this.page.locator('#ShippingNewAddress_CountryId');
      if (await shippingCountry.isVisible().catch(() => false)) {
        await shippingCountry.selectOption({ label: 'United States' });
        await this.page.waitForTimeout(1500);
        const shipState = this.page.locator('#ShippingNewAddress_StateProvinceId');
        const opts = await shipState.locator('option').all();
        for (const opt of opts) {
          const val = await opt.getAttribute('value');
          if (val && val !== '0' && val !== '') {
            await shipState.selectOption(val);
            break;
          }
        }
        await this.page.locator('#ShippingNewAddress_City').fill('New York');
        await this.page.locator('#ShippingNewAddress_Address1').fill('123 Main Street');
        await this.page.locator('#ShippingNewAddress_ZipPostalCode').fill('10001');
        await this.page.locator('#ShippingNewAddress_PhoneNumber').fill('1234567890');
        console.log('✓ Filled shipping new-address form');
      }

      const clicked = await this.clickAnyVisibleContinue();
      if (!clicked) {
        console.log(`⚠ Step ${i}: no visible continue button — waiting more`);
        await this.page.waitForTimeout(3000);
      }
    }
    console.log('⚠ Checkout loop finished');
  }

  async getConfirmationText() {
    return await this.page.locator('.title').textContent();
  }

  async viewOrderDetails() {
    await this.page.locator('a:has-text("Click here for order details")').click();
  }
}
module.exports = { CheckoutPage };
