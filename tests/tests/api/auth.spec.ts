import { test, expect } from '@playwright/test';
import { criarUsuario, novoEmail, SENHA } from '../helpers';

test.describe('POST /auth/signup', () => {
  test('cria usuario com dados validos', async ({ request }) => {
    const email = novoEmail();

    const res = await request.post('/auth/signup', {
      data: { email, password: SENHA },
    });

    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.id).toEqual(expect.any(Number));
    expect(body.email).toBe(email);
  });

  test('retorna 409 com e-mail ja cadastrado', async ({ request }) => {
    const { email } = await criarUsuario(request);

    const res = await request.post('/auth/signup', {
      data: { email, password: SENHA },
    });

    expect(res.status()).toBe(409);
    expect(await res.json()).toEqual({ message: 'E-mail já está em uso', status: 409 });
  });

  test('retorna 422 com senha fora da regra', async ({ request }) => {
    const res = await request.post('/auth/signup', {
      data: { email: novoEmail(), password: 'senha123' },
    });

    expect(res.status()).toBe(422);
    expect((await res.json()).message).toBe('Senha inválida');
  });

  test('retorna 422 com e-mail sem @', async ({ request }) => {
    const res = await request.post('/auth/signup', {
      data: { email: 'emailinvalido.com', password: SENHA },
    });

    expect(res.status()).toBe(422);
    expect((await res.json()).message).toBe('E-mail inválido');
  });
});

test.describe('POST /auth/signin', () => {
  test('autentica usuario com credenciais corretas', async ({ request }) => {
    const usuario = await criarUsuario(request);

    const res = await request.post('/auth/signin', {
      data: { email: usuario.email, password: SENHA },
    });

    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.id).toBe(usuario.id);
    expect(body.email).toBe(usuario.email);
  });

  test('retorna 401 com senha errada', async ({ request }) => {
    const { email } = await criarUsuario(request);

    const res = await request.post('/auth/signin', {
      data: { email, password: 'Outra@123' },
    });

    expect(res.status()).toBe(401);
    expect((await res.json()).message).toBe('Credenciais inválidas');
  });

  test('retorna 401 com usuario inexistente', async ({ request }) => {
    const res = await request.post('/auth/signin', {
      data: { email: novoEmail(), password: SENHA },
    });

    expect(res.status()).toBe(401);
  });
});

test.describe('POST /auth/reset-password', () => {
  test('retorna sucesso para e-mail cadastrado', async ({ request }) => {
    const { email } = await criarUsuario(request);

    const res = await request.post('/auth/reset-password', { data: { email } });

    expect(res.status()).toBe(200);
    expect((await res.json()).message).toContain('Senha redefinida');
  });

  test('retorna 404 para e-mail nao cadastrado', async ({ request }) => {
    const res = await request.post('/auth/reset-password', {
      data: { email: novoEmail() },
    });

    expect(res.status()).toBe(404);
    expect((await res.json()).message).toBe('Usuário não encontrado');
  });
});
