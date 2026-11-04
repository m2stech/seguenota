import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { StepAddCompanies } from "./step-add-companies";

describe("StepAddCompanies", () => {
  it("rejeita um CNPJ com dígito verificador inválido", async () => {
    const user = userEvent.setup();
    render(
      <StepAddCompanies
        companies={[]}
        onAdd={vi.fn()}
        onRemove={vi.fn()}
        onNext={vi.fn()}
        onBack={vi.fn()}
      />,
    );

    await user.type(screen.getByLabelText("CNPJ"), "11222333000182");
    await user.type(screen.getByLabelText("Razão social"), "Empresa Teste Ltda.");
    await user.click(screen.getByRole("button", { name: "Adicionar" }));

    expect(
      await screen.findByText("CNPJ inválido. Verifique os dígitos informados."),
    ).toBeInTheDocument();
  });

  it("adiciona a empresa e identifica que não há certificado correspondente", async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();
    render(
      <StepAddCompanies
        companies={[]}
        onAdd={onAdd}
        onRemove={vi.fn()}
        onNext={vi.fn()}
        onBack={vi.fn()}
      />,
    );

    await user.type(screen.getByLabelText("CNPJ"), "11222333000181");
    await user.type(screen.getByLabelText("Razão social"), "Empresa Sem Certificado Ltda.");

    expect(
      await screen.findByText(
        "Nenhum certificado detectado para este CNPJ ainda. Você poderá vincular depois, na tela de empresas.",
      ),
    ).toBeInTheDocument();

    expect(screen.getByLabelText("CNPJ")).toHaveValue("11.222.333/0001-81");
    await user.click(screen.getByRole("button", { name: "Adicionar" }));

    await waitFor(() =>
      expect(onAdd).toHaveBeenCalledWith({
        cnpj: "11.222.333/0001-81",
        name: "Empresa Sem Certificado Ltda.",
        hasMatchingCertificate: false,
      }),
    );
  });

  it("identifica certificado correspondente para um CNPJ já detectado", async () => {
    const user = userEvent.setup();
    render(
      <StepAddCompanies
        companies={[]}
        onAdd={vi.fn()}
        onRemove={vi.fn()}
        onNext={vi.fn()}
        onBack={vi.fn()}
      />,
    );

    await user.type(screen.getByLabelText("CNPJ"), "12345678000195");

    expect(
      await screen.findByText("Certificado correspondente encontrado para este CNPJ."),
    ).toBeInTheDocument();
  });

  it("mantém o botão Continuar desabilitado sem nenhuma empresa cadastrada", () => {
    render(
      <StepAddCompanies
        companies={[]}
        onAdd={vi.fn()}
        onRemove={vi.fn()}
        onNext={vi.fn()}
        onBack={vi.fn()}
      />,
    );

    expect(screen.getByRole("button", { name: "Continuar" })).toBeDisabled();
  });

  it("habilita o botão Continuar quando há ao menos uma empresa cadastrada", () => {
    render(
      <StepAddCompanies
        companies={[
          { cnpj: "11.222.333/0001-81", name: "Empresa Teste", hasMatchingCertificate: false },
        ]}
        onAdd={vi.fn()}
        onRemove={vi.fn()}
        onNext={vi.fn()}
        onBack={vi.fn()}
      />,
    );

    expect(screen.getByRole("button", { name: "Continuar" })).toBeEnabled();
  });
});
