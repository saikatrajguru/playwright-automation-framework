# 🎭 Playwright Automation Framework

![Playwright](https://img.shields.io/badge/Playwright-1.40+-45ba4b?style=flat-square&logo=playwright&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?style=flat-square&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js&logoColor=white)
![Cucumber](https://img.shields.io/badge/Cucumber-BDD-23d96c?style=flat-square&logo=cucumber&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)

A production-grade end-to-end test automation framework built with **Playwright** and **TypeScript**, implementing the **Page Object Model (POM)** pattern, **BDD (Cucumber)**, and a **hybrid API+UI testing** strategy. Covers UI automation, REST API validation, network interception, file operations, and cross-browser execution — all wired into an HTML and Allure reporting pipeline.

---

## 📋 Table of Contents

- [Framework Architecture](#-framework-architecture)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Key Features](#-key-features)
- [Design Patterns](#-design-patterns)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Running Tests](#-running-tests)
- [Test Reporting](#-test-reporting)
- [CI/CD Integration](#-cicd-integration)
- [Author](#-author)

---

## 🏗 Framework Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    TEST EXECUTION LAYER                      │
│         Playwright Test Runner  /  Cucumber BDD              │
└────────────────────────┬────────────────────────────────────┘
                         │
         ┌───────────────┴────────────────┐
         │                                │
┌────────▼────────┐              ┌────────▼────────┐
│   UI TEST SUITE │              │  API TEST SUITE  │
│  tests/*.spec.ts│              │ WebAPIPart*.spec │
└────────┬────────┘              └────────┬─────────┘
         │                                │
┌────────▼────────────────────────────────▼────────┐
│                 PAGE OBJECT LAYER                 │
│                                                   │
│  POManager (Facade)                               │
│  ├── LoginPage                                    │
│  ├── DashboardPage                                │
│  ├── CartPage                                     │
│  ├── OrdersReviewPage                             │
│  └── OrdersHistoryPage                            │
└────────────────────────┬──────────────────────────┘
                         │
┌────────────────────────▼──────────────────────────┐
│                  UTILITIES LAYER                   │
│  APiUtils     │  test-base (Custom Fixtures)       │
│  (Token Auth  │  (Extended Test Context,           │
│   + Orders)   │   Shared Test Data)                │
└────────────────────────┬──────────────────────────┘
                         │
┌────────────────────────▼──────────────────────────┐
│                  REPORTING LAYER                   │
│       Playwright HTML Report  +  Allure Reports    │
│       Screenshots (on)  +  Trace Viewer (on)       │
└───────────────────────────────────────────────────┘
```

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Core Framework | [Playwright](https://playwright.dev/) v1.40+ |
| Language | TypeScript 5.x |
| BDD | Cucumber (`@cucumber/cucumber`) |
| Reporting | Playwright HTML Reporter + Allure |
| Package Manager | npm |
| CI/CD | GitHub Actions |
| Cross-browser | Chromium, Firefox, WebKit (Safari) |

---

## 📁 Project Structure

```
playwright-automation-framework/
│
├── pageobjects_ts/              # TypeScript Page Object classes
│   ├── POManager.ts             # Facade — single entry point to all pages
│   ├── LoginPage.ts
│   ├── DashboardPage.ts
│   ├── CartPage.ts
│   ├── OrdersReviewPage.ts
│   └── OrdersHistoryPage.ts
│
├── tests/                       # Playwright spec files
│   ├── ClientAppPO.spec.ts      # E2E order flow using POM + data-driven
│   ├── WebAPIPart1.spec.js      # Hybrid: API order creation → UI verification
│   ├── WebAPIPart2.spec.js      # API token injection → UI state bypass
│   ├── NetworkTest.spec.js      # Network interception & request mocking
│   ├── upload-download.spec.js  # File upload & download validation
│   ├── Calendar.spec.js         # Date picker interactions
│   └── UIBasicstest.spec.js     # Locator strategies & basic assertions
│
├── features/                    # Cucumber BDD
│   ├── ErrorValidation.feature  # Login error validation scenarios
│   ├── greeting.feature         # Smoke BDD scenarios
│   └── step_definitions/
│       ├── steps.ts             # Step definitions (TypeScript)
│       └── steps.js             # Step definitions (JavaScript)
│
├── utils_ts/                    # Reusable utilities (TypeScript)
│   ├── APiUtils.ts              # Token management + order creation API
│   ├── test-base.ts             # Custom Playwright fixture extensions
│   └── placeorderTestData.json  # Externalized test data
│
├── playwright.config.js         # Main config: Chromium, HTML reporter
├── playwright.config1.js        # Alternate config: Safari/cross-browser
├── cucumber.js                  # Cucumber runner config
├── tsconfig.json                # TypeScript compiler options
└── package.json                 # Scripts and dependencies
```

---

## ✨ Key Features

### ✅ Page Object Model with Facade Pattern
All page interactions are encapsulated in typed TypeScript classes. `POManager` acts as a single facade, eliminating direct page instantiation in test files and reducing coupling.

```typescript
const poManager = new POManager(page);
const loginPage  = poManager.getLoginPage();
const dashboardPage = poManager.getDashboardPage();
```

### ✅ Hybrid API + UI Testing
Orders are created via REST API (faster, reliable precondition setup) and then verified through the UI — combining the speed of API testing with the confidence of UI validation.

```typescript
// Create order via API in beforeAll hook
const apiUtils = new APiUtils(apiContext, loginPayLoad);
response = await apiUtils.createOrder(orderPayLoad);

// Inject token into browser storage — skip login UI entirely
page.addInitScript(value => {
  window.localStorage.setItem('token', value);
}, response.token);
```

### ✅ Data-Driven Testing
Test data is fully externalised into JSON files. Tests loop over datasets automatically, running one scenario per product with zero code duplication.

```typescript
const dataset = JSON.parse(JSON.stringify(require("../utils/placeorderTestData.json")));
for (const data of dataset) {
  test(`Order flow for ${data.productName}`, async ({ page }) => { ... });
}
```

### ✅ Custom Test Fixtures
Extended Playwright's base `test` object using `test.extend()` to inject shared test data (credentials, product names) directly into test function signatures — no manual imports needed.

### ✅ BDD with Cucumber
Business-readable `.feature` files define scenarios in plain English. Step definitions connect them to Playwright actions — making tests readable by non-technical stakeholders.

### ✅ Network Interception
Tests intercept and validate outbound network requests, enabling response mocking and request abort strategies for flaky dependency isolation.

### ✅ Cross-Browser Support
Separate config (`playwright.config1.js`) enables Safari/WebKit execution via BrowserStack or local browser binaries.

### ✅ Full Observability
- **Screenshots** captured on every test (pass and fail)
- **Trace viewer** enabled — full step-by-step replay of any test run
- **Allure reports** with detailed test metadata

---

## 🎨 Design Patterns

| Pattern | Where Used |
|---|---|
| Page Object Model (POM) | `pageobjects_ts/` — all UI interactions |
| Facade Pattern | `POManager.ts` — unified page access |
| Factory / Fixture Pattern | `test-base.ts` — custom test context |
| Data-Driven Testing | `placeorderTestData.json` + spec loops |
| Hybrid API-UI | `WebAPIPart*.spec.js` — API setup, UI verify |
| BDD | `features/` — Cucumber Gherkin scenarios |

---

## 🔧 Prerequisites

- **Node.js** v18 or higher
- **npm** v9 or higher

```bash
node --version   # v18+
npm --version    # v9+
```

---

## 🚀 Installation

```bash
# 1. Clone the repository
git clone https://github.com/saikatrajguru/playwright-automation-framework.git
cd playwright-automation-framework

# 2. Install dependencies
npm install

# 3. Install Playwright browsers
npx playwright install
```

---

## ⚙️ Configuration

### Environment Variables
Create a `.env` file in the project root (never commit this):

```env
USER_EMAIL=your_test_email@example.com
USER_PASSWORD=your_test_password
```

### `playwright.config.js` Defaults

| Setting | Value |
|---|---|
| Browser | Chromium |
| Headless | true |
| Timeout | 30 seconds |
| Screenshots | On (every test) |
| Trace | On (every test) |
| Reporter | HTML |

---

## ▶️ Running Tests

### Run All Tests
```bash
npm run regression
```

### Run UI Tests Only (tagged `@Web`)
```bash
npm run webTests
```

### Run API Tests Only (tagged `@API`)
```bash
npm run APITests
```

### Run in Safari / Cross-Browser
```bash
npm run SafariNewConfig
```

### Run BDD Cucumber Tests
```bash
npx cucumber-js
```

### Run a Single Spec File
```bash
npx playwright test tests/ClientAppPO.spec.ts
```

### Run in Headed Mode (see the browser)
```bash
npx playwright test --headed
```

### Run with Trace Viewer
```bash
npx playwright test
npx playwright show-trace test-results/<test-name>/trace.zip
```

---

## 📊 Test Reporting

### Playwright HTML Report
Auto-generated after every run. Open with:
```bash
npx playwright show-report
```

### Allure Report
```bash
# Generate
npx allure generate allure-results --clean

# Open
npx allure open
```

The Allure report includes test steps, screenshots, request/response logs, and execution timeline.

---

## 🔄 CI/CD Integration

This framework is CI-ready. Example GitHub Actions workflow:

```yaml
# .github/workflows/playwright.yml
name: Playwright Tests

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 18

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright browsers
        run: npx playwright install --with-deps

      - name: Run regression suite
        run: npm run regression

      - name: Upload HTML report
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 7
```

---

## 👤 Author

**Saikat Rajguru**
QA Automation Engineer · BFSI Specialist · ISTQB Certified

[![LinkedIn](https://img.shields.io/badge/LinkedIn-saikat--rajguru-0077b5?style=flat-square&logo=linkedin)](https://linkedin.com/in/saikat-rajguru)
[![GitHub](https://img.shields.io/badge/GitHub-saikatrajguru-181717?style=flat-square&logo=github)](https://github.com/saikatrajguru)

---

> 💡 **Note:** This framework is built against the [Rahul Shetty Academy](https://rahulshettyacademy.com/client) practice application and is intended for demonstration of automation engineering skills and framework design patterns.
