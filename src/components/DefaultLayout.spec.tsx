import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { Router } from "@nano-router/react";
import { createMemoryHistory } from "@nano-router/history";
import { DefaultLayout } from "./DefaultLayout";
import { HackerNewsContext } from "../context/HackerNewsContext";
import { HackerNewsModel } from "../state/HackerNewsModel";
import type { IHackerNewsApi } from "../api/HackerNewsApi";
import { routes } from "./routes";

const createMockApi = (): IHackerNewsApi => ({
  fetchTopStoryIds: vi.fn().mockResolvedValue([]),
  fetchStory: vi.fn(),
  fetchComment: vi.fn(),
});

describe("DefaultLayout", () => {
  let api: IHackerNewsApi;
  let model: HackerNewsModel;

  const renderDefaultLayout = (children: React.ReactNode) => {
    const history = createMemoryHistory({ initialEntries: ["/"] });
    return render(
      <HackerNewsContext.Provider value={model}>
        <Router history={history} routes={routes}>
          <DefaultLayout>{children}</DefaultLayout>
        </Router>
      </HackerNewsContext.Provider>
    );
  };

  beforeEach(() => {
    api = createMockApi();
    model = new HackerNewsModel(api);
  });

  it("renders a main element", () => {
    renderDefaultLayout(<div>Content</div>);

    expect(screen.getByRole("main")).toBeInTheDocument();
  });

  it("renders the TopBar", () => {
    renderDefaultLayout(<div>Content</div>);

    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByText("Hacker News")).toBeInTheDocument();
  });

  it("renders children in the content section", () => {
    renderDefaultLayout(<div data-testid="child">Child content</div>);

    expect(screen.getByTestId("child")).toBeInTheDocument();
    expect(screen.getByText("Child content")).toBeInTheDocument();
  });
});
