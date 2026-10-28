import { test, expect } from '@playwright/test';
import { criarUsuario, SENHA } from '../helpers';

test.describe('Login', () => {
  test('usuario entra, ve o menu logado e sai', async ({ page, request }) => {
    const { email } = await criarUsuario(request);

    await page.goto('/');
    await page.getByRole('button', { name: 'Entrar' }).click();
    await expect(page).toHaveURL('/signin');

    await page.getByPlaceholder('seu@email.com').fill(email);
    await page.locator('input[type="password"]').fill(SENHA);
    await page.locator('form').getByRole('button', { name: 'Entrar' }).click();

    await expect(page).toHaveURL('/');
    await expect(page.getByRole('button', { name: 'Sair' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Entrar' })).toBeHidden();

    await page.getByRole('button', { name: 'Sair' }).click();

    await expect(page.getByRole('button', { name: 'Entrar' })).toBeVisible();
  });

  test('mostra erro com senha incorreta e continua na tela de login', async ({ page, request }) => {
    const { email } = await criarUsuario(request);

    await page.goto('/signin');
    await page.getByPlaceholder('seu@email.com').fill(email);
    await page.locator('input[type="password"]').fill('Errada@123');
    await page.locator('form').getByRole('button', { name: 'Entrar' }).click();

    await expect(page.getByText('Credenciais inválidas')).toBeVisible();
    await expect(page).toHaveURL('/signin');
    await expect(page.getByRole('button', { name: 'Sair' })).toBeHidden();
  });
});
