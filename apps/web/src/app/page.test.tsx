import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Home from "./page";

describe("Home", () => {
  it("renderiza sem quebrar", () => {
    render(<Home />);
    expect(screen.getByRole("link", { name: /documentation/i })).toBeInTheDocument();
  });
});
