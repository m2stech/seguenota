import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CompaniesTab } from "./companies-tab";

describe("CompaniesTab", () => {
  it("rejeita um CNPJ com dígito verificador inválido ao cadastrar empresa", async () => {
    const user = userEvent.setup();
    render(<CompaniesTab />);

    await user.click(screen.getByRole("button", { name: "Cadastrar empresa" }));
    await user.type(screen.getByLabelText("CNPJ"), "11222333000182");
    await user.type(screen.getByLabelText("Razão social"), "Empresa Teste Ltda.");
    await user.click(screen.getByRole("button", { name: "Cadastrar" }));

    expect(
      await screen.findByText("CNPJ inválido. Verifique os dígitos informados."),
    ).toBeInTheDocument();
  });

  it("cadastra a empresa como pendente de vínculo", async () => {
    const user = userEvent.setup();
    render(<CompaniesTab />);

    await user.click(screen.getByRole("button", { name: "Cadastrar empresa" }));
    await user.type(screen.getByLabelText("CNPJ"), "11222333000181");
    await user.type(screen.getByLabelText("Razão social"), "Nova Empresa Ltda.");
    await user.click(screen.getByRole("button", { name: "Cadastrar" }));

    const row = await screen.findByText("Nova Empresa Ltda.");
    expect(row.closest("tr")).toHaveTextContent("Pendente de vínculo");
  });

  it("não permite desativar uma empresa pendente de vínculo", () => {
    render(<CompaniesTab />);

    const row = screen.getByText("Serviços Nova Era ME").closest("tr");
    expect(row).not.toBeNull();
    expect(row!.querySelector("button")).toBeDisabled();
  });
});
