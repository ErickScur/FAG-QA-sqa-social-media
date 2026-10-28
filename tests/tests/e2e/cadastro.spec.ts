import { test, expect } from '@playwright/test';
import { criarUsuario, novoEmail, SENHA } from '../helpers';

test.describe('Cadastro', () => {
  test('usuario cria conta e entra logado no feed', async ({ page }) => {
    const email = novoEmail();

    await page.goto('/');
    await page.getByRole('button', { name: 'Criar Conta' }).click();
    await expect(page).toHaveURL('/signup');

    await page.getByPlaceholder('seu@email.com').fill(email);
    await page.locator('input[type="password"]').nth(0).fill(SENHA);
    await page.locator('input[type="password"]').nth(1).fill(SENHA);
    await page.locator('form').getByRole('button', { name: 'Criar Conta' }).click();

    await expect(page).toHaveURL('/');
    await expect(page.getByRole('heading', { name: 'Feed de Posts' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sair' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Posts Curtidos' })).toBeVisible();
  });

  test('mostra erro ao cadastrar e-mail que ja existe', async ({ page, request }) => {
    const { email } = await criarUsuario(request);

    await page.goto('/signup');
    await page.getByPlaceholder('seu@email.com').fill(email);
    await page.locator('input[type="password"]').nth(0).fill(SENHA);
    await page.locator('input[type="password"]').nth(1).fill(SENHA);
    await page.locator('form').getByRole('button', { name: 'Criar Conta' }).click();

    await expect(page.getByText('E-mail já está em uso')).toBeVisible();
    await expect(page).toHaveURL('/signup');
  });
});
