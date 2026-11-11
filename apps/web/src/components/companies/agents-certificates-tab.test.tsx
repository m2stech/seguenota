import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AgentsCertificatesTab } from "./agents-certificates-tab";

describe("AgentsCertificatesTab", () => {
  it("recusa o vínculo quando o CNPJ do certificado é diferente do CNPJ da empresa", async () => {
    const user = userEvent.setup();
    render(<AgentsCertificatesTab />);

    const row = screen.getByText("Transportes Rio Claro Ltda.").closest("tr");
    expect(row).not.toBeNull();
    await user.click(screen.getAllByRole("button", { name: /vincular empresa/i })[0]);

    await user.click(screen.getByLabelText("Empresa"));
    await user.click(await screen.findByRole("option", { name: /Serviços Nova Era ME/i }));
    await user.click(screen.getByRole("button", { name: "Confirmar vínculo" }));

    expect(
      await screen.findByText(
        "O CNPJ titular do certificado é diferente do CNPJ da empresa. O vínculo foi recusado.",
      ),
    ).toBeInTheDocument();
  });

  it("permite desvincular um certificado já associado a uma empresa", async () => {
    const user = userEvent.setup();
    render(<AgentsCertificatesTab />);

    const row = screen.getAllByText("Contabilidade Horizonte Ltda.")[0].closest("tr");
    expect(row).not.toBeNull();
    await user.click(within(row!).getByRole("button", { name: "Desvincular" }));

    expect(within(row!).getByText("Sem vínculo")).toBeInTheDocument();
  });

  it("gera um código de ativação único por agente ao clicar na ação", async () => {
    const user = userEvent.setup();
    render(<AgentsCertificatesTab />);

    await user.click(screen.getAllByRole("button", { name: /código de ativação/i })[0]);

    const code = await screen.findByText(/^[A-Z0-9]{3}-[A-Z0-9]{3}-[A-Z0-9]{3}$/);
    expect(code).toBeInTheDocument();
  });
});
