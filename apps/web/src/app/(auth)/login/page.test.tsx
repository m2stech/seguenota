import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const pushMock = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
}));

describe("LoginPage", () => {
  it("mostra erros de validação quando o formulário é enviado vazio", async () => {
    const { default: LoginPage } = await import("./page");
    const user = userEvent.setup();
    render(<LoginPage />);

    await user.click(screen.getByRole("button", { name: "Entrar" }));

    expect(await screen.findByText("Informe o e-mail.")).toBeInTheDocument();
    expect(screen.getByText("Informe a senha.")).toBeInTheDocument();
    expect(pushMock).not.toHaveBeenCalled();
  });

  it("rejeita um e-mail em formato inválido", async () => {
    const { default: LoginPage } = await import("./page");
    const user = userEvent.setup();
    render(<LoginPage />);

    await user.type(screen.getByLabelText("E-mail"), "nao-e-email");
    await user.type(screen.getByLabelText("Senha"), "qualquer-coisa");
    await user.click(screen.getByRole("button", { name: "Entrar" }));

    expect(await screen.findByText("Informe um e-mail válido.")).toBeInTheDocument();
  });

  it("redireciona para o dashboard após login bem-sucedido", async () => {
    const { default: LoginPage } = await import("./page");
    const user = userEvent.setup();
    render(<LoginPage />);

    await user.type(screen.getByLabelText("E-mail"), "usuario@segue.nota");
    await user.type(screen.getByLabelText("Senha"), "senha-valida");
    await user.click(screen.getByRole("button", { name: "Entrar" }));

    await waitFor(() => expect(pushMock).toHaveBeenCalledWith("/dashboard"));
  });

  it("redireciona para verificação de 2FA quando a conta exige segundo fator", async () => {
    const { default: LoginPage } = await import("./page");
    const user = userEvent.setup();
    render(<LoginPage />);

    await user.type(screen.getByLabelText("E-mail"), "2fa@segue.nota");
    await user.type(screen.getByLabelText("Senha"), "senha-valida");
    await user.click(screen.getByRole("button", { name: "Entrar" }));

    await waitFor(() => expect(pushMock).toHaveBeenCalledWith("/2fa/verificar"));
  });

  it("exibe erro do servidor para credenciais incorretas", async () => {
    const { default: LoginPage } = await import("./page");
    const user = userEvent.setup();
    render(<LoginPage />);

    await user.type(screen.getByLabelText("E-mail"), "bloqueado@segue.nota");
    await user.type(screen.getByLabelText("Senha"), "senha-errada");
    await user.click(screen.getByRole("button", { name: "Entrar" }));

    expect(await screen.findByText("E-mail ou senha incorretos.")).toBeInTheDocument();
    expect(pushMock).not.toHaveBeenCalled();
  });
});
