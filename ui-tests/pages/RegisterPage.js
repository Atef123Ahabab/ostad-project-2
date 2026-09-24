class RegisterPage {
  constructor(page) {
    this.page = page;
    this.genderMale = page.locator('#gender-male');
    this.firstName = page.locator('#FirstName');
    this.lastName = page.locator('#LastName');
    this.email = page.locator('#Email');
    this.password = page.locator('#Password');
    this.confirmPassword = page.locator('#ConfirmPassword');
    this.registerButton = page.locator('#register-button');
    this.successMessage = page.locator('.result');
  }

  async navigate() {
    await this.page.goto('/register');
    await this.page.waitForLoadState('networkidle');
  }

  async register(user) {
    await this.genderMale.click();
    await this.firstName.fill(user.firstName);
    await this.lastName.fill(user.lastName);
    await this.email.fill(user.email);
    await this.password.fill(user.password);
    await this.confirmPassword.fill(user.password);
    await this.registerButton.click();
    // Wait for success message to appear
    await this.successMessage.waitFor({ state: 'visible', timeout: 15000 });
  }

  async getSuccessMessage() {
    return await this.successMessage.textContent();
  }
}
module.exports = { RegisterPage };
