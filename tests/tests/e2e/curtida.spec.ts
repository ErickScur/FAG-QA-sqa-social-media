import { test, expect } from '@playwright/test';
import { criarUsuario, SENHA } from '../helpers';

test.describe('Curtida de posts', () => {
  test('visitante que abre posts curtidos e mandado para o login', async ({ page }) => {
    await page.goto('/auth/liked');

    await expect(page).toHaveURL('/signin');
  });

  test('usuario logado curte um post, ve na lista de curtidos e descurte', async ({ page, request }) => {
    const { email } = await criarUsuario(request);

    await page.goto('/signin');
    await page.getByPlaceholder('seu@email.com').fill(email);
    await page.locator('input[type="password"]').fill(SENHA);
    await page.locator('form').getByRole('button', { name: 'Entrar' }).click();
    await expect(page.getByRole('button', { name: 'Sair' })).toBeVisible();

    const post = page.getByRole('listitem').first();
    const titulo = await post.getByRole('heading').innerText();

    await Promise.all([
      page.waitForResponse((res) => res.url().includes('/like') && res.ok()),
      post.getByRole('button', { name: 'Curtir' }).click(),
    ]);
    await expect(post.getByRole('button', { name: 'Curtido' })).toBeVisible();

    await page.getByRole('button', { name: 'Posts Curtidos' }).click();
    await expect(page).toHaveURL('/auth/liked');

    const curtido = page.getByRole('listitem').filter({ hasText: titulo });
    await expect(curtido).toBeVisible();

    await curtido.getByRole('button', { name: 'Curtido' }).click();

    await expect(curtido).toBeHidden();
    await expect(page.getByText('Você ainda não curtiu nenhum post.')).toBeVisible();
  });
});
