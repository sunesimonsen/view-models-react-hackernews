import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Router } from "@nano-router/react";
import { createMemoryHistory } from "@nano-router/history";
import { HomeLink } from "./HomeLink";
import { routes } from "./routes";

describe("HomeLink", () => {
  const renderHomeLink = () => {
    const history = createMemoryHistory({ initialEntries: ["/stories/123"] });
    return render(
      <Router history={history} routes={routes}>
        <HomeLink />
      </Router>
    );
  };

  it("renders the Hacker News brand text", () => {
    renderHomeLink();

    expect(screen.getByText("Hacker News")).toBeInTheDocument();
  });

  it("links to the home route", () => {
    renderHomeLink();

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/");
  });

  it("renders the logo image", () => {
    renderHomeLink();

    const logo = screen.getByAltText("Hacker News logo");
    expect(logo).toBeInTheDocument();
  });
});
