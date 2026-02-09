import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { Router } from "@nano-router/react";
import { createMemoryHistory } from "@nano-router/history";
import { TopBar } from "./TopBar";
import { HackerNewsContext } from "../context/HackerNewsContext";
import { HackerNewsModel } from "../state/HackerNewsModel";
import type { IHackerNewsApi } from "../api/HackerNewsApi";
import { routes } from "./routes";

const createMockApi = (): IHackerNewsApi => ({
  fetchTopStoryIds: vi.fn().mockResolvedValue([]),
  fetchStory: vi.fn(),
  fetchComment: vi.fn(),
});

describe("TopBar", () => {
  let api: IHackerNewsApi;
  let model: HackerNewsModel;

  const renderTopBar = (routePath: string) => {
    const history = createMemoryHistory({ initialEntries: [routePath] });
    return render(
      <HackerNewsContext.Provider value={model}>
        <Router history={history} routes={routes}>
          <TopBar />
        </Router>
      </HackerNewsContext.Provider>
    );
  };

  beforeEach(() => {
    api = createMockApi();
    model = new HackerNewsModel(api);
  });

  it("renders the home link", () => {
    renderTopBar("/");

    expect(screen.getByText("Hacker News")).toBeInTheDocument();
  });

  it("shows the reload button on the home route", () => {
    renderTopBar("/");

    expect(screen.getByRole("button", { name: "refresh" })).toBeInTheDocument();
  });

  it("hides the reload button on the story route", () => {
    renderTopBar("/stories/123");

    expect(screen.queryByRole("button", { name: "refresh" })).not.toBeInTheDocument();
  });

  it("hides the reload button on the comment route", () => {
    renderTopBar("/comments/456");

    expect(screen.queryByRole("button", { name: "refresh" })).not.toBeInTheDocument();
  });
});
