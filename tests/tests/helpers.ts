import { APIRequestContext, expect } from '@playwright/test';

export const API_URL = process.env.API_URL ?? 'http://localhost:8080';
export const SENHA = 'Teste@123';

export function novoEmail() {
  return `qa_${Date.now()}_${Math.floor(Math.random() * 10000)}@teste.com`;
}

export async function criarUsuario(request: APIRequestContext, email = novoEmail()) {
  const res = await request.post(`${API_URL}/auth/signup`, {
    data: { email, password: SENHA },
  });
  expect(res.ok()).toBeTruthy();
  return (await res.json()) as { id: number; email: string };
}
