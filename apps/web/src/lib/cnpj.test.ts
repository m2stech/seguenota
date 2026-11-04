import { describe, expect, it } from "vitest";
import { formatCnpj, isValidCnpj } from "./cnpj";

describe("isValidCnpj", () => {
  it("aceita um CNPJ válido formatado", () => {
    expect(isValidCnpj("11.222.333/0001-81")).toBe(true);
  });

  it("aceita um CNPJ válido apenas com dígitos", () => {
    expect(isValidCnpj("11222333000181")).toBe(true);
  });

  it("rejeita um CNPJ com dígito verificador incorreto", () => {
    expect(isValidCnpj("11.222.333/0001-82")).toBe(false);
  });

  it("rejeita um CNPJ com todos os dígitos iguais", () => {
    expect(isValidCnpj("11.111.111/1111-11")).toBe(false);
  });

  it("rejeita um CNPJ com quantidade de dígitos incorreta", () => {
    expect(isValidCnpj("11.222.333/0001-8")).toBe(false);
  });

  it("rejeita string vazia", () => {
    expect(isValidCnpj("")).toBe(false);
  });
});

describe("formatCnpj", () => {
  it("formata dígitos progressivamente", () => {
    expect(formatCnpj("11222333000181")).toBe("11.222.333/0001-81");
  });

  it("ignora caracteres não numéricos na entrada", () => {
    expect(formatCnpj("11.222.333/0001-81")).toBe("11.222.333/0001-81");
  });

  it("trunca entradas com mais de 14 dígitos", () => {
    expect(formatCnpj("112223330001819999")).toBe("11.222.333/0001-81");
  });
});
