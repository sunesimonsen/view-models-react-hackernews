import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Html } from "./Html";

describe("Html", () => {
  it("renders plain text", () => {
    render(<Html html="Plain text content" />);

    expect(screen.getByText("Plain text content")).toBeInTheDocument();
  });

  it("renders HTML content", () => {
    render(<Html html="<strong>Bold text</strong>" />);

    const boldText = screen.getByText("Bold text");
    expect(boldText.tagName).toBe("STRONG");
  });

  it("renders nested HTML elements", () => {
    render(<Html html="<p>Paragraph with <a href='#'>a link</a></p>" />);

    expect(screen.getByText("a link")).toBeInTheDocument();
    expect(screen.getByRole("link")).toHaveAttribute("href", "#");
  });

  it("renders empty string without error", () => {
    const { container } = render(<Html html="" />);

    expect(container.querySelector("span")).toBeInTheDocument();
    expect(container.querySelector("span")).toBeEmptyDOMElement();
  });

  it("renders in a span element", () => {
    const { container } = render(<Html html="Content" />);

    expect(container.querySelector("span")).toBeInTheDocument();
  });
});
