import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const pushMock = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
}));

describe("SignUpPage", () => {
  it("rejeita senha fraca", async () => {
    const { default: SignUpPage } = await import("./page");
    const user = userEvent.setup();
    render(<SignUpPage />);

    await user.type(screen.getByLabelText("Nome completo"), "Maria Souza");
    await user.type(screen.getByLabelText("E-mail"), "maria@empresa.com.br");
    await user.type(screen.getByLabelText("Senha"), "fraca");
    await user.type(screen.getByLabelText("Confirmar senha"), "fraca");
    await user.click(screen.getByRole("checkbox"));
    await user.click(screen.getByRole("button", { name: "Criar conta" }));

    expect(
      await screen.findByText("A senha precisa ter no mínimo 8 caracteres."),
    ).toBeInTheDocument();
    expect(pushMock).not.toHaveBeenCalled();
  });

  it("rejeita quando as senhas não coincidem", async () => {
    const { default: SignUpPage } = await import("./page");
    const user = userEvent.setup();
    render(<SignUpPage />);

    await user.type(screen.getByLabelText("Nome completo"), "Maria Souza");
    await user.type(screen.getByLabelText("E-mail"), "maria@empresa.com.br");
    await user.type(screen.getByLabelText("Senha"), "SenhaForte1");
    await user.type(screen.getByLabelText("Confirmar senha"), "SenhaDiferente1");
    await user.click(screen.getByRole("checkbox"));
    await user.click(screen.getByRole("button", { name: "Criar conta" }));

    expect(await screen.findByText("As senhas não coincidem.")).toBeInTheDocument();
    expect(pushMock).not.toHaveBeenCalled();
  });

  it("exige aceite dos termos de uso", async () => {
    const { default: SignUpPage } = await import("./page");
    const user = userEvent.setup();
    render(<SignUpPage />);

    await user.type(screen.getByLabelText("Nome completo"), "Maria Souza");
    await user.type(screen.getByLabelText("E-mail"), "maria@empresa.com.br");
    await user.type(screen.getByLabelText("Senha"), "SenhaForte1");
    await user.type(screen.getByLabelText("Confirmar senha"), "SenhaForte1");
    await user.click(screen.getByRole("button", { name: "Criar conta" }));

    expect(await screen.findByText("É necessário aceitar os termos de uso.")).toBeInTheDocument();
    expect(pushMock).not.toHaveBeenCalled();
  });

  it("redireciona para confirmação de e-mail após cadastro válido", async () => {
    const { default: SignUpPage } = await import("./page");
    const user = userEvent.setup();
    render(<SignUpPage />);

    await user.type(screen.getByLabelText("Nome completo"), "Maria Souza");
    await user.type(screen.getByLabelText("E-mail"), "maria@empresa.com.br");
    await user.type(screen.getByLabelText("Senha"), "SenhaForte1");
    await user.type(screen.getByLabelText("Confirmar senha"), "SenhaForte1");
    await user.click(screen.getByRole("checkbox"));
    await user.click(screen.getByRole("button", { name: "Criar conta" }));

    await waitFor(() =>
      expect(pushMock).toHaveBeenCalledWith("/confirmar-email?email=maria%40empresa.com.br"),
    );
  });
});
