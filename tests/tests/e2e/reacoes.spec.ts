import { test, expect } from '@playwright/test';

test('home mostra likes e dislikes de cada post', async ({ page }) => {
  const resposta = page.waitForResponse((res) => res.url().includes('/posts?'));
  await page.goto('/');
  const { posts } = await (await resposta).json();

  const cards = page.getByRole('listitem');
  await expect(cards).toHaveCount(posts.length);

  for (const [i, post] of posts.entries()) {
    await expect(cards.nth(i)).toContainText(`👍 ${post.reactions.likes} likes`);
    await expect(cards.nth(i)).toContainText(`👎 ${post.reactions.dislikes} dislikes`);
  }
});
