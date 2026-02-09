import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { Router } from "@nano-router/react";
import { createMemoryHistory } from "@nano-router/history";
import { StoriesRoute } from "./StoriesRoute";
import { HackerNewsContext } from "../context/HackerNewsContext";
import { HackerNewsModel } from "../state/HackerNewsModel";
import type { IHackerNewsApi } from "../api/HackerNewsApi";
import { routes } from "./routes";

const createMockApi = (): IHackerNewsApi => ({
  fetchTopStoryIds: vi.fn().mockResolvedValue([]),
  fetchStory: vi.fn(),
  fetchComment: vi.fn(),
});

describe("StoriesRoute", () => {
  let api: IHackerNewsApi;
  let model: HackerNewsModel;

  const renderStoriesRoute = () => {
    const history = createMemoryHistory({ initialEntries: ["/"] });
    return render(
      <HackerNewsContext.Provider value={model}>
        <Router history={history} routes={routes}>
          <StoriesRoute />
        </Router>
      </HackerNewsContext.Provider>
    );
  };

  beforeEach(() => {
    api = createMockApi();
    model = new HackerNewsModel(api);
  });

  it("renders the DefaultLayout", () => {
    renderStoriesRoute();

    expect(screen.getByRole("main")).toBeInTheDocument();
    expect(screen.getByRole("banner")).toBeInTheDocument();
  });

  it("renders the Stories component", () => {
    renderStoriesRoute();

    expect(screen.getByRole("list")).toBeInTheDocument();
  });
});
