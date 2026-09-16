import {
  getPasswordValidationMessage,
  isPasswordValid,
} from "@/utils/password";

describe("Validação de senha", () => {
  it("aceita senha que atende a todos os critérios", () => {
    expect(isPasswordValid("Senha@123")).toBe(true);
  });

  it("recusa senha sem letra maiúscula", () => {
    expect(isPasswordValid("senha@123")).toBe(false);
  });

  it("recusa senha sem letra minúscula", () => {
    expect(isPasswordValid("SENHA@123")).toBe(false);
  });

  it("recusa senha sem número", () => {
    expect(isPasswordValid("Senha@senha")).toBe(false);
  });

  it("recusa senha sem caractere especial", () => {
    expect(isPasswordValid("Senha1234")).toBe(false);
  });

  it("recusa senha vazia", () => {
    expect(isPasswordValid("")).toBe(false);
  });

  it("aceita senha com exatamente 8 caracteres", () => {
    expect("Senha@12").toHaveLength(8);
    expect(isPasswordValid("Senha@12")).toBe(true);
  });

  it("aponta o critério que faltou na mensagem de erro", () => {
    const mensagem = getPasswordValidationMessage("Abc@1");

    expect(mensagem).toContain("mínimo de 8 caracteres");
  });

  it("avisa que a senha é obrigatória quando o campo está vazio", () => {
    expect(getPasswordValidationMessage("")).toBe("Senha é obrigatória");
  });

  it("aceita a senha quando a validação não aponta nenhum erro", () => {
    const senha = "Senha123.";

    expect(getPasswordValidationMessage(senha)).toBe("");
    expect(isPasswordValid(senha)).toBe(true);
  });
});
