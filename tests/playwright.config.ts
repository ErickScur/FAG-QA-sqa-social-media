import { defineConfig, devices } from '@playwright/test';

const CLIENT_URL = process.env.CLIENT_URL ?? 'http://localhost:3000';
const API_URL = process.env.API_URL ?? 'http://localhost:8080';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'e2e',
      testDir: './tests/e2e',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: CLIENT_URL,
        launchOptions: { slowMo: Number(process.env.SLOWMO ?? 0) },
      },
    },
    {
      name: 'api',
      testDir: './tests/api',
      use: { baseURL: API_URL },
    },
  ],
});
