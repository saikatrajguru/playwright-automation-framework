import { test as baseTest } from '@playwright/test';

interface TestDataForOrder {
  username: string;
  password: string;
  productName: string;
}

/**
 * Custom Playwright fixture extending the base test context.
 * Injects shared order test data directly into test function signatures.
 * Reads credentials from environment variables with fallback to practice-site defaults.
 */
export const customTest = baseTest.extend<{ testDataForOrder: TestDataForOrder }>({
  testDataForOrder: {
    username:    process.env.TEST_USER_EMAIL    ?? 'anshika@gmail.com',
    password:    process.env.TEST_USER_PASSWORD ?? 'Iamking@000',
    productName: process.env.TEST_PRODUCT       ?? 'ADIDAS ORIGINAL',
  },
});
