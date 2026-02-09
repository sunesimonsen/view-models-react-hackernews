import { describe, it, expect, vi, afterEach } from "vitest";
import { render } from "@testing-library/react";
import { Skeleton } from "./Skeleton";

describe("Skeleton", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders a div with skeleton class", () => {
    const { container } = render(<Skeleton />);

    const skeleton = container.querySelector(".skeleton");
    expect(skeleton).toBeInTheDocument();
  });

  it("has a width style set", () => {
    vi.spyOn(Math, "random").mockReturnValue(0.5);

    const { container } = render(<Skeleton />);

    const skeleton = container.querySelector(".skeleton");
    expect(skeleton).toHaveAttribute("style", expect.stringContaining("px"));
  });

  it("generates width based on random value", () => {
    vi.spyOn(Math, "random").mockReturnValue(0);

    const { container } = render(<Skeleton />);

    const skeleton = container.querySelector(".skeleton");
    expect(skeleton).toHaveAttribute("style", "width: 500px;");
  });
});
