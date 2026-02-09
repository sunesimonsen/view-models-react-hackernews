import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Router } from "@nano-router/react";
import { createMemoryHistory } from "@nano-router/history";
import { LinkButton } from "./LinkButton";
import { routes } from "./routes";

describe("LinkButton", () => {
  const renderLinkButton = (
    route: string,
    params?: Record<string, string>,
    children: React.ReactNode = "Click me"
  ) => {
    const history = createMemoryHistory({ initialEntries: ["/"] });
    return render(
      <Router history={history} routes={routes}>
        <LinkButton route={route} params={params}>
          {children}
        </LinkButton>
      </Router>
    );
  };

  it("renders children as link text", () => {
    renderLinkButton("home", undefined, "Go Home");

    expect(screen.getByText("Go Home")).toBeInTheDocument();
  });

  it("generates the correct href for the home route", () => {
    renderLinkButton("home");

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/");
  });

  it("generates the correct href for the story route with params", () => {
    renderLinkButton("story", { id: "456" });

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/stories/456");
  });

  it("generates the correct href for the comment route with params", () => {
    renderLinkButton("comment", { id: "789" });

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/comments/789");
  });
});
