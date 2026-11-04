import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { StepActivateAgent } from "./step-activate-agent";

describe("StepActivateAgent", () => {
  it("rejeita um código fora do formato esperado", async () => {
    const user = userEvent.setup();
    render(<StepActivateAgent onNext={vi.fn()} onBack={vi.fn()} />);

    await user.type(screen.getByLabelText("Código de ativação"), "codigo-invalido");
    await user.click(screen.getByRole("button", { name: "Ativar agente" }));

    expect(
      await screen.findByText("Código inválido. Use o formato XXX-XXX-XXX."),
    ).toBeInTheDocument();
  });

  it("exibe erro do servidor para código correto no formato mas inexistente", async () => {
    const user = userEvent.setup();
    render(<StepActivateAgent onNext={vi.fn()} onBack={vi.fn()} />);

    await user.type(screen.getByLabelText("Código de ativação"), "ZZZ-999-ZZZ");
    await user.click(screen.getByRole("button", { name: "Ativar agente" }));

    expect(
      await screen.findByText(
        "Código de ativação inválido ou expirado. Gere um novo código e tente novamente.",
      ),
    ).toBeInTheDocument();
  });

  it("confirma a conexão e habilita continuar com o código correto", async () => {
    const user = userEvent.setup();
    render(<StepActivateAgent onNext={vi.fn()} onBack={vi.fn()} />);

    await user.type(screen.getByLabelText("Código de ativação"), "ABC-123-XYZ");
    await user.click(screen.getByRole("button", { name: "Ativar agente" }));

    expect(
      await screen.findByText("Agente conectado com sucesso. Pronto para continuar."),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Continuar" })).toBeEnabled();
  });
});
