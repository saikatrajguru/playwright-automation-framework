const { test, expect, request } = require('@playwright/test');
const { APiUtils } = require('../utils/APiUtils');

const loginPayLoad = {
  userEmail:    process.env.TEST_USER_EMAIL    ?? 'anshika@gmail.com',
  userPassword: process.env.TEST_USER_PASSWORD ?? 'Iamking@000',
};
const orderPayLoad = {
  orders: [{ country: 'India', productOrderedId: '6262e95ae26b7e1a10e89bf0' }],
};
// Mock payload to simulate empty order history response
const fakePayLoadOrders = { data: [], message: 'No Orders' };

let response;

test.beforeAll(async () => {
  const apiContext = await request.newContext();
  const apiUtils = new APiUtils(apiContext, loginPayLoad);
  response = await apiUtils.createOrder(orderPayLoad);
});

test('@SP Network intercept — mock empty orders response', async ({ page }) => {
  // Inject token so we skip login UI
  page.addInitScript(value => {
    window.localStorage.setItem('token', value);
  }, response.token);

  await page.goto('https://rahulshettyacademy.com/client');

  // Intercept the orders API and replace with fake empty response
  await page.route(
    'https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*',
    async route => {
      const apiResponse = await page.request.fetch(route.request());
      route.fulfill({ response: apiResponse, body: JSON.stringify(fakePayLoadOrders) });
    }
  );

  await page.locator("button[routerlink*='myorders']").click();
  await page.waitForResponse(
    'https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*'
  );

  // Verify the UI renders the mocked empty state
  console.log('Order section text:', await page.locator('.mt-4').textContent());
});
