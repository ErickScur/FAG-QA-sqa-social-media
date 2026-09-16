import { fireEvent, render, screen } from "@testing-library/react";

import Header from "@/components/Header";
import { useAuth } from "@/contexts/AuthContext";

const mockPush = jest.fn();
const mockLogout = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

jest.mock("@/contexts/AuthContext", () => ({
  useAuth: jest.fn(),
}));

const useAuthMock = useAuth as jest.Mock;

function autenticar(isAuthenticated: boolean) {
  useAuthMock.mockReturnValue({
    user: isAuthenticated ? { id: 1, email: "aluno@fag.edu.br" } : null,
    isAuthenticated,
    isLoading: false,
    login: jest.fn(),
    logout: mockLogout,
  });
}

describe("Header", () => {
  beforeEach(() => {
    mockPush.mockClear();
    mockLogout.mockClear();
  });

  it("mostra os botões de entrar e criar conta para quem não está logado", () => {
    autenticar(false);
    render(<Header />);

    expect(screen.getByRole("button", { name: /entrar/i })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /criar conta/i })
    ).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /sair/i })).toBeNull();
  });

  it("mostra os botões de posts curtidos e sair para quem está logado", () => {
    autenticar(true);
    render(<Header />);

    expect(
      screen.getByRole("button", { name: /posts curtidos/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sair/i })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /criar conta/i })).toBeNull();
  });

  it("volta para a página principal ao clicar no título", () => {
    autenticar(false);
    render(<Header />);

    fireEvent.click(screen.getByText("SQA Social Media"));

    expect(mockPush).toHaveBeenCalledWith("/");
  });

  it("leva para a página de posts curtidos", () => {
    autenticar(true);
    render(<Header />);

    fireEvent.click(screen.getByRole("button", { name: /posts curtidos/i }));

    expect(mockPush).toHaveBeenCalledWith("/auth/liked");
  });

  it("encerra a sessão e volta para a página principal ao sair", () => {
    autenticar(true);
    render(<Header />);

    fireEvent.click(screen.getByRole("button", { name: /sair/i }));

    expect(mockLogout).toHaveBeenCalled();
    expect(mockPush).toHaveBeenCalledWith("/");
  });
});
