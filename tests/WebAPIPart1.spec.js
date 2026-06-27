const { test, expect, request } = require('@playwright/test');
const { APiUtils } = require('../utils/APiUtils');

// Credentials read from environment variables.
// For local runs: set TEST_USER_EMAIL and TEST_USER_PASSWORD in your shell or .env file.
// Fallback to public practice-site credentials if env vars are not set.
const loginPayLoad = {
  userEmail:    process.env.TEST_USER_EMAIL    ?? 'anshika@gmail.com',
  userPassword: process.env.TEST_USER_PASSWORD ?? 'Iamking@000',
};
const orderPayLoad = {
  orders: [{ country: 'Cuba', productOrderedId: '6262e95ae26b7e1a10e89bf0' }],
};

let response;

test.beforeAll(async () => {
  const apiContext = await request.newContext();
  const apiUtils = new APiUtils(apiContext, loginPayLoad);
  response = await apiUtils.createOrder(orderPayLoad);
});

// Hybrid test: order created via API, verification done through UI
test('@API Place the order', async ({ page }) => {
  // Inject auth token directly into localStorage — skips login UI entirely
  page.addInitScript(value => {
    window.localStorage.setItem('token', value);
  }, response.token);

  await page.goto('https://rahulshettyacademy.com/client');
  await page.locator("button[routerlink*='myorders']").click();
  await page.locator('tbody').waitFor();

  const rows = page.locator('tbody tr');
  for (let i = 0; i < await rows.count(); ++i) {
    const rowOrderId = await rows.nth(i).locator('th').textContent();
    if (response.orderId.includes(rowOrderId)) {
      await rows.nth(i).locator('button').first().click();
      break;
    }
  }

  const orderIdDetails = await page.locator('.col-text').textContent();
  expect(response.orderId.includes(orderIdDetails)).toBeTruthy();
});
