import { test, expect } from '@playwright/test';
import { criarUsuario } from '../helpers';

test('GET /posts respeita limit e skip', async ({ request }) => {
  const res = await request.get('/posts', { params: { limit: 5, skip: 10 } });

  expect(res.status()).toBe(200);
  const body = await res.json();
  expect(body.posts).toHaveLength(5);
  expect(body.limit).toBe(5);
  expect(body.skip).toBe(10);
  expect(body.posts[0]).toMatchObject({
    id: expect.any(Number),
    title: expect.any(String),
    body: expect.any(String),
    liked: false,
  });
});

test('POST /posts/:id/like alterna entre curtir e descurtir', async ({ request }) => {
  const { id: userId } = await criarUsuario(request);

  const curtir = await request.post('/posts/3/like', { params: { userId } });
  expect(curtir.status()).toBe(200);
  expect(await curtir.json()).toEqual({ postId: 3, liked: true });

  const descurtir = await request.post('/posts/3/like', { params: { userId } });
  expect(await descurtir.json()).toEqual({ postId: 3, liked: false });
});

test('GET /posts/liked retorna apenas os posts curtidos pelo usuario', async ({ request }) => {
  const { id: userId } = await criarUsuario(request);
  await request.post('/posts/1/like', { params: { userId } });
  await request.post('/posts/2/like', { params: { userId } });

  const res = await request.get('/posts/liked', { params: { userId } });

  expect(res.status()).toBe(200);
  const body = await res.json();
  expect(body.total).toBe(2);
  expect(body.posts.map((p: { id: number }) => p.id).sort()).toEqual([1, 2]);
  expect(body.posts.every((p: { liked: boolean }) => p.liked)).toBe(true);
});

test('GET /posts marca como liked o que o usuario curtiu', async ({ request }) => {
  const { id: userId } = await criarUsuario(request);
  await request.post('/posts/1/like', { params: { userId } });

  const res = await request.get('/posts', { params: { limit: 3, userId } });
  const posts: { id: number; liked: boolean }[] = (await res.json()).posts;

  expect(posts.find((p) => p.id === 1)?.liked).toBe(true);
  expect(posts.filter((p) => p.id !== 1).every((p) => !p.liked)).toBe(true);
});
