import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { AxiosError, AxiosResponse } from "axios";

import SignUp from "@/app/signup/page";
import { AuthProvider } from "@/contexts/AuthContext";
import { authService } from "@/service/auth/auth";

const mockPush = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

jest.mock("@/service/auth/auth", () => ({
  authService: {
    signUp: jest.fn(),
  },
}));

const signUpMock = authService.signUp as jest.Mock;

function renderizarTela() {
  return render(
    <AuthProvider>
      <SignUp />
    </AuthProvider>
  );
}

function formulario() {
  return within(screen.getByRole("main"));
}

function preencher(email: string, senha: string, confirmacao: string) {
  const campoEmail = screen.getByPlaceholderText("seu@email.com");
  const camposSenha = screen.getAllByPlaceholderText("••••••••");

  fireEvent.change(campoEmail, { target: { value: email } });
  fireEvent.change(camposSenha[0], { target: { value: senha } });
  fireEvent.change(camposSenha[1], { target: { value: confirmacao } });
}

function enviar() {
  fireEvent.click(formulario().getByRole("button", { name: /criar conta/i }));
}

function erroDaApi(mensagem: string, status: number) {
  const erro = new AxiosError("Request failed");
  erro.response = {
    data: { message: mensagem },
    status,
    statusText: "",
    headers: {},
    config: { headers: {} },
  } as unknown as AxiosResponse;
  return erro;
}

describe("Tela de cadastro", () => {
  beforeEach(() => {
    localStorage.clear();
    mockPush.mockClear();
    signUpMock.mockReset();
  });

  it("cadastra o usuário e leva para a página principal", async () => {
    signUpMock.mockResolvedValue({ id: 1, email: "aluno@fag.edu.br" });

    renderizarTela();
    preencher("aluno@fag.edu.br", "Senha@123", "Senha@123");
    enviar();

    await waitFor(() =>
      expect(signUpMock).toHaveBeenCalledWith({
        email: "aluno@fag.edu.br",
        password: "Senha@123",
      })
    );
    await waitFor(() => expect(mockPush).toHaveBeenCalledWith("/"));
  });

  it("não envia o cadastro quando as senhas não coincidem", async () => {
    renderizarTela();
    preencher("aluno@fag.edu.br", "Senha@123", "Senha@456");
    enviar();

    expect(await screen.findByText("As senhas não coincidem")).toBeInTheDocument();
    expect(signUpMock).not.toHaveBeenCalled();
  });

  it("não envia o cadastro quando o e-mail está em formato inválido", async () => {
    renderizarTela();
    preencher("aluno@fag", "Senha@123", "Senha@123");
    enviar();

    expect(await screen.findByText("Email inválido")).toBeInTheDocument();
    expect(signUpMock).not.toHaveBeenCalled();
  });

  it("mostra a mensagem devolvida pela API quando o e-mail já está cadastrado", async () => {
    signUpMock.mockRejectedValue(erroDaApi("E-mail já cadastrado", 409));

    renderizarTela();
    preencher("aluno@fag.edu.br", "Senha@123", "Senha@123");
    enviar();

    expect(await screen.findByText("E-mail já cadastrado")).toBeInTheDocument();
    expect(mockPush).not.toHaveBeenCalled();
  });
});
