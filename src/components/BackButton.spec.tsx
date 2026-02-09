import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Router } from "@nano-router/react";
import { createMemoryHistory } from "@nano-router/history";
import { BackButton } from "./BackButton";
import { routes } from "./routes";

describe("BackButton", () => {
  const renderBackButton = (initialEntries: string[] = ["/"]) => {
    const history = createMemoryHistory({ initialEntries });
    return { history, ...render(
      <Router history={history} routes={routes}>
        <BackButton />
      </Router>
    )};
  };

  it("renders a button with X text", () => {
    renderBackButton();

    expect(screen.getByRole("button", { name: "X" })).toBeInTheDocument();
  });

  it("navigates back when clicked", async () => {
    const user = userEvent.setup();
    const { history } = renderBackButton(["/", "/stories/123"]);
    const backSpy = vi.spyOn(history, "back");

    await user.click(screen.getByRole("button", { name: "X" }));

    expect(backSpy).toHaveBeenCalled();
  });
});
