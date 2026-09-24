# Demo Web Shop Automation & API Testing

End-to-end test automation project covering UI automation (Playwright + POM) and API automation (Postman + Newman) for the Demo Web Shop application and JSONPlaceholder API.

## Project Overview

| Part | Description | Marks |
|------|-------------|-------|
| Part A | UI Automation — 3 test scenarios using Playwright with Page Object Model | 50 |
| Part B | GitHub Workflow — feature branches, meaningful commit history, documentation | 20 |
| Part C | API Automation — Postman collection executed via Newman CLI | 30 |

## Tech Stack

| Layer | Technology |
|-------|-----------|
| UI Automation | Playwright v1.63 (JavaScript) |
| Design Pattern | Page Object Model (POM) |
| Reporting | Allure + Playwright HTML |
| API Testing | Postman + Newman |
| API Report | newman-reporter-htmlextra |
| Runtime | Node.js v18+ |
| Java (for Allure) | OpenJDK 17+ |
| Version Control | Git + GitHub |

## Repository Structure

ostad-project-2/
├── api-tests/
│   ├── DemoWebShop_API_Collection.json
│   └── environment.json
├── ui-tests/
│   ├── fixtures/testData.json
│   ├── pages/
│   │   ├── CartPage.js
│   │   ├── CheckoutPage.js
│   │   ├── LoginPage.js
│   │   ├── ProductPage.js
│   │   ├── RegisterPage.js
│   │   └── SearchPage.js
│   ├── tests/
│   │   ├── q1-invalid-login.spec.js
│   │   ├── q2-register-add-cart.spec.js
│   │   └── q3-e2e-checkout.spec.js
│   ├── package.json
│   └── playwright.config.js
├── reports/
├── package.json
├── .gitignore
└── README.md

## Prerequisites

- Node.js v18 or higher
- Java JDK 17+ (required by Allure CLI)
- Git

Verify:
node --version
npm --version
java --version
git --version

## Setup Steps

### 1. Clone the repository

git clone https://github.com/Atef123Ahabab/ostad-project-2.git
cd ostad-project-2

### 2. Install root dependencies (Allure + Newman)

npm install

### 3. Install UI test dependencies (Playwright)

cd ui-tests
npm install
npx playwright install chromium

### 4. Verify tools

cd ..
npx allure --version
npx newman --version

## How to Run Tests

### Part A — UI Automation

Run from ui-tests/:

Single scenario:
npm run test:q1    # Invalid Login
npm run test:q2    # Register + Add Product to Cart
npm run test:q3    # E2E Checkout

All scenarios sequentially:
npm test

The Playwright config uses workers: 1 and fullyParallel: false, so all three tests run sequentially.

### Part C — API Automation

Run from project root:

npx newman run api-tests/DemoWebShop_API_Collection.json -e api-tests/environment.json -r cli,htmlextra --reporter-htmlextra-export reports/newman-report.html

Expected: 10/10 assertions passed across GET /users and PUT /users/{id}.

## Generating Reports

### Allure Report (UI)

cd ui-tests
npm run test:allure
npm run report:allure

Results in ui-tests/allure-results/. HTML report at reports/allure-report/. Each test attaches a full-page screenshot.

### Playwright HTML Report (UI)

cd ui-tests
npm run report:html

### Newman HTML Report (API)

Generated automatically by the Newman command. Open with:
open reports/newman-report.html

## Test Scenarios

### Q1 — Invalid Login
1. Navigate to /login
2. Submit invalid email + password
3. Verify "Login was unsuccessful" error message
4. Verify user is not logged in

### Q2 — Register + Add to Cart
1. Register a new customer
2. Verify success message
3. Log in
4. Search "14.1-inch Laptop"
5. Open product page
6. Add to cart (qty 1)
7. Verify product + quantity in cart

### Q3 — End-to-End Checkout
1. Register + log in
2. Search "14.1-inch Laptop"
3. Open product, set qty to 2, add to cart
4. Check "I agree with terms", click Checkout
5. Fill billing address (Country: United States, State: Alabama)
6. Complete checkout through Confirm Order
7. Verify "Your order has been successfully processed"
8. View order details with order number

### API — GET + PUT Users

GET /users:
- Status code is 200
- Response is a non-empty array
- Contains user information
- Each user has id, name, email
- Save first user's id and phone

PUT /users/{id}:
- Status code is 200
- Returned ID matches saved userId
- Phone is not empty
- Returned name matches updated name
- Returned email matches updated email
- Returned company.name matches updated company name

## Branch Strategy

| Branch | Contents |
|--------|----------|
| main | Stable merged code |
| feature/q1-invalid-login | Q1 — Invalid login test + LoginPage POM |
| feature/q2-register-add-cart | Q2 — Register + Add to Cart test + POMs |
| feature/q3-e2e-checkout | Q3 — E2E checkout test + CheckoutPage POM |
| feature/api-automation | Part C — Postman collection + environment |

## GitHub Repository

https://github.com/Atef123Ahabab/ostad-project-2

## Author

Atef Ahabab — SQA 19

## License

ISC