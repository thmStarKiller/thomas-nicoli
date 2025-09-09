import {test, expect} from '@playwright/test';

test('home loads', async ({page}) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Thomas Nicoli/);
});

test('en services loads', async ({page}) => {
  await page.goto('/en/services');
  await expect(page.getByRole('heading', {level: 1})).toContainText(/Services/i);
});

test('es chat loads', async ({page}) => {
  await page.goto('/es/chat');
  await expect(page.getByRole('heading', {level: 1})).toContainText(/Pregunta|Ask/);
});

