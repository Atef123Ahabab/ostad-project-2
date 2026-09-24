class LoginPage {
  constructor(page) {
    this.page = page;
    this.emailInput = page.locator('#Email');
    this.passwordInput = page.locator('#Password');
    this.loginButton = page.locator('input.login-button');
    this.errorMessage = page.locator('.validation-summary-errors');
    this.logoutLink = page.locator('a.ico-logout');
    this.accountLink = page.locator('a.account');
  }

  async navigate() {
    await this.page.goto('/login');
  }

  async login(email, password) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async loginAndWait(email, password) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    // Wait until logout link appears (proves logged in)
    await this.logoutLink.waitFor({ state: 'visible', timeout: 15000 });
  }

  async getErrorMessage() {
    return await this.errorMessage.textContent();
  }
}
module.exports = { LoginPage };
