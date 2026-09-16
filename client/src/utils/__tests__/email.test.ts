import { getEmailValidationMessage, isEmailValid } from "@/utils/email";

describe("Validação de e-mail", () => {
  it("aceita um e-mail em formato válido", () => {
    expect(isEmailValid("aluno@fag.edu.br")).toBe(true);
  });

  it("ignora os espaços digitados em volta do e-mail", () => {
    expect(isEmailValid("  aluno@fag.edu.br  ")).toBe(true);
  });

  it("recusa e-mail sem domínio", () => {
    expect(isEmailValid("aluno@")).toBe(false);
  });

  it("recusa e-mail sem arroba", () => {
    expect(isEmailValid("alunofag.edu.br")).toBe(false);
  });

  it("recusa e-mail vazio", () => {
    expect(isEmailValid("")).toBe(false);
  });

  it("avisa que o campo é obrigatório quando o e-mail não foi preenchido", () => {
    expect(getEmailValidationMessage("")).toBe("Email é obrigatório");
  });

  it("avisa que o e-mail é inválido quando o formato está errado", () => {
    expect(getEmailValidationMessage("aluno@")).toBe("Email inválido");
  });

  it("não devolve mensagem quando o e-mail é válido", () => {
    expect(getEmailValidationMessage("aluno@fag.edu.br")).toBe("");
  });
});
