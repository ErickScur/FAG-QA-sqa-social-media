import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { AxiosError, AxiosResponse } from "axios";

import SignIn from "@/app/signin/page";
import { AuthProvider } from "@/contexts/AuthContext";
import { authService } from "@/service/auth/auth";

const mockPush = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

jest.mock("@/service/auth/auth", () => ({
  authService: {
    signIn: jest.fn(),
  },
}));

const signInMock = authService.signIn as jest.Mock;

function renderizarTela() {
  return render(
    <AuthProvider>
      <SignIn />
    </AuthProvider>
  );
}

function formulario() {
  return within(screen.getByRole("main"));
}

function preencher(email: string, senha: string) {
  fireEvent.change(screen.getByPlaceholderText("seu@email.com"), {
    target: { value: email },
  });
  fireEvent.change(screen.getByPlaceholderText("••••••••"), {
    target: { value: senha },
  });
}

function enviar() {
  fireEvent.click(formulario().getByRole("button", { name: "Entrar" }));
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

describe("Tela de login", () => {
  beforeEach(() => {
    localStorage.clear();
    mockPush.mockClear();
    signInMock.mockReset();
  });

  it("autentica o usuário e leva para a página principal", async () => {
    signInMock.mockResolvedValue({ id: 1, email: "aluno@fag.edu.br" });

    renderizarTela();
    preencher("aluno@fag.edu.br", "Senha@123");
    enviar();

    await waitFor(() =>
      expect(signInMock).toHaveBeenCalledWith({
        email: "aluno@fag.edu.br",
        password: "Senha@123",
      })
    );
    await waitFor(() => expect(mockPush).toHaveBeenCalledWith("/"));
  });

  it("mostra credenciais inválidas quando a API recusa o login", async () => {
    signInMock.mockRejectedValue(erroDaApi("Credenciais inválidas", 401));

    renderizarTela();
    preencher("aluno@fag.edu.br", "Senha@123");
    enviar();

    expect(await screen.findByText("Credenciais inválidas")).toBeInTheDocument();
    expect(mockPush).not.toHaveBeenCalled();
  });

  it("cobra o preenchimento dos campos obrigatórios", async () => {
    renderizarTela();
    enviar();

    expect(await screen.findByText("Email é obrigatório")).toBeInTheDocument();
    expect(screen.getByText("Senha é obrigatória")).toBeInTheDocument();
    expect(signInMock).not.toHaveBeenCalled();
  });
});
