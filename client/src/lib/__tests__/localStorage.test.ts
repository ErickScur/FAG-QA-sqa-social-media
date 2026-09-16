import {
  getUser,
  isAuthenticated,
  removeUser,
  saveUser,
} from "@/lib/localStorage";

const usuario = { id: 1, email: "aluno@fag.edu.br" };

describe("Sessão do usuário no localStorage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("não encontra sessão antes do usuário entrar", () => {
    expect(getUser()).toBeNull();
    expect(isAuthenticated()).toBe(false);
  });

  it("recupera a sessão gravada depois do login", () => {
    saveUser(usuario);

    expect(getUser()).toEqual(usuario);
    expect(isAuthenticated()).toBe(true);
  });

  it("apaga a sessão quando o usuário sai", () => {
    saveUser(usuario);
    removeUser();

    expect(getUser()).toBeNull();
    expect(isAuthenticated()).toBe(false);
  });

  it("devolve nulo quando o conteúdo gravado está corrompido", () => {
    localStorage.setItem("sqa_social_user", "isso nao e um json");

    expect(getUser()).toBeNull();
  });
});
