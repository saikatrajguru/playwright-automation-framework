const { test, expect } = require('@playwright/test');

// Credentials read from environment variables.
// Fallback to public practice-site credentials if env vars are not set.
const USER_EMAIL    = process.env.TEST_USER_EMAIL    ?? 'rahulshetty@gmail.com';
const USER_PASSWORD = process.env.TEST_USER_PASSWORD ?? 'Iamking@000';
const PRODUCT_NAME  = 'iphone 13 pro';

let webContext;

test.beforeAll(async ({ browser }) => {
  // Strategy: login once via UI, save storage state, reuse across all tests
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto('https://rahulshettyacademy.com/client');
  await page.locator('#userEmail').fill(USER_EMAIL);
  await page.locator('#userPassword').fill(USER_PASSWORD);
  await page.locator("[value='Login']").click();
  await page.waitForLoadState('networkidle');
  await context.storageState({ path: 'state.json' });
  webContext = await browser.newContext({ storageState: 'state.json' });
});

test('@QA Client App login', async () => {
  const page = await webContext.newPage();
  await page.goto('https://rahulshettyacademy.com/client');

  const products = page.locator('.card-body');
  const count = await products.count();
  for (let i = 0; i < count; ++i) {
    if (await products.nth(i).locator('b').textContent() === PRODUCT_NAME) {
      await products.nth(i).locator('text= Add To Cart').click();
      break;
    }
  }

  await page.locator("[routerlink*='cart']").click();
  await page.locator('div li').first().waitFor();
  await expect(page.locator(`h3:has-text('${PRODUCT_NAME}')`)).toBeVisible();
  await page.locator('text=Checkout').click();

  await page.locator("[placeholder*='Country']").fill('ind', { delay: 100 });
  const dropdown = page.locator('.ta-results');
  await dropdown.waitFor();
  const optionsCount = await dropdown.locator('button').count();
  for (let i = 0; i < optionsCount; ++i) {
    const text = await dropdown.locator('button').nth(i).textContent();
    if (text === ' India') {
      await dropdown.locator('button').nth(i).click();
      break;
    }
  }

  await expect(page.locator(".user__name [type='text']").first()).toHaveText(USER_EMAIL);
  await page.locator('.action__submit').click();
  await expect(page.locator('.hero-primary')).toHaveText(' Thankyou for the order. ');

  const orderId = await page.locator('.em-spacer-1 .ng-star-inserted').textContent();
  await page.locator("button[routerlink*='myorders']").click();
  await page.locator('tbody').waitFor();

  const rows = page.locator('tbody tr');
  for (let i = 0; i < await rows.count(); ++i) {
    const rowOrderId = await rows.nth(i).locator('th').textContent();
    if (orderId.includes(rowOrderId)) {
      await rows.nth(i).locator('button').first().click();
      break;
    }
  }
  const orderIdDetails = await page.locator('.col-text').textContent();
  expect(orderId.includes(orderIdDetails)).toBeTruthy();
});

test('@API Test case 2', async () => {
  const page = await webContext.newPage();
  await page.goto('https://rahulshettyacademy.com/client');
  await page.waitForLoadState('networkidle');
  const titles = await page.locator('.card-body b').allTextContents();
  console.log('Available products:', titles);
});
