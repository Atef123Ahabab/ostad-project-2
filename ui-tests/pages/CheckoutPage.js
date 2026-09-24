class CheckoutPage {
  constructor(page) {
    this.page = page;
  }

  // Fill the billing new-address form (required on first checkout for new users)
  async fillBillingAddress() {
    // Only fill if the form is visible (new users have no saved address)
    const country = this.page.locator('#BillingNewAddress_CountryId');
    if (!(await country.isVisible().catch(() => false))) {
      console.log('⏭ Billing form not visible — using existing address');
      return;
    }

    // Wait for the state dropdown to be populated after country is selected
    await country.selectOption({ label: 'United States' });
    console.log('✓ Billing: selected country');

    // Small wait for the state/province dropdown to populate via AJAX
    await this.page.waitForTimeout(1500);
    const state = this.page.locator('#BillingNewAddress_StateProvinceId');
    // Pick first non-empty option
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

  // Click whichever continue button is currently visible
  async clickVisibleContinue() {
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
      if (await btn.isVisible().catch(() => false)) {
        await btn.click();
        console.log(`✓ Clicked continue in #${c}`);
        return c;
      }
    }
    return null;
  }

  async completeCheckout() {
    // Step 1: fill billing address if visible
    await this.fillBillingAddress();

    const maxSteps = 12;
    for (let i = 1; i <= maxSteps; i++) {
      // Exit if confirmation shown
      const confirmed = await this.page
        .locator('.title')
        .filter({ hasText: /successfully processed/i })
        .isVisible()
        .catch(() => false);
      if (confirmed) {
        console.log('✓ Reached order confirmation');
        return;
      }

      const clicked = await this.clickVisibleContinue();
      if (!clicked) {
        console.log(`⚠ Step ${i}: no visible continue button`);
        break;
      }

      // Wait for the page to respond (AJAX)
      await this.page.waitForTimeout(2000);

      // After billing, if the shipping new-address form appears, fill it
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
