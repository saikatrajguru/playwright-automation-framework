const { After, Before, AfterStep, Status } = require('@cucumber/cucumber');
const playwright = require('@playwright/test');

Before(async function () {
  const browser = await playwright.chromium.launch({
    headless: true, // headless mode for CI/CD compatibility
  });
  const context = await browser.newContext();
  this.page = await context.newPage();
});

AfterStep(async function ({ result }) {
  // Capture screenshot on step failure and attach to Cucumber report
  if (result.status === Status.FAILED) {
    const buffer = await this.page.screenshot();
    this.attach(buffer.toString('base64'), 'base64:image/png');
    console.log('Screenshot captured on failure');
  }
});

After(async function () {
  await this.page.close();
});
