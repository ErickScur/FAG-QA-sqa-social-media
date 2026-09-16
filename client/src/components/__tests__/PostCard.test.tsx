import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import PostCard from "@/components/PostCard";
import { Post } from "@/service/types";

const post: Post = {
  id: 1,
  title: "Primeiro post",
  body: "Conteúdo do primeiro post",
  liked: false,
};

describe("PostCard", () => {
  it("mostra o título e o corpo do post", () => {
    render(<PostCard post={post} isAuthenticated={false} onLike={jest.fn()} />);

    expect(screen.getByText("Primeiro post")).toBeInTheDocument();
    expect(screen.getByText("Conteúdo do primeiro post")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /curtir/i })).toBeInTheDocument();
  });

  it("avisa o visitante deslogado que é preciso estar autenticado para curtir", () => {
    const onLike = jest.fn();
    const alerta = jest.spyOn(window, "alert").mockImplementation(() => {});

    render(<PostCard post={post} isAuthenticated={false} onLike={onLike} />);
    fireEvent.click(screen.getByRole("button", { name: /curtir/i }));

    expect(alerta).toHaveBeenCalledWith(
      "Você precisa estar autenticado para curtir posts!"
    );
    expect(onLike).not.toHaveBeenCalled();

    alerta.mockRestore();
  });

  it("marca o post como curtido quando o usuário logado clica no botão", async () => {
    const onLike = jest.fn().mockResolvedValue(undefined);

    render(<PostCard post={post} isAuthenticated onLike={onLike} />);
    fireEvent.click(screen.getByRole("button", { name: /curtir/i }));

    await waitFor(() =>
      expect(screen.getByRole("button", { name: /curtido/i })).toBeInTheDocument()
    );
    expect(onLike).toHaveBeenCalledWith(1);
  });

  it("já mostra o post marcado quando ele veio curtido da API", () => {
    render(
      <PostCard
        post={{ ...post, liked: true }}
        isAuthenticated
        onLike={jest.fn()}
      />
    );

    expect(screen.getByRole("button", { name: /curtido/i })).toBeInTheDocument();
  });

  it("desfaz a marcação quando a chamada da API falha", async () => {
    const onLike = jest.fn().mockRejectedValue(new Error("falha"));
    const alerta = jest.spyOn(window, "alert").mockImplementation(() => {});

    render(<PostCard post={post} isAuthenticated onLike={onLike} />);
    fireEvent.click(screen.getByRole("button", { name: /curtir/i }));

    await waitFor(() =>
      expect(screen.getByRole("button", { name: /curtir/i })).toBeInTheDocument()
    );
    expect(alerta).toHaveBeenCalledWith("Erro ao curtir post. Tente novamente.");

    alerta.mockRestore();
  });
});
